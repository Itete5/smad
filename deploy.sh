#!/usr/bin/env bash
# Deploy SMAD to Render via GitHub
# Usage: ./deploy.sh ["Commit message"]
# Then Render auto-deploys when push to main succeeds.

set -e
cd "$(dirname "$0")"

MESSAGE="${1:-Deploy SMAD}"

echo "Deploying SMAD to GitHub (Render will auto-deploy)..."

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to commit. Working tree clean."
  read -r -p "Push anyway? (y/n) " push
  [ "$push" != "y" ] && exit 0
else
  git add -A
  git status
  git commit -m "$MESSAGE"
fi

git push origin main

echo ""
echo "Done. Pushed to origin main."
echo "Render will deploy from GitHub. Check https://dashboard.render.com"
echo "Live site: https://smad.live"
