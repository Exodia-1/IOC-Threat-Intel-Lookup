import { CheckCircle, XCircle, AlertTriangle, Shield, Activity, AlertOctagon, Info, ExternalLink, TrendingUp, BarChart3, PieChart } from 'lucide-react';

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

  const ProgressBar = ({ value, max, color, label }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-400">{label}</span>
          <span className="text-xs font-bold text-white">{value}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const ScoreGauge = ({ score, maxScore = 100, label, thresholds }) => {
    const percentage = (score / maxScore) * 100;
    let color = 'bg-green-500';
    let textColor = 'text-green-400';
    
    if (thresholds) {
      if (score >= thresholds.high) {
        color = 'bg-red-500';
        textColor = 'text-red-400';
      } else if (score >= thresholds.medium) {
        color = 'bg-yellow-500';
        textColor = 'text-yellow-400';
      }
    }
    
    return (
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-700"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
              className={color.replace('bg-', 'text-')}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <div className={`text-2xl font-bold ${textColor}`}>{score}</div>
            <div className="text-xs text-slate-400">/ {maxScore}</div>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">{label}</p>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <div className="bg-slate-950 rounded-lg p-4 border border-slate-800">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );

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

  const getSourceIcon = (name) => {
    const icons = {
      'Virustotal': Shield,
      'Abuseipdb': AlertTriangle,
      'Greynoise': Activity,
      'Urlscan': ExternalLink,
      'Otx': Info,
      'Whois': Info
    };
    return icons[name] || Info;
  };

  const SourceCard = ({ name, data, success, error, iocValue, iocType }) => {
    const referralUrl = getSourceUrl(name, iocValue, iocType);
    const SourceIcon = getSourceIcon(name);
    
    // Special handling for screenshot
    if (name === 'Screenshot' && success && data?.screenshot) {
      return (
        <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <h4 className="font-semibold text-white">Visual Screenshot</h4>
            </div>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <div className="bg-white/5 p-2 rounded-lg mb-2">
            <p className="text-xs text-slate-400 mb-2">🎯 Use this to identify phishing pages by visual inspection</p>
            <img 
              src={data.screenshot} 
              alt="URL Screenshot" 
              className="w-full rounded-lg border border-slate-700"
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-green-400">{data.message}</p>
            <span className="text-xs text-slate-500">Captured: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 hover:border-cyan-600/50 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <SourceIcon className="w-4 h-4 text-cyan-400" />
            <h4 className="font-semibold text-white">{name}</h4>
            {referralUrl && (
              <a 
                href={referralUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                title={`View on ${name}`}
              >
                <ExternalLink className="w-3 h-3" />
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
          <>
            <div className="space-y-2 text-sm mb-3">
              {Object.entries(data).map(([key, value]) => {
                if (value === null || value === undefined || key === 'screenshot') return null;
                
                // Special formatting for threat indicators
                let displayClass = 'text-slate-200';
                let displayValue = value;
                
                // GreyNoise classification
                if (name === 'Greynoise' && key === 'classification') {
                  const classColors = {
                    'malicious': 'text-red-400 font-bold',
                    'benign': 'text-green-400 font-bold',
                    'unknown': 'text-slate-400'
                  };
                  displayClass = classColors[value] || 'text-slate-200';
                  displayValue = String(value).toUpperCase();
                }
                
                // VirusTotal malicious count
                if (name === 'Virustotal' && key === 'malicious' && value > 0) {
                  displayClass = 'text-red-400 font-bold';
                }
                
                // AbuseIPDB confidence score
                if (name === 'Abuseipdb' && key === 'abuse_confidence_score') {
                  if (value > 75) displayClass = 'text-red-400 font-bold';
                  else if (value > 25) displayClass = 'text-yellow-400 font-bold';
                  else displayClass = 'text-green-400';
                  displayValue = `${value}%`;
                }
                
                return (
                  <div key={key} className="flex justify-between items-start">
                    <span className="text-slate-400 capitalize text-xs">{key.replace(/_/g, ' ')}:</span>
                    <span className={`font-medium break-all max-w-[180px] text-right text-xs ${displayClass}`}>
                      {typeof displayValue === 'object' ? JSON.stringify(displayValue) : String(displayValue)}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {referralUrl && (
              <a 
                href={referralUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 mt-3 px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/50 rounded text-xs text-cyan-400 hover:text-cyan-300 transition-all"
              >
                <span>Full Report</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </>
        ) : (
          <div className="text-sm">
            <p className="text-red-400 mb-2">{error || 'No data available'}</p>
            {referralUrl && (
              <a 
                href={referralUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                Check manually on {name} →
              </a>
            )}
          </div>
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
        const threat = getThreatAssessment(iocResult);
        const ThreatIcon = threat.icon;
        
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
                <code className="text-lg text-white font-mono break-all">{iocResult.ioc}</code>
              </div>
              <div className="flex items-center space-x-2">
                <ThreatIcon className={`w-5 h-5 ${threat.color}`} />
                <span className={`font-semibold ${threat.color}`}>{threat.text}</span>
              </div>
            </div>

            {/* Threat Assessment Box */}
            <div className={`mb-6 p-4 rounded-lg border ${threat.borderColor} ${threat.bgColor}`}>
              <div className="flex items-start space-x-3">
                <ThreatIcon className={`w-6 h-6 ${threat.color} flex-shrink-0 mt-1`} />
                <div className="flex-1">
                  <h4 className={`font-semibold ${threat.color} mb-2`}>Threat Assessment</h4>
                  {threat.details.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {threat.details.map((detail, i) => (
                        <p key={i} className="text-sm text-slate-300">• {detail}</p>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-xs font-semibold text-slate-400 mb-2">RECOMMENDED ACTIONS:</p>
                    {threat.recommendations.map((rec, i) => (
                      <p key={i} className="text-sm text-slate-300 mb-1">{rec}</p>
                    ))}
                  </div>
                </div>
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
