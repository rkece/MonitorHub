import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, Info, XCircle, ChevronDown, ChevronUp, Filter, 
  Plus, Check, X, Trash2, Clock, AlertCircle 
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { db, type Alert } from '../utils/database';
import { toast } from 'sonner';

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    severity: 'warning' as Alert['severity'],
    deviceName: '',
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    setAlerts(db.getAlerts());
  };

  const handleAddAlert = () => {
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    db.addAlert({
      ...formData,
      timestamp: new Date().toISOString(),
      acknowledged: false,
    });

    setAlerts(db.getAlerts());
    setIsAddDialogOpen(false);
    setFormData({
      title: '',
      message: '',
      severity: 'warning',
      deviceName: '',
    });
    toast.success('Alert created successfully');
  };

  const handleAcknowledge = (alertId: string) => {
    db.acknowledgeAlert(alertId);
    setAlerts(db.getAlerts());
  };

  const handleResolve = (alertId: string) => {
    db.resolveAlert(alertId);
    setAlerts(db.getAlerts());
  };

  const handleDelete = (alert: Alert) => {
    if (confirm(`Are you sure you want to delete this alert?`)) {
      db.deleteAlert(alert.id);
      setAlerts(db.getAlerts());
      toast.success('Alert deleted');
    }
  };

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

  const criticalAlerts = alerts.filter((a) => a.severity === 'critical');
  const warningAlerts = alerts.filter((a) => a.severity === 'warning');
  const infoAlerts = alerts.filter((a) => a.severity === 'info');
  const unresolvedAlerts = alerts.filter(a => !a.resolvedAt);

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} min ago`;
    return 'Just now';
  };

  const renderAlert = (alert: Alert) => {
    const config = getSeverityConfig(alert.severity);
    const Icon = config.icon;
    const isExpanded = expandedAlert === alert.id;

    return (
      <motion.div
        key={alert.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-4"
      >
        <Card className={`border-l-4 ${config.borderColor} ${config.bgColor} border-slate-200 dark:border-slate-800 overflow-hidden`}>
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-lg ${config.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h3>
                      {alert.acknowledged && (
                        <Badge variant="outline" className="text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Acknowledged
                        </Badge>
                      )}
                      {alert.resolvedAt && (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  {alert.deviceName && (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {alert.deviceName}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(alert.timestamp)}
                  </span>
                  <Badge className={config.color}>{alert.severity}</Badge>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Alert ID</p>
                        <p className="text-sm font-mono text-slate-900 dark:text-white">{alert.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Timestamp</p>
                        <p className="text-sm text-slate-900 dark:text-white">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {alert.resolvedAt && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Resolved At</p>
                          <p className="text-sm text-slate-900 dark:text-white">
                            {new Date(alert.resolvedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!alert.acknowledged && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Acknowledge
                        </Button>
                      )}
                      {!alert.resolvedAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResolve(alert.id)}
                          className="gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Resolved
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(alert)}
                        className="gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

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
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={loadAlerts}
          >
            <Filter className="w-4 h-4" />
            Refresh
          </Button>
          <Button 
            className="gap-2 bg-purple-500 hover:bg-purple-600"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Alerts', value: alerts.length, color: 'from-purple-500 to-pink-500', icon: AlertCircle },
          { label: 'Critical', value: criticalAlerts.length, color: 'from-red-500 to-rose-500', icon: XCircle },
          { label: 'Warning', value: warningAlerts.length, color: 'from-orange-500 to-amber-500', icon: AlertTriangle },
          { label: 'Unresolved', value: unresolvedAlerts.length, color: 'from-blue-500 to-cyan-500', icon: Clock },
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} opacity-10`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Alerts grouped by severity */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'list' | 'timeline')} className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">By Severity</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* Critical Alerts */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Critical Alerts
              </h2>
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30">{criticalAlerts.length}</Badge>
            </div>
            <AnimatePresence>
              {criticalAlerts.length > 0 ? (
                criticalAlerts.map(renderAlert)
              ) : (
                <Card className="p-8 text-center bg-white dark:bg-slate-900">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-slate-400">No critical alerts</p>
                </Card>
              )}
            </AnimatePresence>
          </div>

          {/* Warning Alerts */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Warning Alerts
              </h2>
              <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30">{warningAlerts.length}</Badge>
            </div>
            <AnimatePresence>
              {warningAlerts.length > 0 ? (
                warningAlerts.map(renderAlert)
              ) : (
                <Card className="p-8 text-center bg-white dark:bg-slate-900">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-slate-400">No warning alerts</p>
                </Card>
              )}
            </AnimatePresence>
          </div>

          {/* Info Alerts */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Info Alerts
              </h2>
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30">{infoAlerts.length}</Badge>
            </div>
            <AnimatePresence>
              {infoAlerts.length > 0 ? (
                infoAlerts.map(renderAlert)
              ) : (
                <Card className="p-8 text-center bg-white dark:bg-slate-900">
                  <Info className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <p className="text-slate-600 dark:text-slate-400">No info alerts</p>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <AnimatePresence>
            {alerts.map(renderAlert)}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      {/* Add Alert Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Alert</DialogTitle>
            <DialogDescription>
              Create a new alert for monitoring purposes
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="High CPU Usage Detected"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Detailed description of the alert..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select 
                value={formData.severity} 
                onValueChange={(value) => setFormData({ ...formData, severity: value as Alert['severity'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="device">Device Name (Optional)</Label>
              <Input
                id="device"
                value={formData.deviceName}
                onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                placeholder="Load Balancer 1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAlert} className="bg-purple-500 hover:bg-purple-600">
              Create Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
