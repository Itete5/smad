import asyncio
import hashlib
import json
import paramiko
from pathlib import Path
from typing import Literal, List

from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
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

_APP_DIR = Path(__file__).resolve().parent


def _static_file_cache_bust(relative_path: str, nbytes: int = 12) -> str:
    """Short hash so iframe URLs change when the static file changes (avoids stale browser/CDN cache)."""
    try:
        data = (_APP_DIR / relative_path).read_bytes()
        return hashlib.md5(data).hexdigest()[:nbytes]
    except OSError:
        return "0"

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
def _load_superconductors_data():
    data_path = Path(__file__).parent / "data" / "superconductors.json"
    try:
        with open(data_path, encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {"last_updated": "", "materials": []}


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    token = generate_token()
    superconductors_data = _load_superconductors_data()
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "ws_path": WS_PATH,
            "token": token,
            "superconductors_data": superconductors_data,
            "community_iframe_v": _static_file_cache_bust("static/community_ideas.html"),
        },
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
async def structures_page():
    return FileResponse(
        Path(__file__).resolve().parent / "static" / "crystalforge.html",
        media_type="text/html; charset=utf-8",
    )


@app.get("/analysis", response_class=HTMLResponse)
async def analysis_page():
    return FileResponse(
        Path(__file__).resolve().parent / "static" / "analysis_v3.html",
        media_type="text/html; charset=utf-8",
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


@app.get("/raman", response_class=HTMLResponse)
async def raman_page(request: Request):
    return templates.TemplateResponse(
        "raman.html",
        {"request": request}
    )


@app.get("/vibrations", response_class=HTMLResponse)
async def vibrations_page(request: Request):
    return templates.TemplateResponse(
        "vibrations.html",
        {"request": request}
    )


@app.get("/seekpath", response_class=HTMLResponse)
async def seekpath_page(request: Request):
    return templates.TemplateResponse(
        "seekpath.html",
        {"request": request}
    )


@app.get("/phonons", response_class=HTMLResponse)
async def phonons_page(request: Request):
    return templates.TemplateResponse(
        "phonons.html",
        {"request": request}
    )


@app.get("/databases", response_class=HTMLResponse)
async def databases_page(request: Request):
    embed = request.query_params.get("embed") in ("1", "true", "yes")
    return templates.TemplateResponse(
        "databases.html",
        {"request": request, "embed": embed},
    )


# -------------------------
# Raman / Vibrations API (placeholder stubs)
# -------------------------
class RamanSimulateRequest(BaseModel):
    mpid: str
    avgmode: str = "xx_par"
    stokesmode: str = "Stokes"
    normalize: bool = True
    temperature: float = 300
    sigma: float = 4
    llaser: float = 532
    irayleigh: float = 0
    wnmin: float = 0
    wnmax: float = 2000
    wnstep: float = 1
    pin: List[float] | None = None
    pout: List[float] | None = None


@app.post("/api/raman/simulate")
async def raman_simulate(payload: RamanSimulateRequest):
    """
    Placeholder Raman simulation endpoint.
    In production, connect to CRD API or local phonon/Raman database.
    Returns example Gaussian peaks for demonstration.
    """
    import numpy as np
    wn = np.arange(payload.wnmin, payload.wnmax, payload.wnstep)
    peaks = [200, 400, 520, 800, 1100]
    intensities_raw = [0.6, 1.0, 0.8, 0.3, 0.5]
    spectrum = np.zeros_like(wn, dtype=float)
    for pk, inten in zip(peaks, intensities_raw):
        spectrum += inten * np.exp(-((wn - pk) ** 2) / (2 * payload.sigma ** 2))
    if payload.normalize and spectrum.max() > 0:
        spectrum = spectrum / spectrum.max()
    return {
        "wavenumber": wn.tolist(),
        "intensity": spectrum.tolist(),
        "mpid": payload.mpid,
    }


class VibrationsLoadRequest(BaseModel):
    mpid: str


@app.post("/api/vibrations/load")
async def vibrations_load(payload: VibrationsLoadRequest):
    """
    Placeholder vibrations/phonon loading endpoint.
    In production, fetch from CRD, Materials Project, or local phonon DB.
    Returns example structure and dummy dispersion for demonstration.
    """
    return {
        "name": f"Example mp-{payload.mpid}",
        "lattice": {"a": 5.43, "b": 5.43, "c": 5.43},
        "atoms": [
            {"element": "Si", "x": 0.0, "y": 0.0, "z": 0.0, "cart_x": 0.0, "cart_y": 0.0, "cart_z": 0.0},
            {"element": "Si", "x": 0.25, "y": 0.25, "z": 0.25, "cart_x": 1.36, "cart_y": 1.36, "cart_z": 1.36},
        ],
        "modes": [
            {"frequency": 0.0},
            {"frequency": 120.5},
            {"frequency": 250.3},
            {"frequency": 520.0},
        ],
        "dispersion": {
            "distances": [0, 0.2, 0.4, 0.6, 0.8, 1.0],
            "bands": [
                [0, 50, 100, 120, 100, 50],
                [100, 150, 200, 220, 200, 150],
                [300, 350, 400, 420, 400, 350],
                [500, 510, 520, 525, 520, 510],
            ],
        },
    }


class SeekPathRequest(BaseModel):
    structure_text: str
    file_format: str = "cif"
    symprec: float = 0.01


@app.post("/api/seekpath/analyze")
async def seekpath_analyze(payload: SeekPathRequest):
    """
    Analyze a crystal structure: find spacegroup, primitive cell, BZ, and k-path.
    Uses pymatgen and spglib (via pymatgen's symmetry module).
    """
    try:
        from pymatgen.core import Structure
        from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
        from pymatgen.symmetry.bandstructure import HighSymmKpath
        import numpy as np
    except ImportError as e:
        return JSONResponse({"error": f"pymatgen not available: {e}"}, status_code=500)

    try:
        if payload.file_format.lower() == "poscar":
            from pymatgen.io.vasp import Poscar
            poscar = Poscar.from_str(payload.structure_text)
            structure = poscar.structure
        else:
            from pymatgen.io.cif import CifParser
            parser = CifParser.from_str(payload.structure_text)
            structure = parser.parse_structures()[0]
    except Exception as e:
        return JSONResponse({"error": f"Failed to parse structure: {e}"}, status_code=400)

    try:
        sga = SpacegroupAnalyzer(structure, symprec=payload.symprec)
        spacegroup_symbol = sga.get_space_group_symbol()
        spacegroup_number = sga.get_space_group_number()
        crystal_system = sga.get_crystal_system()
        point_group = sga.get_point_group_symbol()
        primitive = sga.get_primitive_standard_structure()

        kpath = HighSymmKpath(structure, symprec=payload.symprec)
        kpoints = kpath.kpath["kpoints"]
        path = kpath.kpath["path"]

        lattice = primitive.lattice
        lattice_params = {
            "a": float(lattice.a),
            "b": float(lattice.b),
            "c": float(lattice.c),
            "alpha": float(lattice.alpha),
            "beta": float(lattice.beta),
            "gamma": float(lattice.gamma),
        }
        lattice_matrix = lattice.matrix.tolist()

        recip_lattice = lattice.reciprocal_lattice
        recip_matrix = recip_lattice.matrix.tolist()

        atoms = []
        for site in primitive:
            atoms.append({
                "element": str(site.specie),
                "frac": site.frac_coords.tolist(),
                "cart": site.coords.tolist(),
            })

        kpoints_out = {k: v.tolist() for k, v in kpoints.items()}

        path_segments = []
        for seg in path:
            path_segments.append(list(seg))

        return {
            "spacegroup_symbol": spacegroup_symbol,
            "spacegroup_number": spacegroup_number,
            "crystal_system": crystal_system,
            "point_group": point_group,
            "lattice_params": lattice_params,
            "lattice_matrix": lattice_matrix,
            "reciprocal_matrix": recip_matrix,
            "primitive_natoms": len(primitive),
            "atoms": atoms,
            "kpoints": kpoints_out,
            "path": path_segments,
            "formula": primitive.composition.reduced_formula,
        }
    except Exception as e:
        return JSONResponse({"error": f"Symmetry analysis failed: {e}"}, status_code=500)


class PhononDataRequest(BaseModel):
    """Phonon dispersion data in PhononVis JSON-like format or parsed from structure."""
    json_data: dict | None = None
    example: str | None = None


@app.post("/api/phonons/load")
async def phonons_load(payload: PhononDataRequest):
    """
    Load phonon dispersion data.
    Accepts PhononVis JSON format or returns example data.
    """
    import numpy as np

    if payload.json_data:
        return payload.json_data

    examples = {
        "Si": {
            "name": "Silicon (diamond)",
            "natoms": 2,
            "lattice": [[0, 2.715, 2.715], [2.715, 0, 2.715], [2.715, 2.715, 0]],
            "atom_types": ["Si", "Si"],
            "atom_numbers": [14, 14],
            "atom_pos_car": [[0, 0, 0], [1.3575, 1.3575, 1.3575]],
            "atom_pos_red": [[0, 0, 0], [0.25, 0.25, 0.25]],
            "highsym_qpts": [[0, "Γ"], [20, "X"], [30, "W"], [40, "L"], [60, "Γ"], [80, "K"]],
            "qpoints": [
                [0, 0, 0], [0.025, 0, 0.025], [0.05, 0, 0.05], [0.075, 0, 0.075], [0.1, 0, 0.1],
                [0.125, 0, 0.125], [0.15, 0, 0.15], [0.175, 0, 0.175], [0.2, 0, 0.2], [0.225, 0, 0.225],
                [0.25, 0, 0.25], [0.275, 0, 0.275], [0.3, 0, 0.3], [0.325, 0, 0.325], [0.35, 0, 0.35],
                [0.375, 0, 0.375], [0.4, 0, 0.4], [0.425, 0, 0.425], [0.45, 0, 0.45], [0.475, 0, 0.475],
                [0.5, 0, 0.5],
            ],
            "distances": list(np.linspace(0, 1, 21)),
            "eigenvalues": [
                [0, 50, 100, 140, 170, 190, 200, 205, 200, 190, 170, 140, 100, 60, 30, 10, 5, 10, 30, 60, 100],
                [0, 50, 100, 140, 170, 190, 200, 205, 200, 190, 170, 140, 100, 60, 30, 10, 5, 10, 30, 60, 100],
                [0, 80, 150, 200, 240, 270, 290, 300, 300, 295, 280, 260, 230, 190, 140, 90, 50, 30, 40, 70, 120],
                [480, 490, 500, 505, 510, 512, 515, 516, 515, 512, 508, 502, 495, 487, 480, 475, 472, 475, 480, 490, 500],
                [480, 490, 500, 505, 510, 512, 515, 516, 515, 512, 508, 502, 495, 487, 480, 475, 472, 475, 480, 490, 500],
                [500, 505, 510, 512, 515, 516, 518, 519, 520, 520, 519, 517, 514, 510, 505, 500, 498, 500, 505, 512, 520],
            ],
        },
        "Graphene": {
            "name": "Graphene (2D)",
            "natoms": 2,
            "lattice": [[2.46, 0, 0], [-1.23, 2.13, 0], [0, 0, 15]],
            "atom_types": ["C", "C"],
            "atom_numbers": [6, 6],
            "atom_pos_car": [[0, 0, 0], [1.23, 0.71, 0]],
            "atom_pos_red": [[0, 0, 0], [0.333, 0.667, 0]],
            "highsym_qpts": [[0, "Γ"], [30, "M"], [50, "K"], [80, "Γ"]],
            "qpoints": [[0, 0, 0], [0.167, 0, 0], [0.333, 0, 0], [0.5, 0, 0]],
            "distances": list(np.linspace(0, 1, 30)),
            "eigenvalues": [
                list(np.linspace(0, 900, 30)),
                list(np.linspace(0, 900, 30)),
                list(np.linspace(0, 600, 30)),
                list(np.linspace(1200, 1580, 30)),
                list(np.linspace(1200, 1580, 30)),
                list(np.linspace(800, 1200, 30)),
            ],
        },
        "GaAs": {
            "name": "GaAs (zinc blende)",
            "natoms": 2,
            "lattice": [[0, 2.83, 2.83], [2.83, 0, 2.83], [2.83, 2.83, 0]],
            "atom_types": ["Ga", "As"],
            "atom_numbers": [31, 33],
            "atom_pos_car": [[0, 0, 0], [1.415, 1.415, 1.415]],
            "atom_pos_red": [[0, 0, 0], [0.25, 0.25, 0.25]],
            "highsym_qpts": [[0, "Γ"], [25, "X"], [40, "W"], [55, "L"], [80, "Γ"]],
            "distances": list(np.linspace(0, 1, 25)),
            "eigenvalues": [
                list(np.linspace(0, 80, 25)),
                list(np.linspace(0, 80, 25)),
                list(np.linspace(0, 70, 25)),
                list(np.linspace(200, 270, 25)),
                list(np.linspace(200, 270, 25)),
                list(np.linspace(250, 290, 25)),
            ],
        },
    }

    example_key = payload.example or "Si"
    if example_key not in examples:
        example_key = "Si"
    return examples[example_key]


# -------------------------
# OPTIMADE / Materials Database Explorer
# -------------------------
OPTIMADE_PROVIDERS = [
    {"id": "mp", "name": "Materials Project", "base_url": "https://optimade.materialsproject.org/v1"},
    {"id": "aflow", "name": "AFLOW", "base_url": "https://aflow.org/API/optimade/v1"},
    {"id": "cod", "name": "Crystallography Open Database", "base_url": "https://www.crystallography.net/cod/optimade/v1"},
    {"id": "mc3d", "name": "Materials Cloud 3D", "base_url": "https://aiida.materialscloud.org/mc3d/optimade/v1"},
    {"id": "mc2d", "name": "Materials Cloud 2D", "base_url": "https://aiida.materialscloud.org/mc2d/optimade/v1"},
    {"id": "oqmd", "name": "OQMD", "base_url": "https://oqmd.org/optimade/v1"},
    {"id": "mpds", "name": "MPDS", "base_url": "https://api.mpds.io/v1"},
    {"id": "jarvis", "name": "JARVIS-DFT", "base_url": "https://jarvis.nist.gov/optimade/v1"},
]


@app.get("/api/optimade/providers")
async def optimade_providers():
    """List available OPTIMADE providers."""
    return OPTIMADE_PROVIDERS


class OptimadeQueryRequest(BaseModel):
    provider_id: str
    filter_query: str = ""
    page_limit: int = 25
    page_offset: int = 0


@app.post("/api/optimade/search")
async def optimade_search(payload: OptimadeQueryRequest):
    """
    Query an OPTIMADE provider for structures.
    filter_query uses OPTIMADE filter syntax, e.g.:
    - elements HAS "Si"
    - nelements = 2
    - chemical_formula_reduced = "NaCl"
    """
    import httpx

    provider = next((p for p in OPTIMADE_PROVIDERS if p["id"] == payload.provider_id), None)
    if not provider:
        return JSONResponse({"error": f"Unknown provider: {payload.provider_id}"}, status_code=400)

    base_url = provider["base_url"]
    params = {
        "page_limit": payload.page_limit,
        "page_offset": payload.page_offset,
    }
    if payload.filter_query.strip():
        params["filter"] = payload.filter_query.strip()

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(f"{base_url}/structures", params=params)
            resp.raise_for_status()
            data = resp.json()

        structures = []
        for item in data.get("data", []):
            attrs = item.get("attributes", {})
            structures.append({
                "id": item.get("id"),
                "type": item.get("type"),
                "chemical_formula_reduced": attrs.get("chemical_formula_reduced"),
                "chemical_formula_descriptive": attrs.get("chemical_formula_descriptive"),
                "nelements": attrs.get("nelements"),
                "elements": attrs.get("elements"),
                "nsites": attrs.get("nsites"),
                "dimension_types": attrs.get("dimension_types"),
                "lattice_vectors": attrs.get("lattice_vectors"),
                "species": attrs.get("species"),
                "species_at_sites": attrs.get("species_at_sites"),
                "cartesian_site_positions": attrs.get("cartesian_site_positions"),
            })

        meta = data.get("meta", {})
        return {
            "provider": provider["name"],
            "structures": structures,
            "data_returned": meta.get("data_returned", len(structures)),
            "data_available": meta.get("data_available"),
            "more_data_available": meta.get("more_data_available", False),
        }
    except httpx.HTTPStatusError as e:
        return JSONResponse({"error": f"HTTP error from provider: {e.response.status_code}"}, status_code=502)
    except httpx.RequestError as e:
        return JSONResponse({"error": f"Request failed: {str(e)}"}, status_code=502)
    except Exception as e:
        return JSONResponse({"error": f"Query failed: {str(e)}"}, status_code=500)


@app.get("/api/superconductors/tracker")
def get_superconductor_tracker():
    """Return the superconductor tracker data (materials with Tc, year, type, publication links)."""
    data_path = Path(__file__).parent / "data" / "superconductors.json"
    try:
        with open(data_path, encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {"last_updated": "", "materials": []}
    except json.JSONDecodeError:
        return {"last_updated": "", "materials": []}


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
