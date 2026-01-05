import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { DevicesPage } from './pages/DevicesPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

/**
 * MonitorHub - Enterprise Monitoring Dashboard
 * 
 * A fully-designed, professional monitoring dashboard with:
 * - Glassmorphism login page with gradient animations
 * - Real-time monitoring dashboard with KPI cards and charts
 * - Device monitoring with filters, search, and expandable rows
 * - Event alerts grouped by severity with timeline view
 * - Analytics with risk trends, heatmaps, and insights
 * - Settings page with dark/light mode and customization options
 * 
 * Built with React, Tailwind CSS, Shadcn UI, Motion (Framer Motion), and Recharts
 * Frontend-only with mock data (no backend required)
 */

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('purple');

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
  };

  // Render login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Render page content based on current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'devices':
        return <DevicesPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} onToggleDarkMode={toggleDarkMode} accentColor={accentColor} onAccentColorChange={handleAccentColorChange} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <Navbar onLogout={handleLogout} darkMode={darkMode} onToggleDarkMode={toggleDarkMode} />

        {/* Page content with animation */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}