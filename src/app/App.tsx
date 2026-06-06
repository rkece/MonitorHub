import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { User as UserIcon, Database as DbIcon, Calendar, ShieldCheck, X } from 'lucide-react';
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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loginTime, setLoginTime] = useState('');
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
        setLoginTime(user.loginTime || new Date().toISOString());
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

    const nowStr = new Date().toISOString();
    setLoginTime(nowStr);

    // Save to localStorage
    const userData = {
      email,
      name,
      avatar: avatar || '',
      loginTime: nowStr
    };
    localStorage.setItem('monitorhub_user', JSON.stringify(userData));

    // Sync with MongoDB backend
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, avatar }),
      });
    } catch (error) {
      console.error('Failed to sync user with backend:', error);
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
          onNavigate={setCurrentPage}
          onOpenProfile={() => setShowProfileModal(true)}
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

      {/* Profile Modal Overlay & Dialog */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden z-10 text-slate-800 dark:text-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-bold text-lg font-display flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-500" />
                  Security Profile Details
                </h3>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-5">
                {/* User avatar circle */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-900">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-14 h-14 rounded-full border border-purple-500/20 object-cover" />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-md">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-base text-slate-900 dark:text-white">{userName || 'User'}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-ellipsis overflow-hidden max-w-[220px]">{userEmail}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-600 dark:text-purple-300 font-medium tracking-wide uppercase">
                      Portal Operator
                    </span>
                  </div>
                </div>

                {/* Session details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800/40">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <DbIcon className="w-4 h-4 text-purple-400" />
                      Database Sync
                    </span>
                    <span className="font-medium text-green-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      MongoDB Atlas Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-800/40">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      Access Credentials
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {userAvatar.startsWith('https://lh3.googleusercontent.com') ? 'Google OAuth' : 'Manual Credentials'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-1">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      Session Started
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                      {loginTime ? new Date(loginTime).toLocaleString() : new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  onClick={() => setShowProfileModal(false)}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                >
                  Close Profile
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}