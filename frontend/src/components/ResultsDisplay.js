import { CheckCircle, XCircle, AlertTriangle, Shield, Activity } from 'lucide-react';

const ResultsDisplay = ({ results }) => {
  if (!results || !results.results) return null;

  const getTypeColor = (type) => {
    const colors = {
      ipv4: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      domain: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      url: 'bg-green-500/20 text-green-400 border-green-500/30',
      md5: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      sha1: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      sha256: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      email: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[type] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getThreatLevel = (iocResult) => {
    const sources = iocResult.sources || {};
    
    // Check VirusTotal
    const vt = sources.virustotal?.data;
    if (vt && (vt.malicious > 5 || vt.suspicious > 3)) {
      return { level: 'high', text: 'High Risk', color: 'text-red-400' };
    }
    
    // Check AbuseIPDB
    const abuse = sources.abuseipdb?.data;
    if (abuse && abuse.abuse_confidence_score > 75) {
      return { level: 'high', text: 'High Risk', color: 'text-red-400' };
    }
    
    // Check GreyNoise
    const greynoise = sources.greynoise?.data;
    if (greynoise && greynoise.classification === 'malicious') {
      return { level: 'high', text: 'High Risk', color: 'text-red-400' };
    }
    
    if (vt && (vt.malicious > 0 || vt.suspicious > 0)) {
      return { level: 'medium', text: 'Medium Risk', color: 'text-yellow-400' };
    }
    
    if (abuse && abuse.abuse_confidence_score > 25) {
      return { level: 'medium', text: 'Medium Risk', color: 'text-yellow-400' };
    }
    
    return { level: 'low', text: 'Low Risk', color: 'text-green-400' };
  };

  const SourceCard = ({ name, data, success, error }) => {
    // Special handling for screenshot
    if (name === 'Screenshot' && success && data?.screenshot) {
      return (
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-white">Screenshot</h4>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="mt-3">
            <img 
              src={data.screenshot} 
              alt="URL Screenshot" 
              className="w-full rounded-lg border border-slate-700"
            />
            <p className="text-xs text-slate-400 mt-2">{data.message}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-white">{name}</h4>
          {success ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
        </div>

        {success && data ? (
          <div className="space-y-2 text-sm">
            {Object.entries(data).map(([key, value]) => {
              if (value === null || value === undefined || key === 'screenshot') return null;
              
              // Special formatting for GreyNoise classification
              let displayValue = value;
              if (name === 'Greynoise' && key === 'classification') {
                const classColors = {
                  'malicious': 'text-red-400',
                  'benign': 'text-green-400',
                  'unknown': 'text-slate-400'
                };
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className={`font-medium ${classColors[value] || 'text-slate-200'}`}>
                      {String(value).toUpperCase()}
                    </span>
                  </div>
                );
              }
              
              return (
                <div key={key} className="flex justify-between">
                  <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                  <span className="text-slate-200 font-medium break-all">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-red-400">{error || 'No data available'}</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" data-testid="results-container">
      {/* Summary */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Lookup Results</h3>
          <span className="text-sm text-slate-400">
            {results.results.length} IOC{results.results.length !== 1 ? 's' : ''} analyzed
          </span>
        </div>
      </div>

      {/* Individual IOC Results */}
      {results.results.map((iocResult, index) => {
        const threatLevel = getThreatLevel(iocResult);
        
        return (
          <div
            key={index}
            data-testid={`ioc-result-${index}`}
            className="bg-slate-900 rounded-lg border border-slate-800 p-6"
          >
            {/* IOC Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(iocResult.type)}`}>
                  {iocResult.type.toUpperCase()}
                </span>
                <code className="text-lg text-white font-mono">{iocResult.ioc}</code>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className={`w-5 h-5 ${threatLevel.color}`} />
                <span className={`font-semibold ${threatLevel.color}`}>{threatLevel.text}</span>
              </div>
            </div>

            {/* Sources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(iocResult.sources || {}).map(([sourceName, sourceData]) => (
                <SourceCard
                  key={sourceName}
                  name={sourceName.charAt(0).toUpperCase() + sourceName.slice(1)}
                  data={sourceData.data}
                  success={sourceData.success}
                  error={sourceData.error}
                />
              ))}
            </div>

            {/* Quick Summary */}
            <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h5 className="font-semibold text-white">Quick Summary</h5>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {iocResult.sources?.virustotal?.data && (
                  <div>
                    <span className="text-slate-400">VT Malicious:</span>
                    <span className="ml-2 text-red-400 font-medium">
                      {iocResult.sources.virustotal.data.malicious || 0}
                    </span>
                  </div>
                )}
                {iocResult.sources?.abuseipdb?.data && (
                  <div>
                    <span className="text-slate-400">Abuse Score:</span>
                    <span className="ml-2 text-yellow-400 font-medium">
                      {iocResult.sources.abuseipdb.data.abuse_confidence_score || 0}%
                    </span>
                  </div>
                )}
                {iocResult.sources?.otx?.data && (
                  <div>
                    <span className="text-slate-400">OTX Pulses:</span>
                    <span className="ml-2 text-blue-400 font-medium">
                      {iocResult.sources.otx.data.pulse_count || 0}
                    </span>
                  </div>
                )}
                {iocResult.sources?.urlscan?.data && (
                  <div>
                    <span className="text-slate-400">URLScan:</span>
                    <span className="ml-2 text-green-400 font-medium">
                      {iocResult.sources.urlscan.data.message || 'Checked'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResultsDisplay;
