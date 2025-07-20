#!/bin/bash
echo "🚀 Deploying Muzaia Frontend to Vercel..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Remove API directory temporarily for frontend-only deploy
echo "📁 Preparing frontend-only deployment..."
mv api api-backup 2>/dev/null || true
mv vercel.json vercel-backend.json.backup 2>/dev/null || true
cp vercel-frontend.json vercel.json

# Login and deploy
echo "🔐 Initiating Vercel login..."
vercel login

echo "🌐 Deploying frontend to Vercel..."
vercel --prod --yes

# Restore API structure
echo "🔄 Restoring original structure..."
mv api-backup api 2>/dev/null || true
mv vercel-backend.json.backup vercel.json 2>/dev/null || true
rm -f vercel-frontend.json

echo "✅ Frontend deployment completed!"
echo "🌍 Check your Vercel dashboard for the live URL"