import { motion } from 'motion/react';
import { Activity, AlertTriangle, Server, TrendingUp, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { kpiData, timeSeriesData, deviceStatusData, activityTimelineData } from '../utils/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function DashboardPage() {
  const kpiCards = [
    {
      title: 'Active Alerts',
      value: kpiData.activeAlerts,
      change: '+12%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Active Nodes',
      value: kpiData.activeNodes,
      change: '+5%',
      trend: 'up',
      icon: Server,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Risk Score',
      value: `${kpiData.riskScore}%`,
      change: '-8%',
      trend: 'down',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Total Events',
      value: kpiData.totalEvents.toLocaleString(),
      change: '+24%',
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
      
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time infrastructure monitoring overview</p>
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
                <Line type="monotone" dataKey="events" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="alerts" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="nodes" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
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
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Device Status</h3>
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
              {deviceStatusData.map((status) => (
                <div key={status.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span className="text-sm text-slate-600 dark:text-slate-400">{status.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">{status.value}</span>
                </div>
              ))}
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

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">System Health Metrics</h3>
            <div className="space-y-6">
              {[
                { label: 'CPU Usage', value: 67, color: 'bg-blue-500' },
                { label: 'Memory Usage', value: 78, color: 'bg-purple-500' },
                { label: 'Network I/O', value: 45, color: 'bg-green-500' },
                { label: 'Disk Usage', value: 56, color: 'bg-orange-500' },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">{metric.label}</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{metric.value}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full ${metric.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}