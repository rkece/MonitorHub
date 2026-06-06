import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
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
 * - Real Google OAuth authentication
 * - Real-time monitoring dashboard with KPI cards and charts
 * - Device monitoring with filters, search, and expandable rows
 * - Event alerts grouped by severity with timeline view
 * - Analytics with risk trends, heatmaps, and insights
 * - Settings page with dark/light mode and customization options
 * - LocalStorage persistence with Supabase integration option
 * 
 * Built with React, Tailwind CSS, Shadcn UI, Motion (Framer Motion), and Recharts
 */

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || 'bg-purple-500';
  });
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState('');

  // Load user session from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('monitorhub_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserEmail(user.email);
        setUserName(user.name);
        setUserAvatar(user.avatar || '');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to load user session:', error);
      }
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save accent color
  useEffect(() => {
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const handleLogin = async (email: string, name: string, avatar?: string) => {
    setUserEmail(email);
    setUserName(name);
    setUserAvatar(avatar || '');
    setIsAuthenticated(true);

    // Save to localStorage
    const userData = {
      email,
      name,
      avatar: avatar || '',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('monitorhub_user', JSON.stringify(userData));

    // Sync with MongoDB backend
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, avatar }),
      });

      if (response.ok) {
        toast.success('Successfully connected to database');
      } else {
        throw new Error('Server responded with error');
      }
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
      toast.error('Local login successful, but failed to sync with database');
    }
  };


  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setUserEmail('');
    setUserName('');
    setUserAvatar('');

    // Clear localStorage
    localStorage.removeItem('monitorhub_user');
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
      <Toaster richColors position="top-right" />

      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <Navbar
          onLogout={handleLogout}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          userEmail={userEmail}
          userName={userName}
          userAvatar={userAvatar}
        />

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