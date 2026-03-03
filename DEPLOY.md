# Deploying SMAD to https://smad.live

This guide covers deploying the SMAD platform to production with HTTPS.

---

## Deploy in one command (after first-time Render setup)

From the project root (`C:\smadlive` or `./smad`):

**Windows (PowerShell):**
```powershell
.\deploy.ps1 "Your commit message"
```

**Mac/Linux:**
```bash
chmod +x deploy.sh
./deploy.sh "Your commit message"
```

This commits all changes, pushes to `origin main`, and Render auto-deploys. Then check https://smad.live.

---

## Quick options

| Platform | Best for | SSL | WebSocket | Effort |
|----------|----------|-----|-----------|--------|
| **Railway** | Easiest, Git push deploy | Auto | Yes | Low |
| **Render** | Free tier, simple | Auto | Yes | Low |
| **Fly.io** | Global edge, Docker | Auto | Yes | Medium |
| **VPS** (DigitalOcean, etc.) | Full control, SSH keys | Let's Encrypt | Yes | Medium |

---

## 1. Railway (recommended for quick deploy)

1. **Sign up** at [railway.app](https://railway.app) and create a new project.

2. **Deploy from GitHub** (or upload code):
   - Connect your repo or use `railway init`
   - Railway will detect the Dockerfile and build the image

3. **Add a volume** for database persistence:
   - In the service → Variables → add a volume mount at `/app/data`

4. **Set domain**:
   - Settings → Domains → Add custom domain `smad.live`
   - Add the CNAME record Railway gives you at your DNS provider

5. **Environment variables** (optional, for cluster console):
   ```
   SSH_KEY_PATH=/app/secrets/ssh_key
   SMAD_SSH_USER=masternode1
   ```
   - Add the SSH key as a secret file mounted at `/app/secrets/ssh_key`

---

## 2. Render

1. **Sign up** at [render.com](https://render.com).

2. **New Web Service** → Connect your repo.

3. **Build**:
   - Build Command: `docker build -t smad .` (or use native Python)
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add disk** (Render Dashboard → Disks) for `/app/data` if using SQLite.

5. **Custom domain**: Add `smad.live` in Render → Settings → Custom Domain.

---

## 3. Fly.io

```bash
# Install flyctl: https://fly.io/docs/hands-on/install-flyctl/

fly launch
# Answer prompts; choose a region

# Add volume for SQLite
fly volumes create smad_data --size 1

# Attach volume in fly.toml (add under [vm]):
#   mount_source = "smad_data"
#   mount_path = "/app/data"

fly deploy
fly certs add smad.live
```

---

## 4. VPS (Ubuntu + Docker + Nginx)

### On your server

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone and run
git clone <your-repo> /opt/smad
cd /opt/smad
docker compose up -d
```

### Nginx reverse proxy (with SSL via Certbot)

```nginx
# /etc/nginx/sites-available/smad.live
server {
    listen 80;
    server_name smad.live www.smad.live;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name smad.live www.smad.live;

    ssl_certificate /etc/letsencrypt/live/smad.live/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smad.live/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /ws/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
sudo certbot --nginx -d smad.live
sudo nginx -t && sudo systemctl reload nginx
```

---

## DNS setup for smad.live

At your domain registrar (e.g. Namecheap, Cloudflare, Google Domains):

| Type | Name | Value |
|------|------|-------|
| A | @ | `<your-server-IP>` |
| CNAME | www | `smad.live` or platform hostname |

For **Railway/Render/Fly.io**: use the CNAME they provide (e.g. `your-app.up.railway.app`).

---

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite path | `sqlite:///smad.db` |
| `SSH_KEY_PATH` | Path to SSH private key (cluster console) | `~/.ssh/crystal_ai` |
| `SMAD_SSH_USER` | SSH username for HPC login | `masternode1` |

---

## Post-deploy checklist

- [ ] Visit https://smad.live and confirm the site loads
- [ ] Check https://smad.live/about
- [ ] Test materials API: https://smad.live/api/materials
- [ ] If using cluster console: configure `SSH_KEY_PATH` and test a read-only command
