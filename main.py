import asyncio
import paramiko
from typing import Literal, List

from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

from database import SessionLocal, Material, init_db
from config import SSH_KEY_PATH, DEFAULT_USER
from security import generate_daily_ws_path, generate_token, verify_token

app = FastAPI()

# -------------------------
# Mount static and templates
# -------------------------
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# -------------------------
# Initialize DB
# -------------------------
init_db()

# -------------------------
# WebSocket path
# -------------------------
WS_PATH = generate_daily_ws_path()

# -------------------------
# Routes
# -------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    token = generate_token()
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "ws_path": WS_PATH, "token": token}
    )

@app.get("/about", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse(
        "about.html",
        {"request": request}
    )

@app.get("/md", response_class=HTMLResponse)
async def md_page(request: Request):
    return templates.TemplateResponse(
        "md.html",
        {"request": request}
    )

@app.get("/structures", response_class=HTMLResponse)
async def structures_page(request: Request):
    return templates.TemplateResponse(
        "structures.html",
        {"request": request}
    )


@app.get("/analysis", response_class=HTMLResponse)
async def analysis_page(request: Request):
    return templates.TemplateResponse(
        "analysis.html",
        {"request": request}
    )


@app.get("/console", response_class=HTMLResponse)
async def console_page(request: Request):
    token = generate_token()
    return templates.TemplateResponse(
        "console.html",
        {"request": request, "ws_path": WS_PATH, "token": token}
    )


@app.get("/dft", response_class=HTMLResponse)
async def dft_page(request: Request):
    return templates.TemplateResponse(
        "dft.html",
        {"request": request}
    )


@app.get("/montecarlo", response_class=HTMLResponse)
async def montecarlo_page(request: Request):
    return templates.TemplateResponse(
        "montecarlo.html",
        {"request": request}
    )

@app.get("/api/materials")
def list_materials():
    with SessionLocal() as db:
        mats = db.query(Material).all()
        return [
            {
                "id": m.id,
                "mp_id": m.mp_id,
                "formula": m.formula,
                "space_group": m.space_group,
                "band_gap": m.band_gap,
                "energy_per_atom": m.energy_per_atom,
            }
            for m in mats
        ]

@app.get("/api/materials/{mat_id}")
def get_material(mat_id: int):
    with SessionLocal() as db:
        m = db.query(Material).filter(Material.id == mat_id).first()
        if not m:
            return JSONResponse({"error": "Material not found"}, status_code=404)
        return {
            "id": m.id,
            "mp_id": m.mp_id,
            "formula": m.formula,
            "space_group": m.space_group,
            "band_gap": m.band_gap,
            "energy_per_atom": m.energy_per_atom,
            "structure_file": m.structure_file
        }

@app.post("/api/md/run")
async def run_md(request: Request):
    """
    Submit a simple MD calculation via LAMMPS on a remote host.
    This is a thin wrapper around the SSH helper and expects a JSON body:
    { "host": "...", "command": "lmp -in in.smad_md" }.
    """
    data = await request.json()
    host = data.get("host")
    command = data.get("command")

    if not host or not command:
        return JSONResponse({"error": "Missing host or command"}, status_code=400)

    try:
        output = await run_ssh(host, command)
        return {"output": output}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


# -------------------------
# Structure builder APIs
# -------------------------

class SlabOptions(BaseModel):
    miller: list[int] = Field(..., min_length=3, max_length=3, description="[h, k, l]")
    min_slab: float = Field(10.0, ge=1.0, description="Minimum slab thickness (Å)")
    min_vacuum: float = Field(15.0, ge=1.0, description="Minimum vacuum thickness (Å)")


class StructureParseRequest(BaseModel):
    text: str = Field(..., min_length=1, description="CIF or POSCAR content")
    fmt: Literal["auto", "cif", "poscar"] = "auto"
    supercell: list[int] | None = Field(default=None, description="[a, b, c] multipliers")
    slab: SlabOptions | None = None


class EmpiricalFormulaRequest(BaseModel):
    formula: str = Field(..., min_length=1)
    formula_units: int = Field(1, ge=1, description="Z (formula units)")


def _load_structure_from_text(text: str, fmt: Literal["auto", "cif", "poscar"]):
    from pymatgen.core import Structure

    if fmt == "cif":
        return Structure.from_str(text, fmt="cif")
    if fmt == "poscar":
        return Structure.from_str(text, fmt="poscar")

    # auto: try cif then poscar
    try:
        return Structure.from_str(text, fmt="cif")
    except Exception:
        return Structure.from_str(text, fmt="poscar")


def _structure_summary(structure):
    from pymatgen.symmetry.analyzer import SpacegroupAnalyzer

    comp = structure.composition
    lattice = structure.lattice

    spg_symbol = None
    spg_number = None
    wyckoff = None
    try:
        sga = SpacegroupAnalyzer(structure, symprec=0.1)
        spg_symbol = sga.get_space_group_symbol()
        spg_number = sga.get_space_group_number()
        try:
            symm = sga.get_symmetrized_structure()
            wyckoff = symm.wyckoff_symbols
        except Exception:
            wyckoff = None
    except Exception:
        pass

    return {
        "formula": comp.formula,
        "reduced_formula": comp.reduced_formula,
        "elements": [el.symbol for el in comp.elements],
        "num_sites": len(structure.sites),
        "lattice": {
            "a": lattice.a,
            "b": lattice.b,
            "c": lattice.c,
            "alpha": lattice.alpha,
            "beta": lattice.beta,
            "gamma": lattice.gamma,
            "volume": lattice.volume,
        },
        "space_group": {"symbol": spg_symbol, "number": spg_number},
        "wyckoff_symbols": wyckoff,
    }


def _short_distance_pairs(structure, max_sites: int = 120, r: float = 6.0, max_pairs: int = 60):
    # Build a short list of nearest neighbor pairs for display.
    pairs = []
    n = min(len(structure.sites), max_sites)
    if n <= 1:
        return pairs

    # Typical length scale for "scaled distances"
    scaled_ref = (structure.lattice.volume ** (1.0 / 3.0)) if structure.lattice.volume else 1.0

    for i in range(n):
        site = structure.sites[i]
        try:
            neighbors = structure.get_neighbors(site, r)
        except Exception:
            continue

        for nb in neighbors:
            j = getattr(nb, "index", None)
            if j is None or j <= i or j >= n:
                continue
            dist = float(getattr(nb, "distance", 0.0))
            if dist <= 1e-8:
                continue
            pairs.append(
                {
                    "i": i,
                    "j": j,
                    "species_i": str(site.specie),
                    "species_j": str(structure.sites[j].specie),
                    "distance": dist,
                    "scaled_distance": dist / scaled_ref if scaled_ref else None,
                }
            )

    pairs.sort(key=lambda x: x["distance"])
    # De-duplicate (i,j) pairs
    seen = set()
    uniq = []
    for p in pairs:
        key = (p["i"], p["j"])
        if key in seen:
            continue
        seen.add(key)
        uniq.append(p)
        if len(uniq) >= max_pairs:
            break
    return uniq


@app.post("/api/structures/parse")
async def parse_structure(payload: StructureParseRequest):
    try:
        structure = _load_structure_from_text(payload.text, payload.fmt)
    except Exception as e:
        return JSONResponse({"error": f"Failed to parse structure: {str(e)}"}, status_code=400)

    if payload.supercell:
        if len(payload.supercell) != 3 or any(int(x) < 1 for x in payload.supercell):
            return JSONResponse({"error": "supercell must be [a,b,c] with integers >= 1"}, status_code=400)
        structure = structure.copy()
        structure.make_supercell([int(x) for x in payload.supercell])

    if payload.slab:
        try:
            from pymatgen.core.surface import SlabGenerator

            miller = [int(x) for x in payload.slab.miller]
            sg = SlabGenerator(
                initial_structure=structure,
                miller_index=miller,
                min_slab_size=float(payload.slab.min_slab),
                min_vacuum_size=float(payload.slab.min_vacuum),
                center_slab=True,
                in_unit_planes=True,
            )
            slabs = sg.get_slabs(symmetrize=True)
            if not slabs:
                return JSONResponse({"error": "No slab could be generated for these settings."}, status_code=400)
            structure = slabs[0]
        except Exception as e:
            return JSONResponse({"error": f"Failed to generate slab: {str(e)}"}, status_code=400)

    # Export formats
    cif_str = None
    poscar_str = None
    try:
        cif_str = structure.to(fmt="cif")
    except Exception:
        cif_str = None
    try:
        from pymatgen.io.vasp import Poscar

        poscar_str = Poscar(structure).get_string()
    except Exception:
        poscar_str = None

    return {
        "summary": _structure_summary(structure),
        "distance_pairs": _short_distance_pairs(structure),
        "exports": {"cif": cif_str, "poscar": poscar_str},
    }


@app.post("/api/structures/empirical")
async def analyze_empirical(payload: EmpiricalFormulaRequest):
    try:
        from pymatgen.core.composition import Composition

        comp = Composition(payload.formula)
    except Exception as e:
        return JSONResponse({"error": f"Invalid formula: {str(e)}"}, status_code=400)

    z = int(payload.formula_units)
    comp_z = comp * z
    return {
        "formula": comp.formula,
        "reduced_formula": comp.reduced_formula,
        "elements": [el.symbol for el in comp.elements],
        "num_atoms_reduced": int(comp.num_atoms),
        "formula_units": z,
        "formula_z": comp_z.formula,
        "weight": float(comp.weight),
        "weight_z": float(comp_z.weight),
    }


# -------------------------
# Analysis & reporting APIs (phase diagram, band gap, DOS, BZ, diffraction)
# -------------------------

@app.get("/api/analysis/phase_diagram")
def analysis_phase_diagram():
    """Phase diagram data from materials DB: formula, composition fractions, energy_per_atom."""
    from pymatgen.core.composition import Composition

    with SessionLocal() as db:
        mats = db.query(Material).filter(Material.formula.isnot(None)).all()
    out = []
    for m in mats:
        if not m.formula or m.formula.strip() == "":
            continue
        try:
            comp = Composition(m.formula)
            frac = comp.fractional_composition
            el_fracs = {el.symbol: frac[el] for el in frac.elements}
            out.append({
                "id": m.id,
                "formula": m.formula,
                "energy_per_atom": m.energy_per_atom,
                "band_gap": m.band_gap,
                "elements": list(el_fracs.keys()),
                "composition": el_fracs,
            })
        except Exception:
            continue
    return {"materials": out}


@app.get("/api/analysis/band_gaps")
def analysis_band_gaps():
    """Band gap data from materials DB (and QE results when linked)."""
    with SessionLocal() as db:
        mats = db.query(Material).filter(Material.formula.isnot(None)).all()
    return {
        "materials": [
            {"id": m.id, "formula": m.formula, "band_gap": m.band_gap, "mp_id": m.mp_id}
            for m in mats
        ]
    }


class DosParseRequest(BaseModel):
    text: str = Field(..., min_length=1, description="QE-style DOS file content (energy, DOS columns)")


@app.post("/api/analysis/dos")
async def analysis_dos_parse(payload: DosParseRequest):
    """Parse QE-style DOS data (two-column: energy, DOS) for plotting. Uses data from QE results."""
    lines = [s.strip() for s in payload.text.strip().splitlines() if s.strip()]
    energy, dos = [], []
    for line in lines:
        if line.startswith("#") or line.startswith("!"):
            continue
        parts = line.split()
        if len(parts) >= 2:
            try:
                energy.append(float(parts[0]))
                # sum spin channels if more columns
                dos.append(sum(float(parts[i]) for i in range(1, min(len(parts), 4))))
            except ValueError:
                continue
    if not energy:
        return JSONResponse({"error": "No numeric energy/DOS columns found."}, status_code=400)
    return {"energy": energy, "dos": dos}


class BrillouinRequest(BaseModel):
    text: str = Field(..., min_length=1)
    fmt: Literal["auto", "cif", "poscar"] = "auto"


def _load_structure_from_text_analysis(text: str, fmt: str):
    from pymatgen.core import Structure

    if fmt == "cif":
        return Structure.from_str(text, fmt="cif")
    if fmt == "poscar":
        return Structure.from_str(text, fmt="poscar")
    try:
        return Structure.from_str(text, fmt="cif")
    except Exception:
        return Structure.from_str(text, fmt="poscar")


@app.post("/api/analysis/brillouin")
async def analysis_brillouin(payload: BrillouinRequest):
    """Brillouin zone: reciprocal lattice and high-symmetry k-path from structure."""
    try:
        structure = _load_structure_from_text_analysis(payload.text, payload.fmt)
    except Exception as e:
        return JSONResponse({"error": f"Failed to parse structure: {str(e)}"}, status_code=400)
    try:
        from pymatgen.symmetry.kpath import HighSymmKpath

        kpath = HighSymmKpath(structure)
        path = kpath.get_kpath()
        rec = structure.lattice.reciprocal_lattice
        return {
            "reciprocal_lattice": {
                "a": rec.abc[0],
                "b": rec.abc[1],
                "c": rec.abc[2],
                "alpha": rec.angles[0],
                "beta": rec.angles[1],
                "gamma": rec.angles[2],
            },
            "kpath": {
                "path": path.get("path", []),
                "kpoints": path.get("kpoints", {}),
            },
        }
    except Exception as e:
        return JSONResponse({"error": f"BZ/kpath failed: {str(e)}"}, status_code=400)


class DiffractionRequest(BaseModel):
    text: str = Field(..., min_length=1)
    fmt: Literal["auto", "cif", "poscar"] = "auto"
    wavelength: float = Field(1.5406, description="Wavelength (Å), e.g. Cu Kα 1.5406, Mo Kα 0.7107")
    radiation: str | None = Field(None, description="Pre-set: CuKa, MoKa, etc.")
    shape_factor: float = Field(0.9, ge=0.1, le=1.5, description="Scherrer constant K")
    peak_profile: Literal["gaussian", "lorentzian"] = "gaussian"
    scherrer_crystallite_size_nm: float | None = Field(None, ge=0.1, description="Crystallite size (nm) for broadening")
    two_theta_min: float = 5.0
    two_theta_max: float = 90.0


class CustomAtom(BaseModel):
    element: str
    x: float
    y: float
    z: float
    occupancy: float = 1.0
    B_iso: float = 0.5


class DiffractionCustomRequest(BaseModel):
    """Custom unit cell + atoms (XRD from xrd_generator.py, no pymatgen)."""
    a: float = Field(..., gt=0)
    b: float = Field(..., gt=0)
    c: float = Field(..., gt=0)
    alpha: float = 90.0
    beta: float = 90.0
    gamma: float = 90.0
    spacegroup: str = "P1"
    atoms: List[CustomAtom] = Field(..., min_length=1)
    wavelength: float = 1.5406
    shape_factor: float = Field(0.9, ge=0.1, le=1.5)
    scherrer_crystallite_size_nm: float | None = Field(None, ge=0.1)
    two_theta_min: float = 5.0
    two_theta_max: float = 90.0
    hkl_max: int = Field(10, ge=1, le=15)
    peak_width: float = Field(0.15, ge=0.02, le=1.0)


@app.post("/api/analysis/diffraction")
async def analysis_diffraction(payload: DiffractionRequest):
    """Diffraction pattern with radiation source, shape factor, peak profile, Scherrer crystallite size."""
    try:
        structure = _load_structure_from_text_analysis(payload.text, payload.fmt)
    except Exception as e:
        return JSONResponse({"error": f"Failed to parse structure: {str(e)}"}, status_code=400)

    try:
        from pymatgen.analysis.diffraction.xrd import XRDCalculator
        import math

        two_theta_range = (payload.two_theta_min, payload.two_theta_max)
        rad = payload.radiation or "CuKa"
        if payload.radiation:
            calc = XRDCalculator(wavelength=rad)
        else:
            calc = XRDCalculator(wavelength=payload.wavelength)
        pattern = calc.get_pattern(structure, two_theta_range=two_theta_range)
    except Exception as e:
        return JSONResponse({"error": f"XRD failed: {str(e)}"}, status_code=400)

    two_theta = pattern.x.tolist()
    intensity = pattern.y.tolist()
    peak_list = []
    for t, i, hkl_list in zip(pattern.x, pattern.y, pattern.hkls):
        hkls = [d.get("hkl", (0, 0, 0)) for d in hkl_list] if isinstance(hkl_list, list) else []
        peak_list.append({"two_theta": float(t), "intensity": float(i), "hkl": hkls})

    L_nm = payload.scherrer_crystallite_size_nm
    if L_nm is not None and L_nm > 0:
        lam = getattr(calc, "wavelength", payload.wavelength)
        if isinstance(lam, str):
            lam = 1.5406
        K = payload.shape_factor
        broadened_x, broadened_y = [], []
        for t2, I in zip(two_theta, intensity):
            theta_rad = math.radians(t2 / 2.0)
            cos_t = max(math.cos(theta_rad), 1e-6)
            fwhm = K * lam / (L_nm * 10.0 * cos_t)
            fwhm_deg = min(0.5, math.degrees(2 * math.asin(fwhm * 0.01)) if fwhm < 0.02 else 0.5)
            for dx in [-1.5 * fwhm_deg, -0.5 * fwhm_deg, 0, 0.5 * fwhm_deg, 1.5 * fwhm_deg]:
                broadened_x.append(t2 + dx)
                if payload.peak_profile == "lorentzian":
                    broadened_y.append(I * (fwhm_deg ** 2) / ((fwhm_deg ** 2) + (dx ** 2)))
                else:
                    broadened_y.append(I * math.exp(-0.5 * (dx / (fwhm_deg / 2.355)) ** 2))
        two_theta = broadened_x
        intensity = broadened_y

    return {
        "two_theta": two_theta,
        "intensity": intensity,
        "peak_list": peak_list,
        "wavelength": getattr(calc, "wavelength", payload.wavelength),
        "shape_factor": payload.shape_factor,
        "peak_profile": payload.peak_profile,
        "scherrer_size_nm": payload.scherrer_crystallite_size_nm,
    }


@app.post("/api/analysis/diffraction/custom")
async def analysis_diffraction_custom(payload: DiffractionCustomRequest):
    """
    XRD pattern from custom unit cell + atoms using the built-in generator
    (Cromer-Mann form factors, systematic absences, LP correction, Scherrer broadening).
    Use this when you have lattice parameters and fractional coordinates without a CIF.
    """
    try:
        from xrd_generator import (
            Crystal,
            UnitCell,
            Atom,
            XRDPattern,
        )
    except ImportError as e:
        return JSONResponse(
            {"error": "xrd_generator module not available: " + str(e)},
            status_code=500,
        )
    uc = UnitCell(
        a=payload.a,
        b=payload.b,
        c=payload.c,
        alpha=payload.alpha,
        beta=payload.beta,
        gamma=payload.gamma,
        spacegroup=payload.spacegroup,
        atoms=[
            Atom(
                element=a.element,
                x=a.x,
                y=a.y,
                z=a.z,
                occupancy=a.occupancy,
                B_iso=a.B_iso,
            )
            for a in payload.atoms
        ],
    )
    crystal = Crystal(unit_cell=uc)
    xrd = XRDPattern(
        crystal,
        wavelength=payload.wavelength,
        two_theta_range=(payload.two_theta_min, payload.two_theta_max),
        hkl_max=payload.hkl_max,
        peak_width=payload.peak_width,
        scherrer_size_nm=payload.scherrer_crystallite_size_nm,
        shape_factor_k=payload.shape_factor,
    )
    xrd.compute_reflections()
    tt, intensity = xrd.generate_pattern(n_points=4000)
    peak_list = xrd.get_peak_list()
    return {
        "two_theta": tt.tolist(),
        "intensity": intensity.tolist(),
        "peak_list": peak_list,
        "wavelength": payload.wavelength,
        "shape_factor": payload.shape_factor,
        "peak_profile": "gaussian",
        "scherrer_size_nm": payload.scherrer_crystallite_size_nm,
    }


class ChargeDensityRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Gaussian cube file content")
    slice_axis: Literal["x", "y", "z"] = "z"
    slice_index: int = Field(0, ge=0, description="Layer index (0 = first)")


@app.post("/api/analysis/charge_density")
async def analysis_charge_density(payload: ChargeDensityRequest):
    """Charge density 2D slice from cube file (e.g. from QE)."""
    lines = [s.strip() for s in payload.text.strip().splitlines()]
    if len(lines) < 6:
        return JSONResponse({"error": "Cube file too short."}, status_code=400)
    try:
        # Standard Gaussian cube: line 0,1 comment; line 2 natoms ox oy oz; line 3,4,5 nx vx vy vz etc.
        parts2 = lines[2].split()
        natoms = int(parts2[0])
        idx = 3
        if natoms < 0:
            natoms = -natoms
        nx = int(lines[3].split()[0])
        ny = int(lines[4].split()[0])
        nz = int(lines[5].split()[0])
        idx = 6 + natoms
        data = []
        for line in lines[idx:]:
            data.extend([float(x) for x in line.split()])
        if len(data) != nx * ny * nz:
            return JSONResponse({"error": "Cube grid size mismatch."}, status_code=400)
        axis = payload.slice_axis
        si = min(max(0, payload.slice_index), {"x": nx, "y": ny, "z": nz}[axis] - 1)
        slice_2d = []
        if axis == "z":
            for iy in range(ny):
                slice_2d.append([data[ix + iy * nx + si * nx * ny] for ix in range(nx)])
        elif axis == "y":
            for iz in range(nz):
                slice_2d.append([data[ix + si * nx + iz * nx * ny] for ix in range(nx)])
        else:
            for iz in range(nz):
                slice_2d.append([data[si + iy * nx + iz * nx * ny] for iy in range(ny)])
        return {"slice": slice_2d, "axis": axis, "index": si}
    except Exception as e:
        return JSONResponse({"error": f"Failed to parse cube: {str(e)}"}, status_code=400)


# -------------------------
# WebSocket for SSH commands
# -------------------------
@app.websocket(WS_PATH)
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    if not verify_token(token):
        await websocket.close(code=1008)
        return

    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            host = data.get("server_ip")
            command = data.get("command")

            if not host or not command:
                await websocket.send_json({"error": "Missing host or command"})
                continue

            try:
                output = await run_ssh(host, command)
                await websocket.send_json({"output": output})
            except Exception as e:
                await websocket.send_json({"error": str(e)})

    except Exception as e:
        await websocket.send_json({"error": f"WebSocket closed: {str(e)}"})

# -------------------------
# SSH helpers
# -------------------------
async def run_ssh(host: str, command: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, ssh_blocking, host, command)

def ssh_blocking(host: str, command: str) -> str:
    key = paramiko.Ed25519Key.from_private_key_file(SSH_KEY_PATH)
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        client.connect(hostname=host, username=DEFAULT_USER, pkey=key)
        stdin, stdout, stderr = client.exec_command(command)
        return stdout.read().decode() + stderr.read().decode()
    finally:
        client.close()
