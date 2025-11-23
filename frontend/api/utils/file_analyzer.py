import hashlib
import os
from datetime import datetime
from typing import Dict

try:
    import magic
    MAGIC_AVAILABLE = True
except ImportError:
    MAGIC_AVAILABLE = False

class FileAnalyzer:
    """Analyze files for metadata and threat intelligence"""
    
    @staticmethod
    def analyze_file(file_path: str, file_content: bytes = None) -> Dict:
        """Analyze file and extract metadata"""
        try:
            if file_content is None and file_path and os.path.exists(file_path):
                with open(file_path, 'rb') as f:
                    file_content = f.read()
            
            if file_content is None:
                return {
                    'success': False,
                    'error': 'No file content provided',
                    'data': None
                }
            
            # Calculate hashes
            hashes = FileAnalyzer._calculate_hashes(file_content)
            
            # Get file metadata
            metadata = FileAnalyzer._get_metadata(file_path, file_content)
            
            # Detect file type
            file_type = FileAnalyzer._detect_file_type(file_content)
            
            # Check for suspicious indicators
            suspicious = FileAnalyzer._check_suspicious_indicators(file_content, metadata)
            
            results = {
                'hashes': hashes,
                'metadata': metadata,
                'file_type': file_type,
                'suspicious_indicators': suspicious,
                'risk_score': len(suspicious) * 15
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
    def _calculate_hashes(content: bytes) -> Dict:
        """Calculate file hashes"""
        return {
            'md5': hashlib.md5(content).hexdigest(),
            'sha1': hashlib.sha1(content).hexdigest(),
            'sha256': hashlib.sha256(content).hexdigest(),
            'size': len(content)
        }
    
    @staticmethod
    def _get_metadata(file_path: str, content: bytes) -> Dict:
        """Extract file metadata"""
        metadata = {
            'size_bytes': len(content),
            'size_kb': round(len(content) / 1024, 2),
            'size_mb': round(len(content) / (1024 * 1024), 2)
        }
        
        if file_path and os.path.exists(file_path):
            stat = os.stat(file_path)
            metadata.update({
                'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat(),
                'accessed': datetime.fromtimestamp(stat.st_atime).isoformat()
            })
        
        return metadata
    
    @staticmethod
    def _detect_file_type(content: bytes) -> Dict:
        """Detect file type using magic bytes"""
        try:
            if MAGIC_AVAILABLE:
                # Try to use python-magic
                file_type = magic.from_buffer(content, mime=True)
                file_description = magic.from_buffer(content)
            else:
                # Basic detection without magic
                file_type = 'application/octet-stream'
                file_description = 'File type detection unavailable'
            
            # Detect potential executable
            is_executable = FileAnalyzer._is_executable(content)
            
            # Detect script files
            is_script = FileAnalyzer._is_script(content)
            
            return {
                'mime_type': file_type,
                'description': file_description,
                'is_executable': is_executable,
                'is_script': is_script
            }
        except Exception as e:
            # Fallback detection
            return {
                'mime_type': 'application/octet-stream',
                'description': 'Unknown file type',
                'is_executable': FileAnalyzer._is_executable(content),
                'is_script': FileAnalyzer._is_script(content),
                'error': str(e)
            }
    
    @staticmethod
    def _is_executable(content: bytes) -> bool:
        """Check if file is executable"""
        # Check for common executable signatures
        exe_signatures = [
            b'MZ',  # Windows PE
            b'\x7fELF',  # Linux ELF
            b'\xca\xfe\xba\xbe',  # macOS Mach-O
            b'\xfe\xed\xfa\xce',  # macOS Mach-O (32-bit)
        ]
        
        if len(content) < 4:
            return False
        
        return any(content.startswith(sig) for sig in exe_signatures)
    
    @staticmethod
    def _is_script(content: bytes) -> bool:
        """Check if file is a script"""
        try:
            # Try to decode as text
            text = content[:1024].decode('utf-8', errors='ignore')
            
            # Check for script indicators
            script_indicators = [
                '#!/bin/bash',
                '#!/bin/sh',
                '#!/usr/bin/python',
                '#!/usr/bin/perl',
                '<script>',
                'powershell',
                'cmd.exe',
                'eval(',
            ]
            
            return any(indicator in text.lower() for indicator in script_indicators)
        except:
            return False
    
    @staticmethod
    def _check_suspicious_indicators(content: bytes, metadata: Dict) -> list:
        """Check for suspicious file indicators"""
        indicators = []
        
        # Check file size
        if metadata['size_bytes'] == 0:
            indicators.append('Zero-byte file (highly suspicious)')
        elif metadata['size_bytes'] < 100:
            indicators.append('Very small file size')
        
        # Check for executable
        if FileAnalyzer._is_executable(content):
            indicators.append('Executable file detected')
        
        # Check for obfuscation indicators
        try:
            text_content = content[:10000].decode('utf-8', errors='ignore')
            
            # Check for base64 patterns
            if text_content.count('==') > 5:
                indicators.append('Possible base64 encoding detected')
            
            # Check for suspicious keywords
            suspicious_keywords = [
                'eval', 'exec', 'system', 'shell_exec',
                'powershell', 'cmd.exe', '/bin/sh',
                'download', 'wget', 'curl',
                'ransomware', 'encrypt', 'decrypt'
            ]
            
            for keyword in suspicious_keywords:
                if keyword in text_content.lower():
                    indicators.append(f'Suspicious keyword detected: {keyword}')
                    break  # Only report once
        except:
            pass
        
        # Check for double extensions
        # This would need filename which we don't have here
        
        return indicators
