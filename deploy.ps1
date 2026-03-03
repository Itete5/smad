# Deploy SMAD to Render via GitHub
# Usage: .\deploy.ps1 ["Commit message"]
# Then Render auto-deploys when push to main succeeds.

param(
    [Parameter(Position = 0)]
    [string]$Message = "Deploy SMAD"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Deploying SMAD to GitHub (Render will auto-deploy)..." -ForegroundColor Cyan

# Check for uncommitted changes
$status = git status --porcelain
if (-not $status) {
    Write-Host "Nothing to commit. Working tree clean." -ForegroundColor Yellow
    $push = Read-Host "Push anyway? (y/n)"
    if ($push -ne "y") { exit 0 }
} else {
    git add -A
    git status
    git commit -m $Message
}

git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed. Fix errors and run again." -ForegroundColor Red
    exit 1
}

Write-Host "`nDone. Pushed to origin main." -ForegroundColor Green
Write-Host "Render will deploy from GitHub. Check https://dashboard.render.com" -ForegroundColor Cyan
Write-Host "Live site: https://smad.live" -ForegroundColor Cyan
