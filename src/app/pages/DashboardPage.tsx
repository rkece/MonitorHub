import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Server, TrendingUp, ArrowUp, ArrowDown, Clock, RefreshCw, Terminal, Sliders, RotateCcw, AlertOctagon } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { timeSeriesData, deviceStatusData } from '../utils/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { db } from '../utils/database';
import { toast } from 'sonner';

export function DashboardPage() {
  const [devices, setDevices] = useState(db.getDevices());
  const [alerts, setAlerts] = useState(db.getAlerts());
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  const [activeControlTab, setActiveControlTab] = useState<'compliance' | 'terminal' | 'simulator'>('compliance');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [SYSTEM] Substance prevention framework initialized.`,
    `[${new Date().toLocaleTimeString()}] [HEARTBEAT] Connection check: all active campus zones reporting online.`,
    `[${new Date().toLocaleTimeString()}] [INFO] Air quality metrics within target compliance scores.`
  ]);

  // Generate simulated real-time logs inside the terminal tab
  useEffect(() => {
    const logTemplates = [
      () => `[HEARTBEAT] Zone A Restrooms sensor self-check: COMPLIANT (Safety: ${Math.floor(Math.random() * 8) + 91}%)`,
      () => `[INFO] Zone B Hostels: Air quality status normal. No chemical anomalies detected.`,
      () => `[HEARTBEAT] Zone C Cafeteria compliance sync online. Active zone rating: ${Math.floor(Math.random() * 5) + 85}%`,
      () => `[INFO] Zone E Science Lab hazardous vapors extractor operational (status: standard)`,
      () => `[SYSTEM] Local database synchronization check: SUCCESS.`,
      () => `[HEARTBEAT] Active substance prevention shield integrity: 99.8% nominal.`
    ];

    const interval = setInterval(() => {
      const randomTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)];
      const logLine = `[${new Date().toLocaleTimeString()}] ${randomTemplate()}`;
      setTerminalLogs(prev => [logLine, ...prev.slice(0, 10)]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const refreshData = () => {
    setDevices(db.getDevices());
    setAlerts(db.getAlerts());
    setLastRefresh(new Date());
    toast.success('Dashboard refreshed');
  };

  const handleSimulateCritical = () => {
    db.addAlert({
      title: 'Aerosol Vapor Spike',
      message: 'CRITICAL: High concentration of aerosol chemical vapor detected in Zone A Restrooms restroom sensor.',
      severity: 'critical',
      deviceId: '1',
      deviceName: 'Zone A Restrooms',
      timestamp: new Date().toISOString(),
      acknowledged: false
    });
    // Dip compliance index of device 1
    db.updateDevice('1', { memory: 42 });
    refreshData();
    
    // Add warning log to terminal
    const warningLog = `[${new Date().toLocaleTimeString()}] [CRITICAL] Sensor anomaly flagged in Zone A Restrooms. URGENT ESCALATION active.`;
    setTerminalLogs(prev => [warningLog, ...prev]);
    toast.error('Simulation: Critical substance vapor hazard triggered in Zone A!');
  };

  const handleSimulateWarning = () => {
    db.addAlert({
      title: 'Substance Compliance Deviation',
      message: 'WARNING: Zone E Science Lab compliance rating dropped below threshold to 72% due to chemical ventilation blockage.',
      severity: 'warning',
      deviceId: '5',
      deviceName: 'Zone E Science Lab',
      timestamp: new Date().toISOString(),
      acknowledged: false
    });
    // Update device memory (safety rating)
    db.updateDevice('5', { memory: 72 });
    refreshData();
    
    const warningLog = `[${new Date().toLocaleTimeString()}] [WARNING] Calibration deviation flagged at Zone E Science Lab.`;
    setTerminalLogs(prev => [warningLog, ...prev]);
    toast.warning('Simulation: Warning alert triggered in Zone E!');
  };

  const handleResetDefaults = () => {
    db.resetDevices();
    db.resetAlerts();
    refreshData();
    toast.success('Simulation: All zones reset to standard baseline safety parameters.');
  };

  // Calculate KPIs from real data
  const activeAlerts = alerts.filter(a => !a.resolvedAt).length;
  const activeNodes = devices.filter(d => d.status === 'online').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.resolvedAt).length;
  const riskScore = Math.round((criticalAlerts / Math.max(alerts.length, 1)) * 100);

  // Activity timeline data - generate from recent alerts and devices
  const activityTimelineData = [
    ...alerts.slice(0, 3).map(alert => ({
      event: alert.title,
      device: alert.deviceName || 'System',
      time: new Date(alert.timestamp).toLocaleTimeString(),
      type: alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info'
    })),
    ...devices.slice(0, 2).map(device => ({
      event: `Device ${device.status === 'online' ? 'connected' : device.status === 'offline' ? 'disconnected' : 'warning'}`,
      device: device.name,
      time: 'Recently',
      type: device.status === 'online' ? 'success' : device.status === 'offline' ? 'error' : 'warning'
    }))
  ].slice(0, 5);

  const kpiCards = [
    {
      title: 'Active Alerts',
      value: activeAlerts,
      change: `${criticalAlerts} critical`,
      trend: criticalAlerts > 0 ? 'up' : 'down',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Active Zones',
      value: activeNodes,
      change: `${devices.length} total`,
      trend: activeNodes > devices.length / 2 ? 'up' : 'down',
      icon: Server,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Risk Score',
      value: `${riskScore}%`,
      change: riskScore > 50 ? 'High risk' : 'Low risk',
      trend: riskScore > 50 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Total Events',
      value: alerts.length,
      change: `Updated ${lastRefresh.toLocaleTimeString()}`,
      trend: 'up',
      icon: Activity,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs currentPage="dashboard" />
      
      {/* Page header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Real-time monitoring and system insights • Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={refreshData} 
          className="gap-2 bg-purple-500 hover:bg-purple-600"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Dashboard
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div whileHover={{ y: -4, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} transition={{ duration: 0.2 }}>
                <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 overflow-hidden relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{card.title}</p>
                      <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{card.value}</h3>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={card.trend === 'up' ? 'default' : 'secondary'}
                          className={card.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                        >
                          {card.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                          {card.change}
                        </Badge>
                        <span className="text-xs text-slate-500">vs last week</span>
                      </div>
                    </div>
                    <div className={`p-3 ${card.bgColor} rounded-xl`}>
                      <Icon className={`w-6 h-6 ${card.textColor}`} />
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`} />
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Over Time */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Events & Alerts Timeline</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Last 24 hours</p>
              </div>
              <Badge variant="outline">Live</Badge>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="events" name="Total Incidents" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="alerts" name="Active Alerts" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="nodes" name="Compliance Index" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Device Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6 font-display">Zone Compliance Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {deviceStatusData.map((status) => {
                const displayName = status.name === 'Online' ? 'Compliant' : status.name === 'Warning' ? 'Needs Inspection' : status.name === 'Offline' ? 'High Risk' : status.name;
                return (
                  <div key={status.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{displayName}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{status.value}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity Timeline & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-4">
              {activityTimelineData.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:border-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'success'
                        ? 'bg-green-500'
                        : activity.type === 'warning'
                        ? 'bg-orange-500'
                        : activity.type === 'error'
                        ? 'bg-red-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 dark:text-white font-medium">{activity.event}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{activity.device}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Advanced built-in control tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-[350px]">
            {/* Header with Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="font-semibold text-slate-900 dark:text-white font-display">Prevention Command Center</h3>
              <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800/80 p-0.5 border border-slate-200/50 dark:border-slate-800">
                <button
                  onClick={() => setActiveControlTab('compliance')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
                    activeControlTab === 'compliance'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Safety Indices
                </button>
                <button
                  onClick={() => setActiveControlTab('terminal')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1 ${
                    activeControlTab === 'terminal'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  Live Log
                </button>
                <button
                  onClick={() => setActiveControlTab('simulator')}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all flex items-center gap-1 ${
                    activeControlTab === 'simulator'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  Simulator
                </button>
              </div>
            </div>

            {/* Tab Body Content */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {activeControlTab === 'compliance' && (
                  <motion.div
                    key="compliance"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-5 w-full"
                  >
                    {[
                      { label: 'Overall Compliance Index', value: 88, color: 'bg-green-500' },
                      { label: 'Alert Acknowledged Rate', value: 94, color: 'bg-purple-500' },
                      { label: 'Sensor Calibration Status', value: 85, color: 'bg-blue-500' },
                      { label: 'Database Sync Integrity', value: 100, color: 'bg-emerald-500' },
                    ].map((metric, index) => (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{metric.label}</span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">{metric.value}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <motion.div
                            className={`h-full ${metric.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 0.8, delay: index * 0.05 }}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeControlTab === 'terminal' && (
                  <motion.div
                    key="terminal"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="w-full flex-1 flex flex-col"
                  >
                    <div className="w-full bg-slate-950 dark:bg-black rounded-xl p-4 border border-slate-800 shadow-inner font-mono text-[10px] text-green-400 min-h-[190px] max-h-[220px] overflow-y-auto space-y-1.5 flex flex-col-reverse justify-start">
                      {terminalLogs.map((log, index) => (
                        <div
                          key={index}
                          className={`leading-relaxed tracking-wide ${
                            log.includes('[CRITICAL]')
                              ? 'text-red-400 font-bold'
                              : log.includes('[WARNING]')
                              ? 'text-amber-400'
                              : log.includes('[SYSTEM]')
                              ? 'text-purple-400'
                              : 'text-green-400/90'
                          }`}
                        >
                          <span className="text-slate-600 mr-1.5">$</span>
                          {log}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeControlTab === 'simulator' && (
                  <motion.div
                    key="simulator"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-4 w-full"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
                      Inject mock events to verify automated active zone status changes and telemetry metrics.
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        onClick={handleSimulateCritical}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-xl h-11 text-xs justify-start px-3.5 gap-2"
                      >
                        <AlertOctagon className="w-4 h-4" />
                        Simulate Critical
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSimulateWarning}
                        className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded-xl h-11 text-xs justify-start px-3.5 gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Simulate Warning
                      </Button>
                    </div>

                    <Button
                      type="button"
                      onClick={handleResetDefaults}
                      className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl h-10 text-xs border border-slate-200/50 dark:border-slate-700/50 gap-2 mt-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restore Base Settings
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}