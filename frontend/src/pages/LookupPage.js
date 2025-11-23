import { useState } from 'react';
import axios from 'axios';
import { Search, Loader2, AlertCircle, CheckCircle, XCircle, X } from 'lucide-react';
import ResultsDisplay from '../components/ResultsDisplay';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LookupPage = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const exampleIOCs = `8.8.8.8
malware.com
https://suspicious-site.com/malware
44d88612fea8a8f36de82e1278abb02f
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`;

  const handleLookup = async () => {
    if (!inputText.trim()) {
      setError('Please enter at least one IOC');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${API}/ioc/lookup`, {
        text: inputText
      });

      if (response.data.success) {
        setResults(response.data);
      } else {
        setError(response.data.message || 'Lookup failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to lookup IOCs');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setInputText(exampleIOCs);
  };

  const handleClear = () => {
    setInputText('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">IOC Threat Intelligence Lookup</h2>
        <p className="text-slate-400">Paste IOCs below to check across 7 threat intelligence sources: VirusTotal, AbuseIPDB, GreyNoise, urlscan.io, AlienVault OTX, WHOIS, and MXToolbox</p>
        <p className="text-xs text-slate-500 mt-1">💡 Supports fanged IOCs: hxxp://example[.]com, 192[.]168[.]1[.]1, user[@]domain[.]com</p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Enter IOCs (one per line or comma-separated)
          </label>
          <textarea
            data-testid="ioc-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your IOCs here...\n\nExamples:\n8.8.8.8\nmalware.com\nhttps://suspicious-site.com\n44d88612fea8a8f36de82e1278abb02f"
            className="w-full h-48 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={loadExample}
              data-testid="load-example-btn"
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Load Example IOCs
            </button>
            
            {inputText && (
              <button
                onClick={handleClear}
                data-testid="clear-btn"
                className="flex items-center space-x-1 text-sm text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <button
            onClick={handleLookup}
            disabled={loading || !inputText.trim()}
            data-testid="lookup-btn"
            className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Looking up...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Lookup IOCs</span>
              </>
            )}
          </button>
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

      {/* Results Display */}
      {results && <ResultsDisplay results={results} />}

      {/* Info Section */}
      <div className="mt-8 bg-slate-900 rounded-lg border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Threat Intelligence Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-950 p-4 rounded-lg">
            <h4 className="text-cyan-400 font-medium mb-2">🔍 For IP Addresses</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• VirusTotal - Reputation</li>
              <li>• AbuseIPDB - Abuse Score</li>
              <li>• GreyNoise - Classification</li>
              <li>• AlienVault OTX - Pulses</li>
              <li>• WHOIS - Registration</li>
              <li>• MXToolbox - Blacklist</li>
            </ul>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg">
            <h4 className="text-cyan-400 font-medium mb-2">🌐 For Domains & URLs</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• VirusTotal - Analysis</li>
              <li>• urlscan.io - Scanning</li>
              <li>• AlienVault OTX - Intel</li>
              <li>• WHOIS - Registration</li>
              <li>• MXToolbox - MX/Blacklist</li>
              <li>• URL Analysis - Redirects</li>
            </ul>
          </div>
          <div className="bg-slate-950 p-4 rounded-lg">
            <h4 className="text-cyan-400 font-medium mb-2">📦 For File Hashes</h4>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• VirusTotal - Detection</li>
              <li>• AlienVault OTX - Pulses</li>
              <li>• Supports MD5/SHA1/SHA256</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-4">
          <h4 className="text-white font-medium mb-2">Supported IOC Types:</h4>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">IPv4</span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Domains</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">URLs</span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">MD5</span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">SHA1</span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm">SHA256</span>
            <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Email</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookupPage;
