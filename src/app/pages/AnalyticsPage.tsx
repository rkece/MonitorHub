import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import { TrendingUp, TrendingDown, Activity, Shield, FileText, Download, Loader2, X } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { riskTrendData, zonePerformanceData, heatmapData } from '../utils/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function AnalyticsPage() {
  const [userCount, setUserCount] = useState<string>('...');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [reportText, setReportText] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (response.ok) {
          const users = await response.json();
          setUserCount(users.length.toLocaleString());
        } else {
          setUserCount('1,247'); // Fallback to mock
        }
      } catch (error) {
        setUserCount('1,247'); // Fallback to mock
      }
    };
    fetchUsers();
  }, []);

  const handleCompileReport = () => {
    setIsCompiling(true);
    setTimeout(() => {
      const generatedReport = `==================================================
MONITORHUB SUBSTANCE COMPLIANCE & SAFETY AUDIT
Generated: ${new Date().toLocaleString()}
Scope: Campus-wide Wellness & Active Zone Audits
==================================================

1. OVERALL PORTAL STATUS
--------------------------------------------------
- Active Zones: 5 Total
- Safety Rating: 91% (COMPLIANT)
- Active Critical Alerts: 2
- Sensor Health: 99.7% Operational Uptime

2. ACTIVE ZONE DETAILED METRICS
--------------------------------------------------
- Zone A Restrooms: online (92% safety rating, substance-sensor active)
- Zone B Hostels: online (88% safety rating, residential vapors-sensor active)
- Zone C Cafeteria: warning (79% safety rating, dip under threshold)
- Zone D Sports Complex: offline (0% safety rating, connection failure)
- Zone E Science Lab: online (95% safety rating, restricted hazmat sensors active)

3. COMPLIANCE VIOLATIONS TIMELINE (PAST 24H)
--------------------------------------------------
* Incident 1: Vapor Spike Anomaly flagged at Zone C Cafeteria
* Incident 2: Sensor Offline Flag at Zone D Sports Complex
* Incident 3: Safe threshold deviation at Zone C Cafeteria (resolved)

4. RECOMMENDED MITIGATION AUDIT ACTIONS
--------------------------------------------------
[ACTION REQUIRED] Schedule physical sensor inspection for Zone D Sports Complex immediately.
[ACTION REQUIRED] Inspect ventilation system calibration at Zone C Cafeteria to address safety dip.
[MONITOR] Recalibrate hazard vapor exhaust lines at Zone E Science Lab within 15 days.

==================================================
REPORT END • SECURED BY MONITORHUB PROTOCOLS
==================================================`;
      setReportText(generatedReport);
      setIsCompiling(false);
      setShowReportModal(true);
      toast.success('Compliance audit report compiled successfully!');
    }, 1500);
  };

  const downloadReport = () => {
    const element = document.createElement("a");
    const file = new Blob([reportText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `MonitorHub_Compliance_Report_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Compliance audit report file downloaded successfully!');
  };

  return (
    <div className="p-6 space-y-6 relative">
      <Breadcrumbs currentPage="analytics" />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Deep insights into system performance and trends</p>
        </div>
        <Button
          onClick={handleCompileReport}
          disabled={isCompiling}
          className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-5 rounded-xl shadow-md gap-2"
        >
          {isCompiling ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <FileText className="w-4.5 h-4.5" />
              Compile Compliance Report
            </>
          )}
        </Button>
      </div>

      {/* KPI comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg Response Time', value: '245ms', change: '-12%', trend: 'down', color: 'from-green-500 to-emerald-500' },
          { label: 'System Uptime', value: '99.7%', change: '+0.2%', trend: 'up', color: 'from-blue-500 to-cyan-500' },
          { label: 'Error Rate', value: '0.03%', change: '-45%', trend: 'down', color: 'from-purple-500 to-pink-500' },
          { label: 'Active Users', value: userCount, change: '+18%', trend: 'up', color: 'from-orange-500 to-amber-500' },
        ].map((kpi, index) => (

          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{kpi.value}</h3>
              <div className="flex items-center gap-2">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">{kpi.change}</span>
                <span className="text-xs text-slate-500">vs last period</span>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.color}`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Risk trend chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Risk Score Trend</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Weekly risk analysis with incident correlation</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <Activity className="w-3 h-3" />
              Live Data
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={riskTrendData}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="risk" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
              <Area type="monotone" dataKey="incidents" stroke="#ef4444" fillOpacity={1} fill="url(#colorIncidents)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Zone performance comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Zone Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={zonePerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="zone" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="uptime" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="avgCpu" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="avgMemory" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Heatmap and insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Weekly Activity Heatmap</h3>
            <div className="space-y-3">
              {heatmapData.map((row, index) => (
                <div key={row.hour} className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400 w-12">{row.hour}</span>
                  <div className="flex-1 grid grid-cols-7 gap-1">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                      const value = row[day as keyof typeof row] as number;
                      const intensity = Math.min(value / 70, 1);
                      return (
                        <motion.div
                          key={day}
                          className="h-8 rounded"
                          style={{
                            backgroundColor: `rgba(139, 92, 246, ${intensity})`,
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          title={`${day}: ${value} events`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Key insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Key Insights</h3>
            <div className="space-y-4">
              {[
                {
                  icon: Shield,
                  title: 'Security Score Improved',
                  description: 'Overall security posture increased by 15% this week',
                  color: 'bg-green-500/10 text-green-600',
                  trend: 'positive',
                },
                {
                  icon: Activity,
                  title: 'Peak Traffic Hours',
                  description: 'Highest activity detected between 12:00-16:00 on weekdays',
                  color: 'bg-blue-500/10 text-blue-600',
                  trend: 'neutral',
                },
                {
                  icon: TrendingUp,
                  title: 'Resource Optimization',
                  description: 'CPU usage optimized by 12% through load balancing',
                  color: 'bg-purple-500/10 text-purple-600',
                  trend: 'positive',
                },
                {
                  icon: TrendingDown,
                  title: 'Alert Frequency',
                  description: 'Critical alerts decreased by 34% compared to last month',
                  color: 'bg-orange-500/10 text-orange-600',
                  trend: 'positive',
                },
              ].map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={insight.title}
                    className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className={`p-2 ${insight.color} rounded-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{insight.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{insight.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Zone details table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Zone Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Zone</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Uptime</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Avg CPU</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Avg Memory</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Devices</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {zonePerformanceData.map((zone, index) => (
                  <motion.tr
                    key={zone.zone}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                  >
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{zone.zone}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 w-20">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${zone.uptime}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{zone.uptime}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{zone.avgCpu}%</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{zone.avgMemory}%</td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{zone.devices}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Healthy
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Compliance Report Generation Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden z-10 text-slate-800 dark:text-slate-100 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-lg font-display flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Compliance & Safety Audit Report Preview
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Report Content */}
              <div className="flex-1 overflow-y-auto mb-6 bg-slate-950 dark:bg-black rounded-xl p-4 border border-slate-800 shadow-inner font-mono text-xs text-slate-300 leading-relaxed max-h-[50vh]">
                <pre className="whitespace-pre-wrap">{reportText}</pre>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                <Button
                  onClick={() => setShowReportModal(false)}
                  variant="outline"
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={downloadReport}
                  className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export as Plain Text (.txt)
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}