import { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LookupPage from './pages/LookupPage';
import HistoryPage from './pages/HistoryPage';
import { Shield, Search, History, Activity } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-xl font-bold text-white">IOC Threat Intel Lookup</h1>
              <p className="text-xs text-slate-400">Multi-Source Investigation Tool</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              data-testid="nav-lookup"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Lookup</span>
            </Link>
            
            <Link
              to="/history"
              data-testid="nav-history"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/history') 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-slate-950">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<LookupPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
