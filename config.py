import os

# Override via env in production (e.g. SSH_KEY_PATH, SMAD_SSH_USER)
SSH_KEY_PATH = os.getenv("SSH_KEY_PATH", os.path.expanduser("~/.ssh/crystal_ai"))
DEFAULT_USER = os.getenv("SMAD_SSH_USER", "masternode1")
