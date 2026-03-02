import secrets
from datetime import datetime

# Dummy implementations
def generate_daily_ws_path():
    return f"/ws/{datetime.today().strftime('%Y%m%d')}"

def generate_token():
    return secrets.token_hex(16)

def verify_token(token: str) -> bool:
    # For testing, accept all tokens
    return True if token else False
