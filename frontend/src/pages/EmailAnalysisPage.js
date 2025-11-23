import { useState } from 'react';
import axios from 'axios';
import { Mail, Loader2, AlertCircle, CheckCircle, XCircle, Shield, Activity, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EmailAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('domain');
  const [emailInput, setEmailInput] = useState('');
  const [headersInput, setHeadersInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleDomainCheck = async () => {
    if (!emailInput.trim()) {
      setError('Please enter an email address or domain');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${API}/email/check-domain`, {
        email: emailInput
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.error || 'Check failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to check email domain');
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderAnalysis = async () => {
    if (!headersInput.trim()) {
      setError('Please paste email headers');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${API}/email/analyze-headers`, {
        headers: headersInput
      });

      if (response.data.success) {
        setResults(response.data.data);
      } else {
        setError(response.data.error || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to analyze headers');
    } finally {
      setLoading(false);
    }
  };

  const SecurityScoreGauge = ({ score }) => {
    const percentage = score;
    let color = 'text-red-400';
    let bgColor = 'bg-red-500';
    
    if (score >= 75) {
      color = 'text-green-400';
      bgColor = 'bg-green-500';
    } else if (score >= 50) {
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-500';
    }
    
    return (
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              className="text-slate-700"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
              className={bgColor.replace('bg-', 'text-')}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <div className={`text-3xl font-bold ${color}`}>{score}</div>
            <div className="text-xs text-slate-400">/ 100</div>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-3">Security Score</p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Mail className="w-8 h-8 text-cyan-400" />
          <h2 className="text-3xl font-bold text-white">Email Analysis</h2>
        </div>
        <p className="text-slate-400">Check email domains for security or analyze email headers for threats</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('domain')}
          data-testid="tab-domain"
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'domain'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Email Domain Check
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          data-testid="tab-headers"
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === 'headers'
              ? 'bg-cyan-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Header Analysis
        </button>
      </div>

      {/* Domain Check Tab */}
      {activeTab === 'domain' && (
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address or Domain
            </label>
            <input
              type="text"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="user@example.com or example.com"
              data-testid="email-input"
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <button
            onClick={handleDomainCheck}
            disabled={loading}
            data-testid="check-domain-btn"
            className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Check Domain</span>
              </>
            )}
          </button>

          {/* Domain Results */}
          {results && activeTab === 'domain' && (
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center items-center">
                  <SecurityScoreGauge score={results.security_score} />
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3">Security Records</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">MX Records:</span>
                        {results.mx_records ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">SPF Record:</span>
                        {results.spf_record ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">DMARC Record:</span>
                        {results.dmarc_record ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">DKIM Capable:</span>
                        {results.dkim_capable ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {results.mx_records && (
                    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">MX Records</h4>
                      <p className="text-xs text-slate-300 break-all">{results.mx_records}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header Analysis Tab */}
      {activeTab === 'headers' && (
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Headers (View Full Headers / Show Original)
            </label>
            <textarea
              value={headersInput}
              onChange={(e) => setHeadersInput(e.target.value)}
              placeholder="Paste email headers here...&#10;&#10;Example:&#10;From: sender@example.com&#10;To: recipient@domain.com&#10;Received: from mail.example.com..."
              data-testid="headers-input"
              className="w-full h-64 px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-xs"
            />
          </div>

          <button
            onClick={handleHeaderAnalysis}
            disabled={loading}
            data-testid="analyze-headers-btn"
            className="flex items-center space-x-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                <span>Analyze Headers</span>
              </>
            )}
          </button>

          {/* Header Analysis Results */}
          {results && activeTab === 'headers' && (
            <div className="mt-6 space-y-4">
              {/* Threat Score */}
              <div className={`p-4 rounded-lg border ${
                results.threat_score > 30 ? 'bg-red-900/20 border-red-500/50' :
                results.threat_score > 10 ? 'bg-yellow-900/20 border-yellow-500/50' :
                'bg-green-900/20 border-green-500/50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Threat Score:</span>
                  <span className={`text-2xl font-bold ${
                    results.threat_score > 30 ? 'text-red-400' :
                    results.threat_score > 10 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {results.threat_score}/100
                  </span>
                </div>
              </div>

              {/* Sender Information */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Sender Information</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">From:</span>
                    <span className="text-slate-200 break-all max-w-md text-right">{results.sender?.from}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Return-Path:</span>
                    <span className="text-slate-200">{results.sender?.return_path}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reply-To:</span>
                    <span className="text-slate-200">{results.sender?.reply_to}</span>
                  </div>
                  {results.sender?.mismatch && (
                    <div className="mt-2 p-2 bg-red-900/20 border border-red-500/30 rounded">
                      <span className="text-red-400 text-xs">⚠️ Sender domain mismatch detected!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* IP Chain */}
              {results.ip_chain && results.ip_chain.length > 0 && (
                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                  <h4 className="text-sm font-semibold text-slate-400 mb-3">IP Chain</h4>
                  <div className="space-y-1">
                    {results.ip_chain.map((ip, idx) => (
                      <div key={idx} className="text-xs text-slate-300 flex items-center space-x-2">
                        <span className="text-cyan-400">→</span>
                        <code className="bg-slate-900 px-2 py-1 rounded">{ip}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Authentication Results */}
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
                <h4 className="text-sm font-semibold text-slate-400 mb-3">Authentication</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['spf', 'dkim', 'dmarc'].map((auth) => (
                    <div key={auth} className="text-center">
                      <div className={`text-xs font-bold mb-1 ${
                        results.authentication?.[auth] === 'PASS' ? 'text-green-400' :
                        results.authentication?.[auth] === 'FAIL' ? 'text-red-400' :
                        'text-slate-400'
                      }`}>
                        {results.authentication?.[auth] || 'UNKNOWN'}
                      </div>
                      <div className="text-xs text-slate-500">{auth.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suspicious Indicators */}
              {results.suspicious_indicators && results.suspicious_indicators.length > 0 && (
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/50">
                  <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>Suspicious Indicators</span>
                  </h4>
                  <ul className="space-y-2">
                    {results.suspicious_indicators.map((indicator, idx) => (
                      <li key={idx} className="text-xs text-red-300">• {indicator}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

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

export default EmailAnalysisPage;
