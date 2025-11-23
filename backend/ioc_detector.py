import re
from typing import List, Dict

class IOCDetector:
    """Detect and classify Indicators of Compromise (IOCs)"""
    
    # Regex patterns for IOC detection
    IPV4_PATTERN = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
    DOMAIN_PATTERN = r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b'
    URL_PATTERN = r'https?://[^\s]+'
    EMAIL_PATTERN = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    MD5_PATTERN = r'\b[a-fA-F0-9]{32}\b'
    SHA1_PATTERN = r'\b[a-fA-F0-9]{40}\b'
    SHA256_PATTERN = r'\b[a-fA-F0-9]{64}\b'
    
    @staticmethod
    def defang_ioc(ioc: str) -> str:
        """
        Defang IOCs - convert fanged IOCs back to normal format
        Examples:
          hxxp://example[.]com -> http://example.com
          192[.]168[.]1[.]1 -> 192.168.1.1
          example[.]com -> example.com
          user[@]example[.]com -> user@example.com
        """
        # Replace hxxp/hxxps with http/https
        ioc = ioc.replace('hxxp://', 'http://')
        ioc = ioc.replace('hxxps://', 'https://')
        ioc = ioc.replace('hXXp://', 'http://')
        ioc = ioc.replace('hXXps://', 'https://')
        
        # Replace [.] with .
        ioc = ioc.replace('[.]', '.')
        ioc = ioc.replace('[dot]', '.')
        ioc = ioc.replace('(dot)', '.')
        ioc = ioc.replace('(.)', '.')
        
        # Replace [@] with @
        ioc = ioc.replace('[@]', '@')
        ioc = ioc.replace('[at]', '@')
        ioc = ioc.replace('(at)', '@')
        ioc = ioc.replace('(@)', '@')
        
        # Replace [://] with ://
        ioc = ioc.replace('[://]', '://')
        ioc = ioc.replace('[:]', ':')
        
        return ioc
    
    @staticmethod
    def is_valid_ipv4(ip: str) -> bool:
        """Validate IPv4 address"""
        try:
            parts = ip.split('.')
            if len(parts) != 4:
                return False
            return all(0 <= int(part) <= 255 for part in parts)
        except (ValueError, AttributeError):
            return False
    
    @staticmethod
    def detect_ioc_type(ioc: str) -> str:
        """Detect the type of IOC"""
        ioc = ioc.strip()
        
        # Check for hashes (most specific first)
        if re.fullmatch(IOCDetector.SHA256_PATTERN, ioc):
            return 'sha256'
        if re.fullmatch(IOCDetector.SHA1_PATTERN, ioc):
            return 'sha1'
        if re.fullmatch(IOCDetector.MD5_PATTERN, ioc):
            return 'md5'
        
        # Check for URL (before domain, as URLs contain domains)
        if re.match(IOCDetector.URL_PATTERN, ioc):
            return 'url'
        
        # Check for email
        if re.fullmatch(IOCDetector.EMAIL_PATTERN, ioc):
            return 'email'
        
        # Check for IPv4
        if re.fullmatch(IOCDetector.IPV4_PATTERN, ioc):
            if IOCDetector.is_valid_ipv4(ioc):
                return 'ipv4'
        
        # Check for domain
        if re.fullmatch(IOCDetector.DOMAIN_PATTERN, ioc):
            return 'domain'
        
        return 'unknown'
    
    @staticmethod
    def extract_iocs(text: str) -> List[Dict[str, str]]:
        """Extract IOCs from text and classify them"""
        lines = text.strip().split('\n')
        iocs = []
        seen = set()
        
        for line in lines:
            # Split by common delimiters
            parts = re.split(r'[,;\s]+', line.strip())
            
            for part in parts:
                part = part.strip()
                if not part or len(part) < 3:
                    continue
                
                # Defang the IOC first
                original_part = part
                part = IOCDetector.defang_ioc(part)
                
                ioc_type = IOCDetector.detect_ioc_type(part)
                
                if ioc_type != 'unknown' and part not in seen:
                    iocs.append({
                        'value': part,
                        'type': ioc_type,
                        'was_fanged': original_part != part
                    })
                    seen.add(part)
        
        return iocs
