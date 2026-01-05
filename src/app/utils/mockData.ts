// Mock data for the monitoring dashboard
// This data simulates a real monitoring system with devices, alerts, metrics, etc.
// In a production environment, this would be replaced with real API calls

export const kpiData = {
  activeAlerts: 23,
  activeNodes: 142,
  riskScore: 67,
  totalEvents: 8945,
};

export const timeSeriesData = [
  { time: '00:00', events: 45, alerts: 5, nodes: 138 },
  { time: '04:00', events: 32, alerts: 3, nodes: 140 },
  { time: '08:00', events: 78, alerts: 12, nodes: 142 },
  { time: '12:00', events: 95, alerts: 8, nodes: 141 },
  { time: '16:00', events: 67, alerts: 15, nodes: 142 },
  { time: '20:00', events: 54, alerts: 7, nodes: 140 },
];

export const deviceStatusData = [
  { name: 'Active', value: 112, color: '#10b981' },
  { name: 'Warning', value: 18, color: '#f59e0b' },
  { name: 'Offline', value: 12, color: '#ef4444' },
];

export const devicesData = [
  { id: 'DEV-001', name: 'Gateway Server 1', zone: 'North DC', status: 'Active', cpu: 45, memory: 62, uptime: '99.9%', lastSeen: '2 min ago' },
  { id: 'DEV-002', name: 'Database Primary', zone: 'Central DC', status: 'Active', cpu: 78, memory: 84, uptime: '99.8%', lastSeen: '1 min ago' },
  { id: 'DEV-003', name: 'Load Balancer 1', zone: 'North DC', status: 'Warning', cpu: 92, memory: 76, uptime: '99.5%', lastSeen: '5 min ago' },
  { id: 'DEV-004', name: 'Web Server 3', zone: 'South DC', status: 'Active', cpu: 34, memory: 48, uptime: '99.9%', lastSeen: '1 min ago' },
  { id: 'DEV-005', name: 'Cache Server', zone: 'Central DC', status: 'Offline', cpu: 0, memory: 0, uptime: '97.2%', lastSeen: '45 min ago' },
  { id: 'DEV-006', name: 'API Gateway', zone: 'North DC', status: 'Active', cpu: 56, memory: 68, uptime: '99.7%', lastSeen: '3 min ago' },
  { id: 'DEV-007', name: 'Message Queue', zone: 'South DC', status: 'Warning', cpu: 88, memory: 91, uptime: '99.3%', lastSeen: '7 min ago' },
  { id: 'DEV-008', name: 'Analytics Node', zone: 'Central DC', status: 'Active', cpu: 67, memory: 72, uptime: '99.6%', lastSeen: '2 min ago' },
  { id: 'DEV-009', name: 'Storage Node 1', zone: 'North DC', status: 'Active', cpu: 23, memory: 85, uptime: '99.9%', lastSeen: '4 min ago' },
  { id: 'DEV-010', name: 'Backup Server', zone: 'South DC', status: 'Active', cpu: 12, memory: 34, uptime: '99.8%', lastSeen: '6 min ago' },
];

export const alertsData = [
  {
    id: 'ALR-001',
    severity: 'critical',
    title: 'High CPU Usage Detected',
    device: 'Load Balancer 1',
    zone: 'North DC',
    timestamp: '5 minutes ago',
    description: 'CPU usage exceeded 90% threshold for more than 5 minutes.',
    status: 'open',
  },
  {
    id: 'ALR-002',
    severity: 'warning',
    title: 'Memory Usage Alert',
    device: 'Message Queue',
    zone: 'South DC',
    timestamp: '12 minutes ago',
    description: 'Memory usage reached 91%, approaching critical threshold.',
    status: 'open',
  },
  {
    id: 'ALR-003',
    severity: 'critical',
    title: 'Device Offline',
    device: 'Cache Server',
    zone: 'Central DC',
    timestamp: '45 minutes ago',
    description: 'Device has not responded to health checks for 30+ minutes.',
    status: 'acknowledged',
  },
  {
    id: 'ALR-004',
    severity: 'info',
    title: 'System Update Available',
    device: 'Gateway Server 1',
    zone: 'North DC',
    timestamp: '2 hours ago',
    description: 'New security patches are available for installation.',
    status: 'resolved',
  },
  {
    id: 'ALR-005',
    severity: 'warning',
    title: 'Disk Space Low',
    device: 'Database Primary',
    zone: 'Central DC',
    timestamp: '3 hours ago',
    description: 'Available disk space below 20% on primary volume.',
    status: 'open',
  },
  {
    id: 'ALR-006',
    severity: 'critical',
    title: 'Network Latency Spike',
    device: 'API Gateway',
    zone: 'North DC',
    timestamp: '4 hours ago',
    description: 'Response time exceeded 2000ms threshold.',
    status: 'acknowledged',
  },
];

export const activityTimelineData = [
  { time: '2 min ago', event: 'Health check completed', type: 'success', device: 'Gateway Server 1' },
  { time: '5 min ago', event: 'CPU threshold exceeded', type: 'warning', device: 'Load Balancer 1' },
  { time: '8 min ago', event: 'Backup completed successfully', type: 'success', device: 'Backup Server' },
  { time: '12 min ago', event: 'Memory usage alert triggered', type: 'warning', device: 'Message Queue' },
  { time: '45 min ago', event: 'Device went offline', type: 'error', device: 'Cache Server' },
  { time: '1 hour ago', event: 'New device registered', type: 'info', device: 'Storage Node 2' },
];

export const riskTrendData = [
  { date: 'Jan 1', risk: 45, incidents: 12 },
  { date: 'Jan 2', risk: 52, incidents: 18 },
  { date: 'Jan 3', risk: 48, incidents: 14 },
  { date: 'Jan 4', risk: 67, incidents: 23 },
  { date: 'Jan 5', risk: 71, incidents: 28 },
  { date: 'Jan 6', risk: 63, incidents: 19 },
  { date: 'Jan 7', risk: 58, incidents: 16 },
];

export const zonePerformanceData = [
  { zone: 'North DC', uptime: 99.7, avgCpu: 58, avgMemory: 65, devices: 48 },
  { zone: 'Central DC', uptime: 99.2, avgCpu: 62, avgMemory: 71, devices: 52 },
  { zone: 'South DC', uptime: 99.5, avgCpu: 54, avgMemory: 59, devices: 42 },
];

export const heatmapData = [
  { hour: '00:00', monday: 12, tuesday: 15, wednesday: 10, thursday: 8, friday: 14, saturday: 5, sunday: 3 },
  { hour: '04:00', monday: 8, tuesday: 10, wednesday: 7, thursday: 6, friday: 9, saturday: 3, sunday: 2 },
  { hour: '08:00', monday: 45, tuesday: 48, wednesday: 52, thursday: 47, friday: 50, saturday: 15, sunday: 12 },
  { hour: '12:00', monday: 62, tuesday: 65, wednesday: 58, thursday: 63, friday: 67, saturday: 28, sunday: 22 },
  { hour: '16:00', monday: 58, tuesday: 61, wednesday: 55, thursday: 59, friday: 64, saturday: 32, sunday: 28 },
  { hour: '20:00', monday: 35, tuesday: 38, wednesday: 32, thursday: 36, friday: 42, saturday: 25, sunday: 20 },
];