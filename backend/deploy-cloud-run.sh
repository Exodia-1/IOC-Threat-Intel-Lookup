#!/bin/bash

# Google Cloud Run Deployment Script
# Run from /app/backend directory

echo "🚀 Deploying CTI IOC Lookup API to Google Cloud Run"
echo "====================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found!${NC}"
    echo ""
    echo "Please install it first:"
    echo "  Linux/macOS: curl https://sdk.cloud.google.com | bash"
    echo "  Windows: https://cloud.google.com/sdk/docs/install"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ gcloud CLI found${NC}"
echo ""

# Check if logged in
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Google Cloud${NC}"
    echo "Running: gcloud auth login"
    gcloud auth login
fi

echo -e "${GREEN}✅ Logged in to Google Cloud${NC}"
echo ""

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${YELLOW}⚠️  No project set${NC}"
    echo ""
    read -p "Enter your project ID (or press Enter to create new): " INPUT_PROJECT_ID
    
    if [ -z "$INPUT_PROJECT_ID" ]; then
        echo "Creating new project..."
        gcloud projects create cti-ioc-lookup-$(date +%s) --name="CTI IOC Lookup"
        PROJECT_ID=$(gcloud config get-value project)
    else
        gcloud config set project $INPUT_PROJECT_ID
        PROJECT_ID=$INPUT_PROJECT_ID
    fi
fi

echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"
echo ""

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com --quiet
gcloud services enable containerregistry.googleapis.com --quiet
echo -e "${GREEN}✅ APIs enabled${NC}"
echo ""

# Region
REGION="us-central1"
SERVICE_NAME="cti-ioc-lookup-api"

echo "Deploying to region: $REGION"
echo "Service name: $SERVICE_NAME"
echo ""

# Confirm deployment
read -p "Deploy now? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 0
fi

echo ""
echo "🚀 Starting deployment..."
echo ""

# Deploy
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --set-env-vars "ABUSEIPDB_API_KEY=9148d3835cb202106faff2e96ba675157fdd9ffd699662c7ddd8b0a194875a0c8f9bfdfe2b718ba7,VIRUSTOTAL_API_KEY=64c29a69f93c5a804da1d3e029919bd86ef7219df80572e09f97f1d3cf72bc4a,URLSCAN_API_KEY=019aaf63-f958-70b8-a1a4-402eddc31f40,OTX_API_KEY=a6bcac71baee8bd978f78e714173af8fecb093c6f4f987a051de0bfab2678caa,GREYNOISE_API_KEY=Jng2JXWhsaY1iCfsD3j6AbAiCdyVzUqr9saRE9kwQspwy24hOxQ81WxwzV6iS6qD"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo ""
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")
    
    echo "🌐 Your API is now live at:"
    echo "   $SERVICE_URL"
    echo ""
    
    echo "📋 Test your API:"
    echo "   curl $SERVICE_URL/"
    echo ""
    echo "   curl -X POST \"$SERVICE_URL/api/ioc/lookup\" \\"
    echo "     -H \"Content-Type: application/json\" \\"
    echo "     -d '{\"text\":\"8.8.8.8\"}'"
    echo ""
    
    echo "📊 View logs:"
    echo "   gcloud run services logs read $SERVICE_NAME --region $REGION"
    echo ""
    
    echo "🔗 Next steps:"
    echo "   1. Test the API endpoints above"
    echo "   2. Update your frontend with this URL:"
    echo "      REACT_APP_BACKEND_URL=$SERVICE_URL"
    echo "   3. Deploy frontend to Vercel"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo ""
    echo "Check logs:"
    echo "   gcloud run services logs read $SERVICE_NAME --region $REGION"
    echo ""
    exit 1
fi
