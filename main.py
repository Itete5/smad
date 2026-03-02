import asyncio
import paramiko
from fastapi import FastAPI, WebSocket, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
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

@app.get("/api/materials")
def list_materials():
    with SessionLocal() as db:
        mats = db.query(Material).all()
        return [{"id": m.id, "mp_id": m.mp_id, "formula": m.formula} for m in mats]

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
