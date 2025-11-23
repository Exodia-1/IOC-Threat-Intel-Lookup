import re
import dns.resolver
from typing import Dict, List
import base64
from email import policy
from email.parser import BytesParser

class EmailAnalyzer:
    """Analyze email headers and domains for threat intelligence"""
    
    @staticmethod
    def check_email_domain(email: str) -> Dict:
        """Check email domain for validity and security records"""
        try:
            domain = email.split('@')[1] if '@' in email else email
            
            results = {
                'domain': domain,
                'mx_records': EmailAnalyzer._get_mx_records(domain),
                'spf_record': EmailAnalyzer._get_spf_record(domain),
                'dmarc_record': EmailAnalyzer._get_dmarc_record(domain),
                'dkim_capable': EmailAnalyzer._check_dkim(domain),
                'security_score': 0
            }
            
            # Calculate security score
            score = 0
            if results['mx_records']: score += 25
            if results['spf_record']: score += 25
            if results['dmarc_record']: score += 25
            if results['dkim_capable']: score += 25
            results['security_score'] = score
            
            return {
                'success': True,
                'data': results
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'data': None
            }
    
    @staticmethod
    def analyze_email_headers(headers_text: str) -> Dict:
        """Analyze email headers for threat indicators"""
        try:
            # Parse headers
            parsed = EmailAnalyzer._parse_headers(headers_text)
            
            # Extract key information
            sender_info = EmailAnalyzer._extract_sender_info(parsed)
            ip_chain = EmailAnalyzer._extract_ip_chain(parsed)
            authentication = EmailAnalyzer._check_authentication(parsed)
            suspicious_indicators = EmailAnalyzer._detect_suspicious_patterns(parsed)
            
            results = {
                'sender': sender_info,
                'ip_chain': ip_chain,
                'authentication': authentication,
                'suspicious_indicators': suspicious_indicators,
                'threat_score': len(suspicious_indicators) * 10
            }
            
            return {
                'success': True,
                'data': results
            }
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'data': None
            }
    
    @staticmethod
    def _get_mx_records(domain: str) -> str:
        """Get MX records for domain"""
        try:
            mx_records = dns.resolver.resolve(domain, 'MX')
            return ', '.join([str(r.exchange) for r in sorted(mx_records, key=lambda x: x.preference)])
        except Exception:
            return None
    
    @staticmethod
    def _get_spf_record(domain: str) -> str:
        """Get SPF record for domain"""
        try:
            txt_records = dns.resolver.resolve(domain, 'TXT')
            for record in txt_records:
                record_str = str(record).strip('"')
                if record_str.startswith('v=spf1'):
                    return record_str
            return None
        except Exception:
            return None
    
    @staticmethod
    def _get_dmarc_record(domain: str) -> str:
        """Get DMARC record for domain"""
        try:
            dmarc_domain = f'_dmarc.{domain}'
            txt_records = dns.resolver.resolve(dmarc_domain, 'TXT')
            for record in txt_records:
                record_str = str(record).strip('"')
                if record_str.startswith('v=DMARC1'):
                    return record_str
            return None
        except Exception:
            return None
    
    @staticmethod
    def _check_dkim(domain: str) -> bool:
        """Check if domain has DKIM configured"""
        try:
            # Common DKIM selectors
            selectors = ['default', 'google', 'k1', 's1', 'selector1', 'selector2']
            for selector in selectors:
                try:
                    dkim_domain = f'{selector}._domainkey.{domain}'
                    dns.resolver.resolve(dkim_domain, 'TXT')
                    return True
                except:
                    continue
            return False
        except Exception:
            return False
    
    @staticmethod
    def _parse_headers(headers_text: str) -> Dict:
        """Parse raw email headers"""
        headers = {}
        current_header = None
        
        for line in headers_text.split('\n'):
            if line and (line[0] == ' ' or line[0] == '\t'):
                # Continuation of previous header
                if current_header:
                    headers[current_header] += ' ' + line.strip()
            else:
                # New header
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip()
                    value = value.strip()
                    current_header = key
                    if key in headers:
                        headers[key] += ', ' + value
                    else:
                        headers[key] = value
        
        return headers
    
    @staticmethod
    def _extract_sender_info(headers: Dict) -> Dict:
        """Extract sender information"""
        return {
            'from': headers.get('From', 'Unknown'),
            'return_path': headers.get('Return-Path', 'Unknown'),
            'reply_to': headers.get('Reply-To', headers.get('From', 'Unknown')),
            'envelope_from': headers.get('X-Envelope-From', 'Unknown'),
            'mismatch': EmailAnalyzer._check_sender_mismatch(headers)
        }
    
    @staticmethod
    def _check_sender_mismatch(headers: Dict) -> bool:
        """Check if sender addresses mismatch (spoofing indicator)"""
        from_addr = headers.get('From', '')
        return_path = headers.get('Return-Path', '')
        
        # Extract email addresses
        from_email = re.findall(r'[\w\.-]+@[\w\.-]+', from_addr)
        return_email = re.findall(r'[\w\.-]+@[\w\.-]+', return_path)
        
        if from_email and return_email:
            from_domain = from_email[0].split('@')[1] if '@' in from_email[0] else ''
            return_domain = return_email[0].split('@')[1] if '@' in return_email[0] else ''
            return from_domain != return_domain
        
        return False
    
    @staticmethod
    def _extract_ip_chain(headers: Dict) -> List[str]:
        """Extract IP addresses from Received headers"""
        ips = []
        received_headers = []
        
        # Get all Received headers
        for key, value in headers.items():
            if key.lower() == 'received':
                received_headers.append(value)
        
        # Extract IPs
        ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
        for received in received_headers:
            found_ips = re.findall(ip_pattern, received)
            for ip in found_ips:
                if ip not in ips and not ip.startswith('127.') and not ip.startswith('10.'):
                    ips.append(ip)
        
        return ips[:10]  # Return top 10 IPs
    
    @staticmethod
    def _check_authentication(headers: Dict) -> Dict:
        """Check email authentication results"""
        return {
            'spf': EmailAnalyzer._parse_auth_result(headers, 'spf'),
            'dkim': EmailAnalyzer._parse_auth_result(headers, 'dkim'),
            'dmarc': EmailAnalyzer._parse_auth_result(headers, 'dmarc')
        }
    
    @staticmethod
    def _parse_auth_result(headers: Dict, auth_type: str) -> str:
        """Parse authentication results from headers"""
        auth_headers = [
            'Authentication-Results',
            'ARC-Authentication-Results',
            'X-Google-DKIM-Signature'
        ]
        
        for header in auth_headers:
            if header in headers:
                value = headers[header].lower()
                if auth_type in value:
                    if 'pass' in value:
                        return 'PASS'
                    elif 'fail' in value:
                        return 'FAIL'
                    elif 'softfail' in value:
                        return 'SOFTFAIL'
        
        return 'UNKNOWN'
    
    @staticmethod
    def _detect_suspicious_patterns(headers: Dict) -> List[str]:
        """Detect suspicious patterns in headers"""
        indicators = []
        
        # Check for sender mismatch
        if headers.get('From', '') and headers.get('Return-Path', ''):
            if EmailAnalyzer._check_sender_mismatch(headers):
                indicators.append('Sender domain mismatch (From vs Return-Path)')
        
        # Check for suspicious subjects
        subject = headers.get('Subject', '').lower()
        suspicious_keywords = ['urgent', 'verify', 'suspended', 'unusual', 'confirm', 'security', 'update required']
        if any(keyword in subject for keyword in suspicious_keywords):
            indicators.append(f'Suspicious subject line: {subject[:50]}')
        
        # Check for missing headers
        required_headers = ['From', 'To', 'Date', 'Message-ID']
        for required in required_headers:
            if required not in headers:
                indicators.append(f'Missing required header: {required}')
        
        # Check authentication
        auth_results = headers.get('Authentication-Results', '').lower()
        if 'fail' in auth_results:
            indicators.append('Authentication failure detected')
        
        return indicators
