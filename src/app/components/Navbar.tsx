import { motion } from 'motion/react';
import { Bell, Search, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface NavbarProps {
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  userEmail: string;
  userName: string;
  userAvatar?: string;
  onNavigate?: (page: string) => void;
  onOpenProfile?: () => void;
}

export function Navbar({
  onLogout,
  darkMode,
  onToggleDarkMode,
  userEmail,
  userName,
  userAvatar,
  onNavigate,
  onOpenProfile,
}: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'High Substance Compliance Risk', message: 'Zone B Hostels - 92% Compliance Drop', time: '5 min ago', unread: true },
    { id: 2, title: 'Anonymous Alert Logged', message: 'Activity flagged at Zone A Restrooms', time: '45 min ago', unread: true },
    { id: 3, title: 'Compliance Report Generated', message: 'Weekly digital detox logs compiled', time: '2 hours ago', unread: false },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleNotificationClick = (id: number, title: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
    toast.info(`Viewing Alert: ${title}`);
    if (onNavigate) {
      onNavigate('alerts');
    }
    setShowNotifications(false);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  return (
    <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-40">
      
      {/* Search bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search zones, compliance index, alerts..."
            className="pl-9 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-9 rounded-lg"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Theme toggle */}
        <motion.button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Settings gear icon shortcut */}
        <motion.button
          onClick={() => onNavigate && onNavigate('settings')}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {/* Notifications Dropdown */}
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <motion.div
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
              )}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-sm">Alert logs</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.title)}
                  className={`p-3 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer border-b border-slate-100 dark:border-slate-800/40 last:border-b-0 transition-colors ${
                    notification.unread ? 'bg-purple-500/5 dark:bg-purple-500/10' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold">{notification.title}</p>
                        {notification.unread && <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{notification.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={() => {
                  if (onNavigate) onNavigate('alerts');
                  setShowNotifications(false);
                }}
              >
                View all active alerts
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white text-[11px]">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="text-left hidden md:block max-w-[120px]">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {userName || 'User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {userEmail || 'operator@monitorhub.com'}
                </p>
              </div>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onOpenProfile && onOpenProfile()}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate && onNavigate('settings')}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}