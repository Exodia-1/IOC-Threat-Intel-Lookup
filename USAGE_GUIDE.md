# 🔍 IOC Threat Intelligence Lookup Tool - Usage Guide

## Quick Start for Cyber Analysts

### What This Tool Does
This tool helps you quickly investigate Indicators of Compromise (IOCs) by automatically checking them across 4 major threat intelligence platforms:
- **VirusTotal** - Comprehensive reputation data
- **AbuseIPDB** - IP abuse confidence scores
- **urlscan.io** - URL scanning and analysis
- **AlienVault OTX** - Community threat intelligence

### Step-by-Step Usage

#### 1. Basic Lookup (Single IOC)
```
1. Open the tool in your browser
2. Paste a single IOC in the text area (e.g., 8.8.8.8)
3. Click "Lookup IOCs"
4. View results from all sources
```

#### 2. Bulk Lookup (Multiple IOCs)
```
Paste multiple IOCs, one per line:

8.8.8.8
malware.com
https://suspicious-site.com/malware
44d88612fea8a8f36de82e1278abb02f
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

The tool automatically detects each IOC type and queries the appropriate sources.

#### 3. Understanding Results

**Threat Level Indicators:**
- 🔴 **High Risk** - Multiple sources flag as malicious (VT malicious > 5 OR abuse score > 75%)
- 🟡 **Medium Risk** - Some suspicious indicators (VT malicious > 0 OR abuse score > 25%)
- 🟢 **Low Risk** - Clean across all sources

**Per-Source Results:**

**VirusTotal:**
- Malicious: Number of security vendors flagging as malicious
- Suspicious: Number of vendors flagging as suspicious
- Harmless: Number of vendors marking as clean
- Reputation: Overall reputation score

**AbuseIPDB:**
- Abuse Confidence Score: 0-100% (higher = more likely malicious)
- Total Reports: Number of abuse reports
- Is Whitelisted: If the IP is on whitelist

**AlienVault OTX:**
- Pulse Count: Number of threat pulses mentioning this IOC
- Higher pulse count = more threat intel community interest

**urlscan.io:**
- Scan Status: Confirmation that scan was submitted
- Result URL: Link to detailed scan results

#### 4. Using History
```
1. Click "History" in the navigation
2. View all past lookups with timestamps
3. Click "View Details" on any entry to see full results
4. Use history to:
   - Track your investigation timeline
   - Re-check IOCs from past incidents
   - Build incident reports
```

### Investigation Workflow Examples

#### Example 1: Suspicious Email Investigation
```
Scenario: Received phishing email

IOCs to check:
1. sender-domain.com (domain from email)
2. 192.168.1.1 (IP from email headers)
3. https://phishing-link.com (link in email)
4. attachment-hash (if file attached)

Result interpretation:
- Domain shows high abuse score → Block at email gateway
- IP has multiple VT detections → Add to firewall blocklist
- URL flagged by urlscan → Report to security team
- Hash found in VT → Malware confirmed, run EDR scan
```

#### Example 2: Alert Triage
```
Scenario: SIEM alert for suspicious outbound connection

IOCs to check:
1. destination-ip (where system connected)
2. destination-domain (DNS lookup)

Result interpretation:
- IP has OTX pulses → Known C2 infrastructure
- Low/No detections → Possible false positive
- Multiple sources confirm threat → Isolate system immediately
```

#### Example 3: Incident Response
```
Scenario: Compromised system forensics

Bulk lookup all artifacts:
- All IPs from network logs
- All domains from DNS logs
- All file hashes from system
- All URLs from browser history

Review history to:
- Identify timeline of compromise
- Find additional indicators
- Build complete IOC list for blocking
```

### Tips for Daily Use

1. **Save Time with Bulk Lookups**
   - Paste entire lists of IOCs at once
   - Mix different types (IPs, domains, hashes)
   - Tool automatically sorts and processes

2. **Use History for Reports**
   - All lookups are automatically saved
   - Reference past investigations
   - Track IOC evolution over time

3. **Understand False Positives**
   - Check multiple sources, not just one
   - Consider context (e.g., Google IPs may have some reports)
   - Use abuse confidence score (AbuseIPDB) as primary indicator for IPs

4. **API Rate Limits**
   - Free tier limits:
     - VirusTotal: 500/day, 4/minute
     - AbuseIPDB: 1,000/day
     - urlscan.io: 5,000/month
     - OTX: Generous limits
   - Tool respects rate limits automatically

### Common IOC Types Supported

| Type | Example | Sources Used |
|------|---------|--------------|
| IPv4 | 8.8.8.8 | VT, AbuseIPDB, OTX |
| Domain | malware.com | VT, urlscan, OTX |
| URL | https://evil.com/malware | VT, urlscan, OTX |
| MD5 | 44d88612fea8a8f36de82e1278abb02f | VT, OTX |
| SHA1 | adc83b19e793491b1c6ea0fd8b46cd9f32e592fc | VT, OTX |
| SHA256 | e3b0c44298fc1c149afbf4c8996fb92427ae41e4... | VT, OTX |

### Keyboard Shortcuts
- Paste IOCs: `Ctrl+V` / `Cmd+V`
- Submit lookup: `Enter` (when in input field)
- Navigate: Use browser back/forward

### Troubleshooting

**No results appearing:**
- Check internet connection
- Verify API keys in backend/.env
- Check browser console for errors (F12)

**API key errors:**
- Verify keys are correct in .env file
- Restart backend: `sudo supervisorctl restart backend`
- Check if API quota exceeded on provider websites

**Slow lookups:**
- Normal for bulk lookups (multiple API calls)
- Each source may take 1-3 seconds
- Total time depends on number of IOCs

### Best Practices

✅ **DO:**
- Use bulk lookup for efficiency
- Check multiple sources before making decisions
- Keep history for documentation
- Consider context when interpreting results

❌ **DON'T:**
- Don't rely on single source
- Don't ignore low abuse scores (< 25%)
- Don't lookup sensitive internal IOCs on public services
- Don't exceed API rate limits intentionally

### Security Reminder
- All lookups are sent to external APIs
- Don't lookup classified or sensitive internal IOCs
- Consider privacy implications
- Use VPN if required by your organization

---

**Need Help?** Check the README.md or contact your security team lead.

**Built for SOC analysts, by SOC analysts** 🛡️
