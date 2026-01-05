import { motion } from 'motion/react';
import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { alertsData } from '../utils/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function AlertsPage() {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
          icon: XCircle,
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/10',
        };
      case 'warning':
        return {
          color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
          icon: AlertTriangle,
          borderColor: 'border-orange-500',
          bgColor: 'bg-orange-50 dark:bg-orange-900/10',
        };
      case 'info':
        return {
          color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
          icon: Info,
          borderColor: 'border-blue-500',
          bgColor: 'bg-blue-50 dark:bg-blue-900/10',
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-700',
          icon: Info,
          borderColor: 'border-slate-500',
          bgColor: 'bg-slate-50',
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'acknowledged':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const criticalAlerts = alertsData.filter((a) => a.severity === 'critical');
  const warningAlerts = alertsData.filter((a) => a.severity === 'warning');
  const infoAlerts = alertsData.filter((a) => a.severity === 'info');

  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs currentPage="alerts" />
      
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Event Alerts</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor and manage system alerts by severity</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Alert stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: alertsData.length, color: 'from-slate-500 to-slate-600', icon: AlertTriangle },
          { label: 'Critical', value: criticalAlerts.length, color: 'from-red-500 to-rose-600', icon: XCircle },
          { label: 'Warning', value: warningAlerts.length, color: 'from-orange-500 to-amber-600', icon: AlertTriangle },
          { label: 'Info', value: infoAlerts.length, color: 'from-blue-500 to-cyan-600', icon: Info },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* View mode tabs */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'timeline')} className="w-full">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {/* Alerts grouped by severity */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  Critical Alerts ({criticalAlerts.length})
                </h3>
                <div className="space-y-3">
                  {criticalAlerts.map((alert, index) => {
                    const config = getSeverityConfig(alert.severity);
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`border-l-4 ${config.borderColor} bg-white dark:bg-slate-900 hover:shadow-lg transition-all cursor-pointer`}
                          onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-2 ${config.bgColor} rounded-lg`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                                    <Badge className={config.color} variant="outline">
                                      {alert.severity}
                                    </Badge>
                                    <Badge className={getStatusColor(alert.status)} variant="outline">
                                      {alert.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{alert.device} • {alert.zone}</p>
                                  <p className="text-xs text-slate-500">{alert.timestamp}</p>
                                </div>
                              </div>
                              <motion.div
                                animate={{ rotate: expandedAlert === alert.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {expandedAlert === alert.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </motion.div>
                            </div>

                            {expandedAlert === alert.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                              >
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{alert.description}</p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    Acknowledge
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Resolve
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Warning Alerts */}
            {warningAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Warning Alerts ({warningAlerts.length})
                </h3>
                <div className="space-y-3">
                  {warningAlerts.map((alert, index) => {
                    const config = getSeverityConfig(alert.severity);
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`border-l-4 ${config.borderColor} bg-white dark:bg-slate-900 hover:shadow-lg transition-all cursor-pointer`}
                          onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-2 ${config.bgColor} rounded-lg`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                                    <Badge className={config.color} variant="outline">
                                      {alert.severity}
                                    </Badge>
                                    <Badge className={getStatusColor(alert.status)} variant="outline">
                                      {alert.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{alert.device} • {alert.zone}</p>
                                  <p className="text-xs text-slate-500">{alert.timestamp}</p>
                                </div>
                              </div>
                              <motion.div
                                animate={{ rotate: expandedAlert === alert.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {expandedAlert === alert.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </motion.div>
                            </div>

                            {expandedAlert === alert.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                              >
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{alert.description}</p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    Acknowledge
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Resolve
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Info Alerts */}
            {infoAlerts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  Info Alerts ({infoAlerts.length})
                </h3>
                <div className="space-y-3">
                  {infoAlerts.map((alert, index) => {
                    const config = getSeverityConfig(alert.severity);
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`border-l-4 ${config.borderColor} bg-white dark:bg-slate-900 hover:shadow-lg transition-all cursor-pointer`}
                          onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                        >
                          <div className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-2 ${config.bgColor} rounded-lg`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                                    <Badge className={config.color} variant="outline">
                                      {alert.severity}
                                    </Badge>
                                    <Badge className={getStatusColor(alert.status)} variant="outline">
                                      {alert.status}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{alert.device} • {alert.zone}</p>
                                  <p className="text-xs text-slate-500">{alert.timestamp}</p>
                                </div>
                              </div>
                              <motion.div
                                animate={{ rotate: expandedAlert === alert.id ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                {expandedAlert === alert.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </motion.div>
                            </div>

                            {expandedAlert === alert.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                              >
                                <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{alert.description}</p>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    Acknowledge
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Resolve
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    View Details
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-6">
                {alertsData.map((alert, index) => {
                  const config = getSeverityConfig(alert.severity);
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={alert.id}
                      className="relative flex gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className={`relative z-10 flex-shrink-0 w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                          <Badge className={config.color} variant="outline">
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{alert.description}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{alert.device} • {alert.zone}</p>
                        <p className="text-xs text-slate-500 mt-2">{alert.timestamp}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}