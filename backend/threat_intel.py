import os
import requests
import time
from typing import Dict, Optional
import logging
import whois
from playwright.async_api import async_playwright
import asyncio
import base64

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
                
                return {
                    'success': True,
                    'data': {
                        'malicious': stats.get('malicious', 0),
                        'suspicious': stats.get('suspicious', 0),
                        'harmless': stats.get('harmless', 0),
                        'undetected': stats.get('undetected', 0),
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
                
                return {
                    'success': True,
                    'data': {
                        'malicious': stats.get('malicious', 0),
                        'suspicious': stats.get('suspicious', 0),
                        'harmless': stats.get('harmless', 0),
                        'undetected': stats.get('undetected', 0),
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
                
                return {
                    'success': True,
                    'data': {
                        'malicious': stats.get('malicious', 0),
                        'suspicious': stats.get('suspicious', 0),
                        'harmless': stats.get('harmless', 0),
                        'undetected': stats.get('undetected', 0)
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('VirusTotal', e)
    
    def lookup_hash(self, file_hash: str) -> Dict:
        """Lookup file hash"""
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
                
                return {
                    'success': True,
                    'data': {
                        'malicious': stats.get('malicious', 0),
                        'suspicious': stats.get('suspicious', 0),
                        'harmless': stats.get('harmless', 0),
                        'undetected': stats.get('undetected', 0),
                        'file_type': attributes.get('type_description', 'Unknown'),
                        'file_name': attributes.get('meaningful_name', 'Unknown')
                    }
                }
            else:
                return {'success': False, 'error': f'HTTP {response.status_code}', 'data': None}
        
        except Exception as e:
            return self.handle_request_error('VirusTotal', e)


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
                
                return {
                    'success': True,
                    'data': {
                        'total_results': data.get('total', 0),
                        'has_results': len(results) > 0,
                        'recent_scans': len(results)
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
                
                return {
                    'success': True,
                    'data': {
                        'pulse_count': data.get('pulse_info', {}).get('count', 0),
                        'country': data.get('country_name', 'Unknown'),
                        'asn': data.get('asn', 'Unknown'),
                        'reputation': data.get('reputation', 0)
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
                
                return {
                    'success': True,
                    'data': {
                        'pulse_count': data.get('pulse_info', {}).get('count', 0),
                        'alexa_rank': data.get('alexa', 'Unknown'),
                        'whois': data.get('whois', 'N/A')
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


class ThreatIntelAggregator:
    """Aggregate results from multiple threat intelligence sources"""
    
    def __init__(self):
        self.vt = VirusTotalService()
        self.abuseipdb = AbuseIPDBService()
        self.urlscan = URLScanService()
        self.otx = OTXService()
        self.greynoise = GreyNoiseService()
        self.whois_service = WHOISService()
    
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
        
        elif ioc_type == 'domain':
            results['sources']['virustotal'] = self.vt.lookup_domain(ioc_value)
            results['sources']['urlscan'] = self.urlscan.lookup_domain(ioc_value)
            results['sources']['otx'] = self.otx.lookup_domain(ioc_value)
            results['sources']['whois'] = self.whois_service.lookup_domain(ioc_value)
        
        elif ioc_type == 'url':
            results['sources']['virustotal'] = self.vt.lookup_url(ioc_value)
            results['sources']['urlscan'] = self.urlscan.lookup_url(ioc_value)
            results['sources']['otx'] = self.otx.lookup_url(ioc_value)
            # Screenshot with proper error handling
            try:
                results['sources']['screenshot'] = await self.screenshot.capture_screenshot(ioc_value)
            except Exception as e:
                logger.error(f"Screenshot capture failed for {ioc_value}: {str(e)}")
                results['sources']['screenshot'] = {
                    'success': False,
                    'error': f'Screenshot failed: {str(e)[:100]}',
                    'data': None
                }
        
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
