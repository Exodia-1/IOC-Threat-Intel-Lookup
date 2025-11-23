import { CheckCircle, XCircle, AlertTriangle, Shield, Activity, AlertOctagon, Info, ExternalLink } from 'lucide-react';

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

  const getThreatAssessment = (iocResult) => {
    const sources = iocResult.sources || {};
    const vt = sources.virustotal?.data;
    const abuse = sources.abuseipdb?.data;
    const greynoise = sources.greynoise?.data;
    
    let level = 'low';
    let color = 'text-green-400';
    let bgColor = 'bg-green-900/20';
    let borderColor = 'border-green-500/30';
    let icon = CheckCircle;
    let text = 'Low Risk - Appears Safe';
    let details = [];
    let recommendations = [];
    
    // High Risk Detection
    if (vt && vt.malicious > 5) {
      level = 'high';
      color = 'text-red-400';
      bgColor = 'bg-red-900/20';
      borderColor = 'border-red-500/50';
      icon = AlertOctagon;
      text = 'High Risk - Confirmed Malicious';
      details.push(`${vt.malicious} security vendors flagged as malicious`);
      recommendations.push('🚫 Block immediately in firewall/proxy');
      recommendations.push('🔍 Investigate all systems that contacted this IOC');
      recommendations.push('📝 Document in incident report');
    } else if (abuse && abuse.abuse_confidence_score > 75) {
      level = 'high';
      color = 'text-red-400';
      bgColor = 'bg-red-900/20';
      borderColor = 'border-red-500/50';
      icon = AlertOctagon;
      text = 'High Risk - Abuse Confirmed';
      details.push(`${abuse.abuse_confidence_score}% abuse confidence score`);
      details.push(`${abuse.total_reports} abuse reports from ${abuse.num_distinct_users} users`);
      recommendations.push('🚫 Block this IP in security controls');
      recommendations.push('🔍 Check for lateral movement');
    } else if (greynoise && greynoise.classification === 'malicious') {
      level = 'high';
      color = 'text-red-400';
      bgColor = 'bg-red-900/20';
      borderColor = 'border-red-500/50';
      icon = AlertOctagon;
      text = 'High Risk - Known Malicious Actor';
      details.push('Classified as malicious by GreyNoise');
      recommendations.push('🚫 Immediate blocking required');
      recommendations.push('🔍 Review connection logs');
    }
    // Medium Risk Detection
    else if (vt && (vt.malicious > 0 || vt.suspicious > 2)) {
      level = 'medium';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-900/20';
      borderColor = 'border-yellow-500/50';
      icon = AlertTriangle;
      text = 'Medium Risk - Suspicious Activity Detected';
      details.push(`${vt.malicious} malicious, ${vt.suspicious} suspicious detections`);
      recommendations.push('⚠️ Monitor closely');
      recommendations.push('🔍 Consider temporary blocking');
      recommendations.push('📊 Analyze traffic patterns');
    } else if (abuse && abuse.abuse_confidence_score > 25) {
      level = 'medium';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-900/20';
      borderColor = 'border-yellow-500/50';
      icon = AlertTriangle;
      text = 'Medium Risk - Some Abuse Reports';
      details.push(`${abuse.abuse_confidence_score}% abuse confidence`);
      recommendations.push('⚠️ Monitor for suspicious behavior');
      recommendations.push('📊 Check usage context');
    }
    // Low Risk
    else {
      if (greynoise && greynoise.classification === 'benign') {
        details.push('Classified as benign by GreyNoise');
        if (greynoise.name) details.push(`Service: ${greynoise.name}`);
      }
      if (vt && vt.harmless > 50) {
        details.push(`${vt.harmless} vendors marked as harmless`);
      }
      if (abuse && abuse.is_whitelisted) {
        details.push('Whitelisted in AbuseIPDB');
      }
      recommendations.push('✅ No immediate action required');
      recommendations.push('📊 Continue normal monitoring');
    }
    
    return { level, color, bgColor, borderColor, icon, text, details, recommendations };
  };

  const getSourceUrl = (sourceName, iocValue, iocType) => {
    const urls = {
      'Virustotal': iocType === 'ipv4' ? `https://www.virustotal.com/gui/ip-address/${iocValue}` :
                    iocType === 'domain' ? `https://www.virustotal.com/gui/domain/${iocValue}` :
                    iocType === 'url' ? `https://www.virustotal.com/gui/url/${btoa(iocValue).replace(/=/g, '')}` :
                    `https://www.virustotal.com/gui/file/${iocValue}`,
      'Abuseipdb': `https://www.abuseipdb.com/check/${iocValue}`,
      'Greynoise': `https://www.greynoise.io/viz/ip/${iocValue}`,
      'Urlscan': `https://urlscan.io/search/#${iocValue}`,
      'Otx': iocType === 'ipv4' ? `https://otx.alienvault.com/indicator/ip/${iocValue}` :
             iocType === 'domain' ? `https://otx.alienvault.com/indicator/domain/${iocValue}` :
             `https://otx.alienvault.com/indicator/file/${iocValue}`,
      'Whois': iocType === 'domain' ? `https://www.whois.com/whois/${iocValue}` :
               `https://www.whois.com/whois/${iocValue}`
    };
    return urls[sourceName] || null;
  };

  const SourceCard = ({ name, data, success, error, iocValue, iocType }) => {
    const referralUrl = getSourceUrl(name, iocValue, iocType);
    
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
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-white">{name}</h4>
            {referralUrl && (
              <a 
                href={referralUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-xs"
                title={`View on ${name}`}
              >
                ↗
              </a>
            )}
          </div>
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
                  <span className="text-slate-200 font-medium break-all max-w-[200px]">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-red-400">{error || 'No data available'}</p>
        )}
        
        {referralUrl && (
          <a 
            href={referralUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 block text-xs text-cyan-400 hover:text-cyan-300"
          >
            View full report on {name} →
          </a>
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
                  iocValue={iocResult.ioc}
                  iocType={iocResult.type}
                />
              ))}
            </div>

            {/* Quick Summary */}
            <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h5 className="font-semibold text-white">Quick Summary</h5>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
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
                {iocResult.sources?.greynoise?.data && (
                  <div>
                    <span className="text-slate-400">GreyNoise:</span>
                    <span className={`ml-2 font-medium ${
                      iocResult.sources.greynoise.data.classification === 'malicious' ? 'text-red-400' :
                      iocResult.sources.greynoise.data.classification === 'benign' ? 'text-green-400' :
                      'text-slate-400'
                    }`}>
                      {iocResult.sources.greynoise.data.classification || 'unknown'}
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
