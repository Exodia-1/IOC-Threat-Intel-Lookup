import { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import ResultsDisplay from '../components/ResultsDisplay';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API}/ioc/history?page=${page}&per_page=20`);

      if (response.data.success) {
        setHistory(response.data.history);
        setTotalPages(response.data.total_pages);
        setTotal(response.data.total);
        setCurrentPage(page);
      } else {
        setError('Failed to load history');
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory(currentPage);
  }, []);

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

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const viewDetails = (item) => {
    setSelectedItem(item);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-medium mb-1">Error</h3>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setSelectedItem(null)}
            data-testid="back-to-history-btn"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to History
          </button>
        </div>
        <ResultsDisplay 
          results={{
            success: true,
            results: [selectedItem.results]
          }} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Lookup History</h2>
          <p className="text-slate-400">View your recent IOC investigations</p>
        </div>
        <button
          onClick={fetchHistory}
          data-testid="refresh-history-btn"
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900 rounded-lg border border-slate-800 p-12 text-center">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-400 mb-2">No History Yet</h3>
          <p className="text-slate-500">Start looking up IOCs to see your investigation history here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={item.id || index}
              data-testid={`history-item-${index}`}
              className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-cyan-600 transition-colors cursor-pointer"
              onClick={() => viewDetails(item)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.ioc_type)}`}>
                    {item.ioc_type.toUpperCase()}
                  </span>
                  <code className="text-slate-200 font-mono text-sm truncate flex-1">{item.ioc_value}</code>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <span className="text-sm text-slate-500">{formatTimestamp(item.timestamp)}</span>
                  <button
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                    data-testid={`view-details-${index}`}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
