import React from 'react';
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
    
    // High Risk Detection
    if (vt && vt.malicious > 5) {
      level = 'high';
      color = 'text-red-400';
      bgColor = 'bg-red-900/20';
      borderColor = 'border-red-500/50';
      icon = AlertOctagon;
      text = 'High Risk - Confirmed Malicious';
      details.push(`${vt.malicious} security vendors flagged as malicious`);
      details.push(`${vt.suspicious} suspicious detections`);
    } else if (abuse && abuse.abuse_confidence_score > 75) {
      level = 'high';
      color = 'text-red-400';
      bgColor = 'bg-red-900/20';
      borderColor = 'border-red-500/50';
      icon = AlertOctagon;
      text = 'High Risk - Abuse Confirmed';
      details.push(`${abuse.abuse_confidence_score}% abuse confidence score`);
      details.push(`${abuse.total_reports} abuse reports from ${abuse.num_distinct_users} users`);
    } else if (greynoise && greynoise.classification === 'malicious') {
      level = 'high';
      color = 'text-red-400';
      bgColor = 'bg-red-900/20';
      borderColor = 'border-red-500/50';
      icon = AlertOctagon;
      text = 'High Risk - Known Malicious Actor';
      details.push('Classified as malicious by GreyNoise');
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
    } else if (abuse && abuse.abuse_confidence_score > 25) {
      level = 'medium';
      color = 'text-yellow-400';
      bgColor = 'bg-yellow-900/20';
      borderColor = 'border-yellow-500/50';
      icon = AlertTriangle;
      text = 'Medium Risk - Some Abuse Reports';
      details.push(`${abuse.abuse_confidence_score}% abuse confidence`);
      details.push(`${abuse.total_reports} total reports`);
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
    }
    
    return { level, color, bgColor, borderColor, icon, text, details };
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
      'Whois': Info,
      'Mxtoolbox': Shield
    };
    return icons[name] || Info;
  };

  const SourceCard = ({ name, data, success, error, iocValue, iocType }) => {
    const referralUrl = getSourceUrl(name, iocValue, iocType);
    const SourceIcon = getSourceIcon(name);
    
    return (
      <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 hover:border-cyan-600/50 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SourceIcon className="w-5 h-5 text-cyan-400" />
            <h4 className="font-semibold text-white text-sm">{name}</h4>
          </div>
          {success ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
        </div>

        {success && data ? (
          <>
            {/* VirusTotal Visual Stats */}
            {name === 'Virustotal' && (
              <div className="mb-4">
                {/* File Information for Hashes */}
                {iocType && ['md5', 'sha1', 'sha256'].includes(iocType) && (
                  <div className="mb-4 p-3 bg-slate-900 rounded-lg border border-slate-700">
                    <h5 className="text-xs font-semibold text-cyan-400 mb-2">File Information</h5>
                    <div className="space-y-2 text-xs">
                      {data.file_name && data.file_name !== 'Unknown' && (
                        <div>
                          <span className="text-slate-400">Name:</span>
                          <div className="text-slate-200 font-medium mt-1 break-all">{data.file_name}</div>
                        </div>
                      )}
                      {data.size_readable && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Size:</span>
                          <span className="text-slate-200 font-bold">{data.size_readable}</span>
                        </div>
                      )}
                      {data.file_type && data.file_type !== 'Unknown' && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Type:</span>
                          <span className="text-slate-200 font-medium">{data.file_type}</span>
                        </div>
                      )}
                      {data.file_extension && data.file_extension !== 'Unknown' && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Extension:</span>
                          <span className="text-slate-200 font-medium">.{data.file_extension}</span>
                        </div>
                      )}
                      {data.times_submitted > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Submissions:</span>
                          <span className="text-slate-200 font-medium">{data.times_submitted}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* File Hashes */}
                    {data.sha256 && data.sha256 !== 'N/A' && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <h5 className="text-xs font-semibold text-cyan-400 mb-2">Hashes</h5>
                        <div className="space-y-1">
                          <div>
                            <span className="text-slate-500 text-xs">MD5:</span>
                            <code className="block text-xs text-slate-300 font-mono break-all bg-slate-950 p-1 rounded mt-1">
                              {data.md5}
                            </code>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs">SHA-1:</span>
                            <code className="block text-xs text-slate-300 font-mono break-all bg-slate-950 p-1 rounded mt-1">
                              {data.sha1}
                            </code>
                          </div>
                          <div>
                            <span className="text-slate-500 text-xs">SHA-256:</span>
                            <code className="block text-xs text-slate-300 font-mono break-all bg-slate-950 p-1 rounded mt-1">
                              {data.sha256}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {data.tags && data.tags.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <h5 className="text-xs font-semibold text-cyan-400 mb-2">Tags</h5>
                        <div className="flex flex-wrap gap-1">
                          {data.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Detection Ratio - Prominent Display */}
                {data.detection_ratio && (
                  <div className="mb-4 p-4 bg-gradient-to-br from-red-900/20 to-orange-900/20 rounded-lg border-2 border-red-500/30">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 mb-2">Detection Ratio</div>
                      <div className="text-4xl font-bold text-red-400 mb-1">{data.detection_ratio}</div>
                      <div className="text-xs text-slate-500">Security Vendors</div>
                    </div>
                  </div>
                )}
                
                {/* Detection Stats */}
                <ProgressBar 
                  value={data.malicious || 0} 
                  max={data.total_scans || 100} 
                  color="bg-red-500" 
                  label="Malicious" 
                />
                <ProgressBar 
                  value={data.suspicious || 0} 
                  max={data.total_scans || 100} 
                  color="bg-yellow-500" 
                  label="Suspicious" 
                />
                <ProgressBar 
                  value={data.harmless || 0} 
                  max={data.total_scans || 100} 
                  color="bg-green-500" 
                  label="Harmless" 
                />
                <ProgressBar 
                  value={data.undetected || 0} 
                  max={data.total_scans || 100} 
                  color="bg-slate-600" 
                  label="Undetected" 
                />
                <div className="mt-3 pt-3 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Reputation:</span>
                    <span className={`font-bold ${data.reputation > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {data.reputation || 0}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* AbuseIPDB Score Gauge */}
            {name === 'Abuseipdb' && (
              <div className="flex flex-col items-center mb-4">
                <ScoreGauge 
                  score={data.abuse_confidence_score || 0}
                  maxScore={100}
                  label="Abuse Confidence"
                  thresholds={{ high: 75, medium: 25 }}
                />
                <div className="w-full mt-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Reports:</span>
                    <span className="text-white font-semibold">{data.total_reports || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Country:</span>
                    <span className="text-white font-semibold">{data.country_code || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* GreyNoise Classification Badge */}
            {name === 'Greynoise' && (
              <div className="mb-4">
                <div className={`text-center py-8 rounded-lg ${
                  data.classification === 'malicious' ? 'bg-red-900/30 border-2 border-red-500' :
                  data.classification === 'benign' ? 'bg-green-900/30 border-2 border-green-500' :
                  'bg-slate-800 border-2 border-slate-600'
                }`}>
                  <div className={`text-3xl font-bold mb-2 ${
                    data.classification === 'malicious' ? 'text-red-400' :
                    data.classification === 'benign' ? 'text-green-400' :
                    'text-slate-400'
                  }`}>
                    {String(data.classification || 'UNKNOWN').toUpperCase()}
                  </div>
                  <p className="text-xs text-slate-400 mb-3">Classification</p>
                  {data.name && (
                    <div className="text-sm text-white font-medium">{data.name}</div>
                  )}
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Internet Scanner:</span>
                    <span className={data.noise ? 'text-yellow-400' : 'text-green-400'}>
                      {data.noise ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">RIOT (Common Service):</span>
                    <span className={data.riot ? 'text-green-400' : 'text-slate-400'}>
                      {data.riot ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* URL Analysis - Special Display */}
            {name === 'Url_analysis' && (
              <div className="mb-4">
                <div className="mb-3">
                  <div className={`p-3 rounded-lg ${data.has_redirects ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-green-900/20 border border-green-500/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">Redirects:</span>
                      <span className={`font-bold text-sm ${data.has_redirects ? 'text-yellow-400' : 'text-green-400'}`}>
                        {data.has_redirects ? `${data.redirect_count} Redirect(s)` : 'No Redirects'}
                      </span>
                    </div>
                    {data.redirect_chain && data.redirect_chain.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {data.redirect_chain.map((redirect, idx) => (
                          <div key={idx} className="text-xs text-slate-300 flex items-center space-x-2">
                            <span className="text-yellow-400">→</span>
                            <span className="truncate">{redirect.url}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Extracted URLs:</span>
                    <span className="text-sm font-bold text-cyan-400">{data.extracted_urls_count || 0}</span>
                  </div>
                  {data.extracted_urls && data.extracted_urls.length > 0 && (
                    <div className="bg-slate-900 rounded-lg p-2 max-h-40 overflow-y-auto">
                      {data.extracted_urls.slice(0, 10).map((url, idx) => (
                        <div key={idx} className="text-xs text-slate-300 mb-1 truncate">
                          • {url}
                        </div>
                      ))}
                      {data.extracted_urls.length > 10 && (
                        <p className="text-xs text-slate-500 mt-1">... and {data.extracted_urls.length - 10} more</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-slate-400">
                  Status Code: <span className={`font-semibold ${data.status_code === 200 ? 'text-green-400' : 'text-yellow-400'}`}>{data.status_code}</span>
                </div>
              </div>
            )}

            {/* MXToolbox - Special Display */}
            {name === 'Mxtoolbox' && (
              <div className="mb-4">
                <div className={`p-3 rounded-lg ${
                  data.blacklist_status?.includes('Listed on') 
                    ? 'bg-red-900/20 border border-red-500/30' 
                    : 'bg-green-900/20 border border-green-500/30'
                }`}>
                  <div className="mb-2">
                    <span className="text-xs text-slate-400">Blacklist Status:</span>
                    <div className={`text-sm font-medium mt-1 ${
                      data.blacklist_status?.includes('Listed on') 
                        ? 'text-red-400' 
                        : 'text-green-400'
                    }`}>
                      {data.blacklist_status || 'Unknown'}
                    </div>
                  </div>
                  {data.mx_records && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <span className="text-xs text-slate-400">MX Records:</span>
                      <div className="text-xs text-slate-300 mt-1 break-all">
                        {data.mx_records}
                      </div>
                    </div>
                  )}
                </div>
                {data.note && (
                  <p className="text-xs text-slate-500 mt-2">ℹ️ {data.note}</p>
                )}
              </div>
            )}

            {/* Other Sources - Compact View */}
            {!['Virustotal', 'Abuseipdb', 'Greynoise', 'Url_analysis', 'Mxtoolbox'].includes(name) && (
              <div className="space-y-2 text-sm mb-3">
                {Object.entries(data).map(([key, value]) => {
                  if (value === null || value === undefined) return null;
                  
                  return (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-slate-400 capitalize text-xs">{key.replace(/_/g, ' ')}:</span>
                      <span className="font-medium text-white text-xs max-w-[180px] text-right break-all">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            
            {referralUrl && (
              <a 
                href={referralUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 mt-4 px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/50 rounded-lg text-sm text-cyan-400 hover:text-cyan-300 transition-all font-medium"
              >
                <span>View Full Report</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </>
        ) : (
          <div className="text-sm">
            <p className="text-red-400 mb-3">{error || 'No data available'}</p>
            {referralUrl && (
              <a 
                href={referralUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-all"
              >
                <span>Check on {name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" data-testid="results-container">
      {/* Visual Summary Dashboard */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-white">Analysis Results</h3>
          </div>
          <span className="px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-600/50">
            {results.results.length} IOC{results.results.length !== 1 ? 's' : ''} Analyzed
          </span>
        </div>
        
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {results.results.map((iocResult, idx) => {
            const vt = iocResult.sources?.virustotal?.data;
            const abuse = iocResult.sources?.abuseipdb?.data;
            const greynoise = iocResult.sources?.greynoise?.data;
            const otx = iocResult.sources?.otx?.data;
            
            return (
              <React.Fragment key={idx}>
                {vt && (
                  <StatCard 
                    icon={Shield} 
                    label="VT Malicious" 
                    value={vt.malicious || 0}
                    color={vt.malicious > 5 ? 'text-red-400' : vt.malicious > 0 ? 'text-yellow-400' : 'text-green-400'}
                  />
                )}
                {abuse && (
                  <StatCard 
                    icon={AlertTriangle} 
                    label="Abuse Score" 
                    value={`${abuse.abuse_confidence_score || 0}%`}
                    color={abuse.abuse_confidence_score > 75 ? 'text-red-400' : abuse.abuse_confidence_score > 25 ? 'text-yellow-400' : 'text-green-400'}
                  />
                )}
                {greynoise && (
                  <StatCard 
                    icon={Activity} 
                    label="GreyNoise" 
                    value={String(greynoise.classification || 'N/A').toUpperCase().slice(0, 3)}
                    color={greynoise.classification === 'malicious' ? 'text-red-400' : greynoise.classification === 'benign' ? 'text-green-400' : 'text-slate-400'}
                    subtext={greynoise.name}
                  />
                )}
                {otx && (
                  <StatCard 
                    icon={Info} 
                    label="OTX Pulses" 
                    value={otx.pulse_count || 0}
                    color={otx.pulse_count > 10 ? 'text-yellow-400' : 'text-blue-400'}
                  />
                )}
              </React.Fragment>
            );
          })}
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
                    <div className="space-y-1">
                      {threat.details.map((detail, i) => (
                        <p key={i} className="text-sm text-slate-300">• {detail}</p>
                      ))}
                    </div>
                  )}
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
