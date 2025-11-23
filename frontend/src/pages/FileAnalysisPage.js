import { useState } from 'react';
import axios from 'axios';
import { FileText, Loader2, AlertCircle, Upload, Hash, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FileAnalysisPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResults(null);
    setError(null);
  };

  const handleClear = () => {
    setFile(null);
    setResults(null);
    setError(null);
    // Reset file input
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleFileAnalysis = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const content = e.target.result;
        const bytes = new Uint8Array(content);
        
        // Calculate hashes locally
        const hashes = await calculateHashes(bytes);
        
        // Get file metadata
        const metadata = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified).toISOString()
        };

        // Check for suspicious indicators locally
        const suspicious = checkSuspiciousIndicators(file, bytes);

        setResults({
          hashes,
          metadata,
          suspicious,
          risk_score: suspicious.length * 15
        });
        
        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError(err.message || 'Failed to analyze file');
      setLoading(false);
    }
  };

  const calculateHashes = async (bytes) => {
    const hashBuffer = async (algo, data) => {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    };

    return {
      md5: '(Not calculated)',
      sha1: await hashBuffer('SHA-1', bytes),
      sha256: await hashBuffer('SHA-256', bytes)
    };
  };

  const checkSuspiciousIndicators = (file, bytes) => {
    const indicators = [];
    
    // Check file size
    if (file.size === 0) {
      indicators.push('Zero-byte file (highly suspicious)');
    } else if (file.size < 100) {
      indicators.push('Very small file size');
    }

    // Check for executable extensions
    const executableExts = ['.exe', '.dll', '.bat', '.cmd', '.ps1', '.sh', '.app'];
    if (executableExts.some(ext => file.name.toLowerCase().endsWith(ext))) {
      indicators.push('Executable file extension detected');
    }

    // Check for double extension
    const parts = file.name.split('.');
    if (parts.length > 2) {
      indicators.push('Multiple file extensions detected');
    }

    // Check for executable signatures
    const signature = new Uint8Array(bytes.slice(0, 4));
    if (signature[0] === 0x4D && signature[1] === 0x5A) {
      indicators.push('Windows PE executable signature (MZ)');
    } else if (signature[0] === 0x7F && signature[1] === 0x45 && signature[2] === 0x4C && signature[3] === 0x46) {
      indicators.push('Linux ELF executable signature');
    }

    return indicators;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <FileText className="w-8 h-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">File Analysis</h2>
        </div>
        <p className="text-slate-400">Upload files for metadata analysis and suspicious indicator detection</p>
      </div>

      {/* File Upload Section */}
      <div className="mb-4">
        <p className="text-sm text-slate-400 bg-cyan-900/20 border border-cyan-600/30 rounded-lg p-3">
          💡 <strong>Tip:</strong> To check file hashes against threat intelligence, use the <strong>IOC Lookup</strong> page
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">(
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select File to Analyze
            </label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-cyan-600 transition-colors">
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
                data-testid="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-2">Click to select file or drag and drop</p>
                <p className="text-xs text-slate-500">Maximum file size: 10MB</p>
              </label>
            </div>
            {file && (
              <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
                <p className="text-sm text-slate-300">
                  <span className="font-medium">Selected:</span> {file.name} ({formatFileSize(file.size)})
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleFileAnalysis}
              disabled={loading || !file}
              data-testid="analyze-file-btn"
              className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Analyze File</span>
                </>
              )}
            </button>

            {file && (
              <button
                onClick={handleClear}
                data-testid="clear-file-btn"
                className="flex items-center space-x-2 px-4 py-3 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white font-medium rounded-lg transition-colors border border-slate-700 hover:border-red-500"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Upload Results */}
          {results && (
            <div className="mt-6 space-y-4">
              {/* Risk Score */}
              <div className={`p-4 rounded-lg border ${
                results.risk_score > 45 ? 'bg-red-900/20 border-red-500/50' :
                results.risk_score > 15 ? 'bg-yellow-900/20 border-yellow-500/50' :
                'bg-green-900/20 border-green-500/50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Risk Score:</span>
                  <span className={`text-2xl font-bold ${
                    results.risk_score > 45 ? 'text-red-400' :
                    results.risk_score > 15 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {results.risk_score}/100
                  </span>
                </div>
              </div>

              {/* File Metadata */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">File Information</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-slate-200 break-all max-w-md text-right">{results.metadata.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size:</span>
                    <span className="text-slate-200">{formatFileSize(results.metadata.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-slate-200">{results.metadata.type || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Modified:</span>
                    <span className="text-slate-200">{new Date(results.metadata.lastModified).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* File Hashes */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">File Hashes</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400">SHA-256:</span>
                    <code className="block mt-1 p-2 bg-slate-900 rounded text-xs text-slate-200 break-all font-mono">
                      {results.hashes.sha256}
                    </code>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">SHA-1:</span>
                    <code className="block mt-1 p-2 bg-slate-900 rounded text-xs text-slate-200 break-all font-mono">
                      {results.hashes.sha1}
                    </code>
                  </div>
                </div>
              </div>

              {/* Suspicious Indicators */}
              {results.suspicious && results.suspicious.length > 0 && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/50">
                  <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Suspicious Indicators</span>
                  </h4>
                  <ul className="space-y-2">
                    {results.suspicious.map((indicator, idx) => (
                      <li key={idx} className="text-xs text-red-300">• {indicator}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hash Threat Intelligence Tip */}
              <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/50">
                <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Check Hash Against Threat Intelligence</span>
                </h4>
                <p className="text-xs text-cyan-300 mb-3">
                  Copy the SHA-256 hash above and paste it into the <strong>IOC Lookup</strong> page to check against VirusTotal and AlienVault OTX.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(results.hashes.sha256);
                    alert('SHA-256 hash copied to clipboard!');
                  }}
                  className="text-xs px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
                >
                  Copy SHA-256 Hash
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div data-testid="error-message" className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-medium mb-1">Error</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileAnalysisPage;
