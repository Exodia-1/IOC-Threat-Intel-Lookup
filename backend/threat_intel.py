import os
import requests
import time
from typing import Dict, Optional
import logging
import whois

logger = logging.getLogger(__name__)

class ThreatIntelService:
    """Base class for threat intelligence services"""
    
    def __init__(self):
        self.timeout = 10
    
    def handle_request_error(self, service_name: str, e: Exception) -> Dict:
        """Handle request errors gracefully"""
        logger.error(f"{service_name} error: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'data': None
        }

class VirusTotalService(ThreatIntelService):
    """VirusTotal API integration"""
    
    def __init__(self):
        super().__init__()
        self.api_key = os.environ.get('VIRUSTOTAL_API_KEY')
        self.base_url = 'https://www.virustotal.com/api/v3'
    
    def lookup_ip(self, ip: str) -> Dict:
        """Lookup IP address"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'x-apikey': self.api_key}
            response = requests.get(
                f'{self.base_url}/ip_addresses/{ip}',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                attributes = data.get('data', {}).get('attributes', {})
                stats = attributes.get('last_analysis_stats', {})
                
                malicious = stats.get('malicious', 0)
                suspicious = stats.get('suspicious', 0)
                harmless = stats.get('harmless', 0)
                undetected = stats.get('undetected', 0)
                total_scans = malicious + suspicious + harmless + undetected
                
                return {
                    'success': True,
                    'data': {
                        'malicious': malicious,
                        'suspicious': suspicious,
                        'harmless': harmless,
                        'undetected': undetected,
                        'total_scans': total_scans,
                        'detection_ratio': f"{malicious + suspicious}/{total_scans}",
                        'reputation': attributes.get('reputation', 0),
                        'country': attributes.get('country', 'Unknown'),
                        'as_owner': attributes.get('as_owner', 'Unknown')
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('VirusTotal', e)
    
    def lookup_domain(self, domain: str) -> Dict:
        """Lookup domain"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'x-apikey': self.api_key}
            response = requests.get(
                f'{self.base_url}/domains/{domain}',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                attributes = data.get('data', {}).get('attributes', {})
                stats = attributes.get('last_analysis_stats', {})
                
                malicious = stats.get('malicious', 0)
                suspicious = stats.get('suspicious', 0)
                harmless = stats.get('harmless', 0)
                undetected = stats.get('undetected', 0)
                total_scans = malicious + suspicious + harmless + undetected
                
                return {
                    'success': True,
                    'data': {
                        'malicious': malicious,
                        'suspicious': suspicious,
                        'harmless': harmless,
                        'undetected': undetected,
                        'total_scans': total_scans,
                        'detection_ratio': f"{malicious + suspicious}/{total_scans}",
                        'reputation': attributes.get('reputation', 0),
                        'categories': attributes.get('categories', {})
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('VirusTotal', e)
    
    def lookup_url(self, url: str) -> Dict:
        """Lookup URL"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            import base64
            url_id = base64.urlsafe_b64encode(url.encode()).decode().strip('=')
            headers = {'x-apikey': self.api_key}
            
            response = requests.get(
                f'{self.base_url}/urls/{url_id}',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                attributes = data.get('data', {}).get('attributes', {})
                stats = attributes.get('last_analysis_stats', {})
                
                malicious = stats.get('malicious', 0)
                suspicious = stats.get('suspicious', 0)
                harmless = stats.get('harmless', 0)
                undetected = stats.get('undetected', 0)
                total_scans = malicious + suspicious + harmless + undetected
                
                return {
                    'success': True,
                    'data': {
                        'malicious': malicious,
                        'suspicious': suspicious,
                        'harmless': harmless,
                        'undetected': undetected,
                        'total_scans': total_scans,
                        'detection_ratio': f"{malicious + suspicious}/{total_scans}"
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('VirusTotal', e)
    
    def lookup_hash(self, file_hash: str) -> Dict:
        """Lookup file hash with detailed information"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'x-apikey': self.api_key}
            response = requests.get(
                f'{self.base_url}/files/{file_hash}',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                attributes = data.get('data', {}).get('attributes', {})
                stats = attributes.get('last_analysis_stats', {})
                
                # Extract file names
                names = attributes.get('names', [])
                meaningful_name = attributes.get('meaningful_name', '')
                
                malicious = stats.get('malicious', 0)
                suspicious = stats.get('suspicious', 0)
                harmless = stats.get('harmless', 0)
                undetected = stats.get('undetected', 0)
                total_scans = malicious + suspicious + harmless + undetected
                
                return {
                    'success': True,
                    'data': {
                        'malicious': malicious,
                        'suspicious': suspicious,
                        'harmless': harmless,
                        'undetected': undetected,
                        'total_scans': total_scans,
                        'detection_ratio': f"{malicious + suspicious}/{total_scans}",
                        'file_type': attributes.get('type_description', 'Unknown'),
                        'file_extension': attributes.get('type_extension', 'Unknown'),
                        'file_name': meaningful_name or (names[0] if names else 'Unknown'),
                        'file_names': names[:5] if names else [],  # Top 5 names
                        'size': attributes.get('size', 0),
                        'size_readable': self._format_file_size(attributes.get('size', 0)),
                        'md5': attributes.get('md5', 'N/A'),
                        'sha1': attributes.get('sha1', 'N/A'),
                        'sha256': attributes.get('sha256', 'N/A'),
                        'first_submission': attributes.get('first_submission_date', 0),
                        'last_analysis': attributes.get('last_analysis_date', 0),
                        'times_submitted': attributes.get('times_submitted', 0),
                        'reputation': attributes.get('reputation', 0),
                        'tags': attributes.get('tags', [])[:5]  # Top 5 tags
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('VirusTotal', e)
    
    def _format_file_size(self, size_bytes: int) -> str:
        """Format file size in human readable format"""
        if size_bytes < 1024:
            return f"{size_bytes} B"
        elif size_bytes < 1024 * 1024:
            return f"{size_bytes / 1024:.2f} KB"
        elif size_bytes < 1024 * 1024 * 1024:
            return f"{size_bytes / (1024 * 1024):.2f} MB"
        else:
            return f"{size_bytes / (1024 * 1024 * 1024):.2f} GB"


class AbuseIPDBService(ThreatIntelService):
    """AbuseIPDB API integration"""
    
    def __init__(self):
        super().__init__()
        self.api_key = os.environ.get('ABUSEIPDB_API_KEY')
        self.base_url = 'https://api.abuseipdb.com/api/v2'
    
    def lookup_ip(self, ip: str) -> Dict:
        """Lookup IP address"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {
                'Key': self.api_key,
                'Accept': 'application/json'
            }
            params = {
                'ipAddress': ip,
                'maxAgeInDays': 90,
                'verbose': True
            }
            
            response = requests.get(
                f'{self.base_url}/check',
                headers=headers,
                params=params,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json().get('data', {})
                
                return {
                    'success': True,
                    'data': {
                        'abuse_confidence_score': data.get('abuseConfidenceScore', 0),
                        'country_code': data.get('countryCode', 'Unknown'),
                        'usage_type': data.get('usageType', 'Unknown'),
                        'isp': data.get('isp', 'Unknown'),
                        'domain': data.get('domain', 'Unknown'),
                        'is_whitelisted': data.get('isWhitelisted', False),
                        'total_reports': data.get('totalReports', 0),
                        'num_distinct_users': data.get('numDistinctUsers', 0)
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('AbuseIPDB', e)


class URLScanService(ThreatIntelService):
    """urlscan.io API integration"""
    
    def __init__(self):
        super().__init__()
        self.api_key = os.environ.get('URLSCAN_API_KEY')
        self.base_url = 'https://urlscan.io/api/v1'
    
    def lookup_url(self, url: str) -> Dict:
        """Lookup URL"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            # First, submit the URL for scanning
            headers = {
                'API-Key': self.api_key,
                'Content-Type': 'application/json'
            }
            payload = {
                'url': url,
                'visibility': 'private'
            }
            
            response = requests.post(
                f'{self.base_url}/scan/',
                headers=headers,
                json=payload,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'success': True,
                    'data': {
                        'result_url': data.get('result'),
                        'scan_id': data.get('uuid'),
                        'message': 'Scan submitted successfully. Results will be available shortly.',
                        'visibility': data.get('visibility')
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('URLScan', e)
    
    def lookup_domain(self, domain: str) -> Dict:
        """Search for domain in urlscan.io"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'API-Key': self.api_key}
            params = {'q': f'domain:{domain}'}
            
            response = requests.get(
                f'{self.base_url}/search/',
                headers=headers,
                params=params,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                # Extract detailed info from recent scans
                recent_scan_details = []
                for result in results[:5]:  # Get top 5 recent scans
                    scan_info = {
                        'url': result.get('page', {}).get('url', 'N/A'),
                        'country': result.get('page', {}).get('country', 'Unknown'),
                        'server': result.get('page', {}).get('server', 'Unknown'),
                        'ip': result.get('page', {}).get('ip', 'Unknown'),
                        'asn': result.get('page', {}).get('asn', 'Unknown'),
                        'malicious': result.get('verdicts', {}).get('overall', {}).get('malicious', False),
                        'score': result.get('verdicts', {}).get('overall', {}).get('score', 0),
                        'categories': result.get('verdicts', {}).get('overall', {}).get('categories', []),
                        'scan_time': result.get('task', {}).get('time', 'Unknown')
                    }
                    recent_scan_details.append(scan_info)
                
                return {
                    'success': True,
                    'data': {
                        'total_results': data.get('total', 0),
                        'has_results': len(results) > 0,
                        'recent_scans': len(results),
                        'scan_details': recent_scan_details
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('URLScan', e)


class OTXService(ThreatIntelService):
    """AlienVault OTX API integration"""
    
    def __init__(self):
        super().__init__()
        self.api_key = os.environ.get('OTX_API_KEY')
        self.base_url = 'https://otx.alienvault.com/api/v1'
    
    def lookup_ip(self, ip: str) -> Dict:
        """Lookup IP address"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'X-OTX-API-KEY': self.api_key}
            
            response = requests.get(
                f'{self.base_url}/indicators/IPv4/{ip}/general',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                pulse_info = data.get('pulse_info', {})
                
                # Get pulse details
                pulses = pulse_info.get('pulses', [])
                pulse_details = []
                for pulse in pulses[:5]:  # Top 5 pulses
                    pulse_details.append({
                        'name': pulse.get('name', 'Unknown'),
                        'created': pulse.get('created', 'Unknown'),
                        'tags': pulse.get('tags', [])[:3]
                    })
                
                return {
                    'success': True,
                    'data': {
                        'pulse_count': pulse_info.get('count', 0),
                        'pulses': pulse_details,
                        'country': data.get('country_name', 'Unknown'),
                        'country_code': data.get('country_code', 'Unknown'),
                        'city': data.get('city', 'Unknown'),
                        'region': data.get('region', 'Unknown'),
                        'asn': data.get('asn', 'Unknown'),
                        'organization': data.get('organization', 'Unknown'),
                        'reputation': data.get('reputation', 0),
                        'continent': data.get('continent_code', 'Unknown'),
                        'latitude': data.get('latitude', 0),
                        'longitude': data.get('longitude', 0)
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('OTX', e)
    
    def lookup_domain(self, domain: str) -> Dict:
        """Lookup domain"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'X-OTX-API-KEY': self.api_key}
            
            response = requests.get(
                f'{self.base_url}/indicators/domain/{domain}/general',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                pulse_info = data.get('pulse_info', {})
                
                # Get pulse details
                pulses = pulse_info.get('pulses', [])
                pulse_details = []
                for pulse in pulses[:5]:  # Top 5 pulses
                    pulse_details.append({
                        'name': pulse.get('name', 'Unknown'),
                        'created': pulse.get('created', 'Unknown'),
                        'tags': pulse.get('tags', [])[:3]  # Top 3 tags
                    })
                
                return {
                    'success': True,
                    'data': {
                        'pulse_count': pulse_info.get('count', 0),
                        'pulses': pulse_details,
                        'alexa_rank': data.get('alexa', 'Unknown'),
                        'whois': data.get('whois', 'N/A'),
                        'sections': list(data.get('sections', [])),
                        'base_indicator': data.get('base_indicator', {})
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('OTX', e)
    
    def lookup_url(self, url: str) -> Dict:
        """Lookup URL"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'X-OTX-API-KEY': self.api_key}
            
            response = requests.get(
                f'{self.base_url}/indicators/url/{url}/general',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                
                return {
                    'success': True,
                    'data': {
                        'pulse_count': data.get('pulse_info', {}).get('count', 0)
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('OTX', e)
    
    def lookup_hash(self, file_hash: str) -> Dict:
        """Lookup file hash"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {'X-OTX-API-KEY': self.api_key}
            
            response = requests.get(
                f'{self.base_url}/indicators/file/{file_hash}/general',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                
                return {
                    'success': True,
                    'data': {
                        'pulse_count': data.get('pulse_info', {}).get('count', 0)
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('OTX', e)


class GreyNoiseService(ThreatIntelService):
    """GreyNoise API integration"""
    
    def __init__(self):
        super().__init__()
        self.api_key = os.environ.get('GREYNOISE_API_KEY')
        self.base_url = 'https://api.greynoise.io/v3'
    
    def lookup_ip(self, ip: str) -> Dict:
        """Lookup IP address"""
        if not self.api_key:
            return {'success': False, 'error': 'API key not configured', 'data': None}
        
        try:
            headers = {
                'key': self.api_key,
                'Accept': 'application/json'
            }
            
            response = requests.get(
                f'{self.base_url}/community/{ip}',
                headers=headers,
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                
                return {
                    'success': True,
                    'data': {
                        'classification': data.get('classification', 'unknown'),
                        'noise': data.get('noise', False),
                        'riot': data.get('riot', False),
                        'name': data.get('name', 'Unknown'),
                        'last_seen': data.get('last_seen', 'Unknown')
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('GreyNoise', e)


class WHOISService(ThreatIntelService):
    """WHOIS lookup service (no API key required)"""
    
    def lookup_domain(self, domain: str) -> Dict:
        """Lookup domain WHOIS information"""
        try:
            w = whois.whois(domain)
            
            # Handle both list and single value returns
            def get_first(value):
                if isinstance(value, list):
                    return value[0] if value else None
                return value
            
            creation_date = get_first(w.creation_date)
            expiration_date = get_first(w.expiration_date)
            
            return {
                'success': True,
                'data': {
                    'domain_name': get_first(w.domain_name),
                    'registrar': w.registrar,
                    'creation_date': str(creation_date) if creation_date else 'Unknown',
                    'expiration_date': str(expiration_date) if expiration_date else 'Unknown',
                    'status': str(w.status) if w.status else 'Unknown',
                    'name_servers': ', '.join(w.name_servers) if w.name_servers else 'Unknown'
                }
            }
        
        except Exception as e:
            return self.handle_request_error('WHOIS', e)
    
    def lookup_ip(self, ip: str) -> Dict:
        """Lookup IP WHOIS information"""
        try:
            w = whois.whois(ip)
            
            return {
                'success': True,
                'data': {
                    'org': getattr(w, 'org', 'Unknown'),
                    'address': getattr(w, 'address', 'Unknown'),
                    'city': getattr(w, 'city', 'Unknown'),
                    'country': getattr(w, 'country', 'Unknown')
                }
            }
        
        except Exception as e:
            return self.handle_request_error('WHOIS', e)


class MXToolboxService(ThreatIntelService):
    """MXToolbox API integration for DNS and blacklist checks"""
    
    def __init__(self):
        super().__init__()
        # MXToolbox has a free API with rate limits
        self.base_url = 'https://mxtoolbox.com/api/v1'
    
    def lookup_domain(self, domain: str) -> Dict:
        """Check domain DNS and blacklist status"""
        try:
            # MXToolbox free lookup (using their public DNS check)
            results = {
                'mx_records': self._get_mx_records(domain),
                'blacklist_status': self._check_blacklist_simple(domain),
                'dns_health': 'Use MXToolbox website for detailed analysis'
            }
            
            return {
                'success': True,
                'data': results
            }
        
        except Exception as e:
            return self.handle_request_error('MXToolbox', e)
    
    def lookup_ip(self, ip: str) -> Dict:
        """Check IP blacklist status"""
        try:
            blacklist_status = self._check_blacklist_simple(ip)
            
            return {
                'success': True,
                'data': {
                    'blacklist_status': blacklist_status,
                    'note': 'Use MXToolbox website for detailed blacklist analysis'
                }
            }
        
        except Exception as e:
            return self.handle_request_error('MXToolbox', e)
    
    def _get_mx_records(self, domain: str) -> str:
        """Get MX records for domain"""
        try:
            import dns.resolver
            mx_records = dns.resolver.resolve(domain, 'MX')
            return ', '.join([str(r.exchange) for r in mx_records])
        except Exception as e:
            return f'No MX records found: {str(e)[:50]}'
    
    def _check_blacklist_simple(self, host: str) -> str:
        """Simple blacklist check indicator"""
        # Note: Full blacklist checking requires MXToolbox API key
        # This provides a basic indicator
        try:
            # Check a few common blacklists via DNS
            import socket
            reversed_ip = '.'.join(reversed(host.split('.'))) if '.' in host and host.replace('.', '').isdigit() else None
            
            if reversed_ip:
                blacklists = ['zen.spamhaus.org', 'bl.spamcop.net', 'dnsbl.sorbs.net']
                listed_on = []
                
                for bl in blacklists:
                    try:
                        query = f"{reversed_ip}.{bl}"
                        socket.gethostbyname(query)
                        listed_on.append(bl)
                    except socket.gaierror:
                        # Not listed
                        pass
                
                if listed_on:
                    return f'Listed on: {", ".join(listed_on)}'
                else:
                    return 'Not listed on checked blacklists'
            else:
                return 'Check manually on MXToolbox website'
        
        except Exception as e:
            return f'Check manually: {str(e)[:30]}'


class URLAnalysisService(ThreatIntelService):
    """URL analysis for redirects and embedded URLs"""
    
    def analyze_url(self, url: str) -> Dict:
        """Analyze URL for redirects and extract embedded URLs"""
        try:
            import re
            from urllib.parse import urlparse, urljoin
            
            # Follow redirects
            response = requests.get(
                url,
                allow_redirects=True,
                timeout=10,
                headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            )
            
            # Check if there were redirects
            redirect_chain = []
            if response.history:
                for resp in response.history:
                    redirect_chain.append({
                        'url': resp.url,
                        'status_code': resp.status_code
                    })
            
            # Extract URLs from page content
            url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+[^\s<>"{}|\\^`\[\].,;!?]'
            extracted_urls = list(set(re.findall(url_pattern, response.text)))
            
            # Filter out common CDN/resources
            filtered_urls = [
                u for u in extracted_urls 
                if not any(x in u.lower() for x in [
                    'google-analytics', 'googleapis', 'facebook.com/tr', 
                    'doubleclick', 'jquery', 'bootstrap', 'cloudflare',
                    '.css', '.js', '.png', '.jpg', '.gif', '.woff'
                ])
            ][:20]  # Limit to top 20 URLs
            
            return {
                'success': True,
                'data': {
                    'final_url': response.url,
                    'has_redirects': len(redirect_chain) > 0,
                    'redirect_count': len(redirect_chain),
                    'redirect_chain': redirect_chain,
                    'extracted_urls_count': len(filtered_urls),
                    'extracted_urls': filtered_urls,
                    'status_code': response.status_code
                }
            }
        
        except Exception as e:
            return self.handle_request_error('URLAnalysis', e)


class IPVoidService(ThreatIntelService):
    """IPVoid API integration for IP and domain reputation"""
    
    def __init__(self):
        super().__init__()
        self.base_url = 'https://endpoint.apivoid.com'
        # IPVoid has a free tier with limited requests
        # For better integration, users can add their API key
        self.api_key = os.environ.get('IPVOID_API_KEY', '')
    
    def lookup_ip(self, ip: str) -> Dict:
        """Check IP reputation using IPVoid"""
        if not self.api_key:
            # Provide a direct link to check manually
            return {
                'success': True,
                'data': {
                    'check_url': f'https://www.ipvoid.com/ip-blacklist-check/',
                    'message': 'IPVoid API key not configured. Visit the link to check manually.',
                    'detections': 0,
                    'blacklists': 0,
                    'risk_score': 0
                }
            }
        
        try:
            response = requests.get(
                f'{self.base_url}/iprep/v1/pay-as-you-go/',
                params={'key': self.api_key, 'ip': ip},
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                report = data.get('data', {}).get('report', {})
                blacklists = report.get('blacklists', {})
                
                detections = blacklists.get('detections', 0)
                engines = blacklists.get('engines', 0)
                
                return {
                    'success': True,
                    'data': {
                        'detections': detections,
                        'total_engines': engines,
                        'detection_ratio': f"{detections}/{engines}" if engines > 0 else "0/0",
                        'risk_score': report.get('risk_score', {}).get('result', 0),
                        'is_proxy': report.get('anonymity', {}).get('is_proxy', False),
                        'is_vpn': report.get('anonymity', {}).get('is_vpn', False),
                        'is_tor': report.get('anonymity', {}).get('is_tor', False),
                        'country': report.get('information', {}).get('country_name', 'Unknown'),
                        'isp': report.get('information', {}).get('isp', 'Unknown')
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('IPVoid', e)
    
    def lookup_domain(self, domain: str) -> Dict:
        """Check domain reputation using IPVoid"""
        if not self.api_key:
            return {
                'success': True,
                'data': {
                    'check_url': f'https://www.ipvoid.com/domain-reputation-check/',
                    'message': 'IPVoid API key not configured. Visit the link to check manually.',
                    'detections': 0,
                    'blacklists': 0
                }
            }
        
        try:
            response = requests.get(
                f'{self.base_url}/domainbl/v1/pay-as-you-go/',
                params={'key': self.api_key, 'host': domain},
                timeout=self.timeout
            )
            
            if response.status_code == 200:
                data = response.json()
                report = data.get('data', {}).get('report', {})
                blacklists = report.get('blacklists', {})
                
                detections = blacklists.get('detections', 0)
                engines = blacklists.get('engines', 0)
                
                return {
                    'success': True,
                    'data': {
                        'detections': detections,
                        'total_engines': engines,
                        'detection_ratio': f"{detections}/{engines}" if engines > 0 else "0/0",
                        'risk_score': report.get('risk_score', {}).get('result', 0),
                        'domain_age': report.get('server', {}).get('domain_age_days', 0),
                        'server_ip': report.get('server', {}).get('ip', 'Unknown')
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('IPVoid', e)


class ThreatIntelAggregator:
    """Aggregate results from multiple threat intelligence sources"""
    
    def __init__(self):
        self.vt = VirusTotalService()
        self.abuseipdb = AbuseIPDBService()
        self.urlscan = URLScanService()
        self.otx = OTXService()
        self.greynoise = GreyNoiseService()
        self.whois_service = WHOISService()
        self.url_analyzer = URLAnalysisService()
        self.mxtoolbox = MXToolboxService()
        self.ipvoid = IPVoidService()
    
    async def lookup(self, ioc_value: str, ioc_type: str) -> Dict:
        """Lookup IOC across all applicable sources"""
        results = {
            'ioc': ioc_value,
            'type': ioc_type,
            'sources': {}
        }
        
        if ioc_type == 'ipv4':
            results['sources']['virustotal'] = self.vt.lookup_ip(ioc_value)
            results['sources']['abuseipdb'] = self.abuseipdb.lookup_ip(ioc_value)
            results['sources']['greynoise'] = self.greynoise.lookup_ip(ioc_value)
            results['sources']['otx'] = self.otx.lookup_ip(ioc_value)
            results['sources']['whois'] = self.whois_service.lookup_ip(ioc_value)
            results['sources']['mxtoolbox'] = self.mxtoolbox.lookup_ip(ioc_value)
            results['sources']['ipvoid'] = self.ipvoid.lookup_ip(ioc_value)
        
        elif ioc_type == 'domain':
            results['sources']['virustotal'] = self.vt.lookup_domain(ioc_value)
            results['sources']['urlscan'] = self.urlscan.lookup_domain(ioc_value)
            results['sources']['otx'] = self.otx.lookup_domain(ioc_value)
            results['sources']['whois'] = self.whois_service.lookup_domain(ioc_value)
            results['sources']['mxtoolbox'] = self.mxtoolbox.lookup_domain(ioc_value)
            results['sources']['ipvoid'] = self.ipvoid.lookup_domain(ioc_value)
        
        elif ioc_type == 'url':
            results['sources']['virustotal'] = self.vt.lookup_url(ioc_value)
            results['sources']['urlscan'] = self.urlscan.lookup_url(ioc_value)
            results['sources']['otx'] = self.otx.lookup_url(ioc_value)
            results['sources']['url_analysis'] = self.url_analyzer.analyze_url(ioc_value)
        
        elif ioc_type in ['md5', 'sha1', 'sha256']:
            results['sources']['virustotal'] = self.vt.lookup_hash(ioc_value)
            results['sources']['otx'] = self.otx.lookup_hash(ioc_value)
        
        else:
            results['sources']['error'] = {
                'success': False,
                'error': f'Unsupported IOC type: {ioc_type}',
                'data': None
            }
        
        return results
