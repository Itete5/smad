import os

# Override via env in production (e.g. SSH_KEY_PATH, SMAD_SSH_USER)
SSH_KEY_PATH = os.getenv("SSH_KEY_PATH", os.path.expanduser("~/.ssh/crystal_ai"))
DEFAULT_USER = os.getenv("SMAD_SSH_USER", "masternode1")

# Community Ideas admin OTP — recipient never exposed in the public UI
COMMUNITY_ADMIN_OTP_EMAIL = os.getenv("COMMUNITY_ADMIN_OTP_EMAIL", "jiteter1@jh.edu")
# Set one of: Resend (HTTPS) or SMTP
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM = os.getenv("RESEND_FROM", "SMAD <onboarding@resend.dev>")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", "")
