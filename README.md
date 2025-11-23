# 🛡️ IOC Threat Intelligence Lookup Tool

A powerful multi-source IOC (Indicator of Compromise) lookup tool for cybersecurity analysts. Quickly investigate suspicious indicators across multiple threat intelligence platforms.

## 🎯 Features

- **Multi-Source Intelligence**: Integrates with 7 threat intelligence platforms
  - VirusTotal - File/URL/IP/Domain reputation
  - AbuseIPDB - IP abuse reports and confidence scores
  - GreyNoise - IP classification (benign/malicious/unknown)
  - urlscan.io - URL scanning and screenshots
  - AlienVault OTX - Open threat exchange data
  - WHOIS - Domain/IP registration information
  - Screenshot - Visual capture of suspicious websites

- **Bulk Lookup**: Paste multiple IOCs at once (one per line or comma-separated)

- **Auto-Detection**: Automatically identifies IOC types:
  - IPv4 Addresses
  - Domain Names
  - URLs
  - File Hashes (MD5, SHA1, SHA256)
  - Email Addresses

- **Investigation History**: Track and review past lookups

- **Real-Time Analysis**: Get instant results from all sources simultaneously

- **Risk Assessment**: Visual threat level indicators (High/Medium/Low)

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
# API keys are already configured in .env
uvicorn server:app --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd frontend
yarn install
yarn start
```

## 💻 Usage

1. Navigate to the Lookup page
2. Paste your IOCs in the text area (one per line)
3. Click "Lookup IOCs"
4. View results from all sources
5. Check History page for past investigations

### Example IOCs
```
8.8.8.8
malware.com
https://suspicious-site.com/malware
44d88612fea8a8f36de82e1278abb02f
```

## 📊 Supported IOC Types

- IPv4 Addresses
- Domain Names
- URLs
- MD5 Hashes
- SHA1 Hashes
- SHA256 Hashes
- Email Addresses

---

**Built for cyber defenders** 🛡️
