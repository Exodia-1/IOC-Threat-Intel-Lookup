import { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import LookupPage from './pages/LookupPage';
import EmailAnalysisPage from './pages/EmailAnalysisPage';
import FileAnalysisPage from './pages/FileAnalysisPage';
import { Shield, Search, Mail, FileText } from 'lucide-react';

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
              <span>IOC Lookup</span>
            </Link>
            
            <Link
              to="/email"
              data-testid="nav-email"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/email') 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </Link>
            
            <Link
              to="/file"
              data-testid="nav-file"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/file') 
                  ? 'bg-cyan-600 text-white' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>File</span>
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
          <Route path="/email" element={<EmailAnalysisPage />} />
          <Route path="/file" element={<FileAnalysisPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
