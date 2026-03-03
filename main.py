import asyncio
import paramiko
from typing import Literal

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

@app.get("/api/materials")
def list_materials():
    with SessionLocal() as db:
        mats = db.query(Material).all()
        return [{"id": m.id, "mp_id": m.mp_id, "formula": m.formula, "space_group": m.space_group} for m in mats]

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
