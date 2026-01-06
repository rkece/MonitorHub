import { useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Monitor, Palette, Layout, Settings as SettingsIcon, Bell, Shield, Download, Upload, Trash2, RotateCcw, Activity } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ScrollArea } from '../components/ui/scroll-area';
import { db } from '../utils/database';
import { toast } from 'sonner';

interface SettingsPageProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
}

type SettingsTab = 'appearance' | 'layout' | 'preferences' | 'notifications' | 'security' | 'data' | 'logs';

export function SettingsPage({ darkMode, onToggleDarkMode, accentColor, onAccentColorChange }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const categories = [
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'layout', icon: Layout, label: 'Layout' },
    { id: 'preferences', icon: SettingsIcon, label: 'Preferences' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'data', icon: Download, label: 'Data Management' },
    { id: 'logs', icon: Activity, label: 'Activity Logs' },
  ];

  const handleExportData = () => {
    const data = db.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monitorhub-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (db.importData(content)) {
        toast.success('Data imported successfully');
        window.location.reload();
      } else {
        toast.error('Failed to import data');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDevices = () => {
    if (confirm('Are you sure you want to reset all devices to default data?')) {
      db.resetDevices();
      toast.success('Devices reset to default data');
      window.location.reload();
    }
  };

  const handleResetAlerts = () => {
    if (confirm('Are you sure you want to reset all alerts to default data?')) {
      db.resetAlerts();
      toast.success('Alerts reset to default data');
      window.location.reload();
    }
  };

  const handleClearActivityLogs = () => {
    if (confirm('Are you sure you want to clear all activity logs?')) {
      db.clearActivityLogs();
      toast.success('Activity logs cleared');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Appearance</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Customize the look and feel</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Dark mode toggle */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-slate-900 dark:text-white">Theme Mode</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Switch between light and dark mode</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
                </div>

                {/* Theme preview cards */}
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      !darkMode
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => !darkMode || onToggleDarkMode()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold text-slate-900 dark:text-white">Light</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-slate-200 rounded" />
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                    </div>
                  </motion.div>

                  <motion.div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      darkMode
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                    onClick={() => darkMode || onToggleDarkMode()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="w-5 h-5 text-purple-500" />
                      <span className="font-semibold text-slate-900 dark:text-white">Dark</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-slate-700 rounded" />
                      <div className="h-4 bg-slate-800 rounded w-3/4" />
                      <div className="h-4 bg-slate-800 rounded w-1/2" />
                    </div>
                  </motion.div>
                </div>
              </div>

              <Separator />

              {/* Color accent */}
              <div>
                <Label className="text-slate-900 dark:text-white mb-3 block">Accent Color</Label>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Choose your preferred accent color</p>
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { name: 'purple', color: 'bg-purple-500', ringColor: 'ring-purple-500' },
                    { name: 'blue', color: 'bg-blue-500', ringColor: 'ring-blue-500' },
                    { name: 'green', color: 'bg-green-500', ringColor: 'ring-green-500' },
                    { name: 'orange', color: 'bg-orange-500', ringColor: 'ring-orange-500' },
                    { name: 'pink', color: 'bg-pink-500', ringColor: 'ring-pink-500' },
                    { name: 'red', color: 'bg-red-500', ringColor: 'ring-red-500' },
                  ].map((accent) => (
                    <motion.button
                      key={accent.name}
                      className={`w-12 h-12 rounded-lg ${accent.color} ${
                        accentColor === accent.color ? `ring-2 ring-offset-2 ${accent.ringColor} dark:ring-offset-slate-900` : ''
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      title={accent.name.charAt(0).toUpperCase() + accent.name.slice(1)}
                      onClick={() => {
                        onAccentColorChange(accent.color);
                        toast.success(`Accent color changed to ${accent.name}`);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );

      case 'layout':
        return (
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Layout Preferences</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Adjust the dashboard layout</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Density */}
              <div>
                <Label className="text-slate-900 dark:text-white mb-3 block">Layout Density</Label>
                <RadioGroup value={layoutDensity} onValueChange={setLayoutDensity}>
                  <div className="space-y-3">
                    {[
                      { value: 'compact', label: 'Compact', desc: 'More content, less spacing' },
                      { value: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing (recommended)' },
                      { value: 'spacious', label: 'Spacious', desc: 'More spacing, better readability' },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={() => {
                          setLayoutDensity(option.value);
                          toast.success(`Layout density set to ${option.label}`);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="cursor-pointer">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{option.label}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{option.desc}</p>
                            </div>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Sidebar */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-900 dark:text-white">Collapsed Sidebar</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Show only icons in sidebar</p>
                  </div>
                  <Switch 
                    checked={sidebarCollapsed} 
                    onCheckedChange={(checked) => {
                      setSidebarCollapsed(checked);
                      toast.info(checked ? 'Sidebar collapsed' : 'Sidebar expanded');
                    }} 
                  />
                </div>
              </div>
            </div>
          </Card>
        );

      case 'notifications':
        return (
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Notification Settings</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage how you receive alerts</p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { 
                  label: 'Email Notifications', 
                  desc: 'Receive alerts via email',
                  checked: emailNotifications,
                  onChange: setEmailNotifications
                },
                { 
                  label: 'Push Notifications', 
                  desc: 'Get browser push notifications',
                  checked: pushNotifications,
                  onChange: setPushNotifications
                },
                { 
                  label: 'Critical Alerts Only', 
                  desc: 'Only notify for critical issues',
                  checked: criticalAlerts,
                  onChange: setCriticalAlerts
                },
              ].map((setting) => (
                <div key={setting.label}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-900 dark:text-white">{setting.label}</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{setting.desc}</p>
                    </div>
                    <Switch 
                      checked={setting.checked} 
                      onCheckedChange={(checked) => {
                        setting.onChange(checked);
                        toast.success(`${setting.label} ${checked ? 'enabled' : 'disabled'}`);
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      case 'security':
        return (
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Security Settings</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Manage security preferences</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-slate-900 dark:text-white">Two-Factor Authentication</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security</p>
                  </div>
                  <Switch 
                    checked={twoFactorAuth} 
                    onCheckedChange={(checked) => {
                      setTwoFactorAuth(checked);
                      toast.success(`2FA ${checked ? 'enabled' : 'disabled'}`);
                    }} 
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Password change feature coming soon')}
                >
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Session management feature coming soon')}
                >
                  Manage Sessions
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    if (confirm('Are you sure you want to revoke all sessions?')) {
                      toast.success('All sessions revoked');
                    }
                  }}
                >
                  Revoke All Sessions
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'data':
        return (
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Data Management</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Export, import, and manage your data</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Export Data</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">Download all your monitoring data as JSON</p>
                <Button onClick={handleExportData} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Import Data</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">Upload a JSON file to restore data</p>
                <label htmlFor="import-file">
                  <Button variant="outline" className="gap-2 cursor-pointer" asChild>
                    <span>
                      <Upload className="w-4 h-4" />
                      Import Data
                    </span>
                  </Button>
                </label>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportData}
                />
              </div>

              <Separator />

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Reset Data</h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">Reset devices or alerts to default data</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleResetDevices} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset Devices
                  </Button>
                  <Button variant="outline" onClick={handleResetAlerts} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset Alerts
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Danger Zone</h4>
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">Irreversible actions</p>
                <Button variant="destructive" onClick={handleClearActivityLogs} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear Activity Logs
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'logs':
        return (
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-500/10 rounded-lg">
                <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Activity Logs</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">View and manage your activity logs</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">View Logs</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Check recent activities and actions</p>
                <Button variant="outline" className="gap-2">
                  <Activity className="w-4 h-4" />
                  View Logs
                </Button>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Download Logs</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Export your activity logs as a file</p>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download Logs
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return (
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <p className="text-slate-600 dark:text-slate-400">Select a settings category</p>
          </Card>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs currentPage="settings" />
      
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Customize your monitoring dashboard experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings navigation */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Settings Categories</h3>
            <div className="space-y-2">
              {categories.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as SettingsTab);
                      toast.info(`Switched to ${item.label}`);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Settings content */}
        <div className="lg:col-span-2">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}