#!/bin/bash

# Deploy to Fly.io - Quick Setup Script
# Run this from the /app/backend directory

echo "🚀 CTI IOC Lookup - Fly.io Deployment Script"
echo "============================================="
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ Fly CLI not found!"
    echo ""
    echo "Please install it first:"
    echo "  Linux/Mac: curl -L https://fly.io/install.sh | sh"
    echo "  Windows: pwsh -Command \"iwr https://fly.io/install.ps1 -useb | iex\""
    echo ""
    exit 1
fi

echo "✅ Fly CLI found: $(flyctl version)"
echo ""

# Check if logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "⚠️  Not logged in to Fly.io"
    echo "Running: flyctl auth login"
    flyctl auth login
    echo ""
fi

echo "✅ Logged in to Fly.io"
echo ""

# Check if fly.toml exists
if [ ! -f "fly.toml" ]; then
    echo "⚠️  fly.toml not found. Running flyctl launch..."
    flyctl launch --no-deploy
    echo ""
else
    echo "✅ fly.toml found"
    echo ""
fi

# Set secrets (API keys)
echo "📝 Setting API keys as secrets..."
echo ""
echo "⚠️  IMPORTANT: Make sure to update these with your actual API keys!"
echo ""

read -p "Do you want to set API keys now? (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Setting secrets..."
    flyctl secrets set \
      ABUSEIPDB_API_KEY="9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7" \
      VIRUSTOTAL_API_KEY="64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a" \
      URLSCAN_API_KEY="019aaf63-f958-70b8-a1a4-402eddc31f40" \
      OTX_API_KEY="a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa" \
      GREYNOISE_API_KEY="Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD" \
      CORS_ORIGINS="*"
    
    if [ $? -eq 0 ]; then
        echo "✅ API keys set successfully"
    else
        echo "❌ Failed to set API keys"
        exit 1
    fi
else
    echo "⚠️  Skipping API key setup. You can set them later with:"
    echo "   flyctl secrets set KEY_NAME=\"value\""
fi

echo ""
echo "🚀 Deploying to Fly.io..."
echo ""

flyctl deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Your backend is now live at:"
    flyctl info | grep Hostname
    echo ""
    echo "📊 Check status:"
    echo "   flyctl status"
    echo ""
    echo "📋 View logs:"
    echo "   flyctl logs"
    echo ""
    echo "🧪 Test your API:"
    APP_URL=$(flyctl info --json | grep -o '"Hostname":"[^"]*"' | cut -d'"' -f4)
    echo "   curl -X POST \"https://$APP_URL/api/ioc/lookup\" \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -d '{\"text\":\"8.8.8.8\"}'"
else
    echo ""
    echo "❌ Deployment failed!"
    echo ""
    echo "Check logs for errors:"
    echo "   flyctl logs"
    exit 1
fi
