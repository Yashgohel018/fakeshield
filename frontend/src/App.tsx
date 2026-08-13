import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VideoCallPage } from './pages/VideoCallPage';
import { BenchmarkPage } from './pages/BenchmarkPage';
import { PrivacyPage } from './pages/PrivacyPage';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* Persistent Global Header Navigation */}
        <Header />

        {/* Dedicated Route Views */}
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/detection" element={<DashboardPage />} />
            <Route path="/videocall" element={<VideoCallPage />} />
            <Route path="/benchmarks" element={<BenchmarkPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            {/* Catch-all redirect to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

      </div>
    </HashRouter>
  );
};

export default App;
