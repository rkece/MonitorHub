/**
 * LocalStorage Database Layer for MonitorHub
 * Provides CRUD operations for all entities
 */

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  location: string;
  ipAddress: string;
  cpu: number;
  memory: number;
  uptime: string;
  lastSeen: string;
  tags: string[];
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  deviceId?: string;
  deviceName?: string;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
}

// Database class
class Database {
  private getFromStorage<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  private saveToStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  // Devices
  getDevices(): Device[] {
    return this.getFromStorage('monitorhub_devices', this.getDefaultDevices());
  }

  getDevice(id: string): Device | undefined {
    return this.getDevices().find(d => d.id === id);
  }

  addDevice(device: Omit<Device, 'id'>): Device {
    const devices = this.getDevices();
    const newDevice = { ...device, id: this.generateId() };
    devices.push(newDevice);
    this.saveToStorage('monitorhub_devices', devices);
    this.logActivity('add_device', `Added device: ${newDevice.name}`);
    return newDevice;
  }

  updateDevice(id: string, updates: Partial<Device>): Device | null {
    const devices = this.getDevices();
    const index = devices.findIndex(d => d.id === id);
    if (index === -1) return null;
    
    devices[index] = { ...devices[index], ...updates };
    this.saveToStorage('monitorhub_devices', devices);
    this.logActivity('update_device', `Updated device: ${devices[index].name}`);
    return devices[index];
  }

  deleteDevice(id: string): boolean {
    const devices = this.getDevices();
    const device = devices.find(d => d.id === id);
    if (!device) return false;
    
    const filtered = devices.filter(d => d.id !== id);
    this.saveToStorage('monitorhub_devices', filtered);
    this.logActivity('delete_device', `Deleted device: ${device.name}`);
    return true;
  }

  // Alerts
  getAlerts(): Alert[] {
    return this.getFromStorage('monitorhub_alerts', this.getDefaultAlerts());
  }

  getAlert(id: string): Alert | undefined {
    return this.getAlerts().find(a => a.id === id);
  }

  addAlert(alert: Omit<Alert, 'id'>): Alert {
    const alerts = this.getAlerts();
    const newAlert = { ...alert, id: this.generateId() };
    alerts.unshift(newAlert); // Add to beginning
    this.saveToStorage('monitorhub_alerts', alerts);
    this.logActivity('add_alert', `Created alert: ${newAlert.title}`);
    return newAlert;
  }

  updateAlert(id: string, updates: Partial<Alert>): Alert | null {
    const alerts = this.getAlerts();
    const index = alerts.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    alerts[index] = { ...alerts[index], ...updates };
    this.saveToStorage('monitorhub_alerts', alerts);
    return alerts[index];
  }

  acknowledgeAlert(id: string): boolean {
    const alert = this.updateAlert(id, { acknowledged: true });
    if (alert) {
      this.logActivity('acknowledge_alert', `Acknowledged alert: ${alert.title}`);
      return true;
    }
    return false;
  }

  resolveAlert(id: string): boolean {
    const alert = this.updateAlert(id, { 
      acknowledged: true, 
      resolvedAt: new Date().toISOString() 
    });
    if (alert) {
      this.logActivity('resolve_alert', `Resolved alert: ${alert.title}`);
      return true;
    }
    return false;
  }

  deleteAlert(id: string): boolean {
    const alerts = this.getAlerts();
    const alert = alerts.find(a => a.id === id);
    if (!alert) return false;
    
    const filtered = alerts.filter(a => a.id !== id);
    this.saveToStorage('monitorhub_alerts', filtered);
    this.logActivity('delete_alert', `Deleted alert: ${alert.title}`);
    return true;
  }

  // Activity Logs
  getActivityLogs(): ActivityLog[] {
    return this.getFromStorage('monitorhub_activity_logs', []);
  }

  logActivity(action: string, description: string): void {
    const logs = this.getActivityLogs();
    const user = this.getCurrentUser();
    
    const newLog: ActivityLog = {
      id: this.generateId(),
      action,
      description,
      timestamp: new Date().toISOString(),
      userId: user?.email || 'system',
      userName: user?.name || 'System',
    };
    
    logs.unshift(newLog);
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.length = 100;
    }
    
    this.saveToStorage('monitorhub_activity_logs', logs);
  }

  clearActivityLogs(): void {
    this.saveToStorage('monitorhub_activity_logs', []);
  }

  // User
  getCurrentUser(): { email: string; name: string; avatar?: string } | null {
    return this.getFromStorage('monitorhub_user', null);
  }

  // Utility functions
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Reset to defaults
  resetDevices(): void {
    this.saveToStorage('monitorhub_devices', this.getDefaultDevices());
    this.logActivity('reset_devices', 'Reset devices to default data');
  }

  resetAlerts(): void {
    this.saveToStorage('monitorhub_alerts', this.getDefaultAlerts());
    this.logActivity('reset_alerts', 'Reset alerts to default data');
  }

  // Export data
  exportData(): string {
    const data = {
      devices: this.getDevices(),
      alerts: this.getAlerts(),
      activityLogs: this.getActivityLogs(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  // Import data
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.devices) this.saveToStorage('monitorhub_devices', data.devices);
      if (data.alerts) this.saveToStorage('monitorhub_alerts', data.alerts);
      this.logActivity('import_data', 'Imported data from file');
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }

  // Default data
  private getDefaultDevices(): Device[] {
    return [
      {
        id: '1',
        name: 'Load Balancer 1',
        type: 'Load Balancer',
        status: 'online',
        location: 'US-East-1',
        ipAddress: '10.0.1.15',
        cpu: 45,
        memory: 62,
        uptime: '45 days',
        lastSeen: new Date().toISOString(),
        tags: ['production', 'critical'],
      },
      {
        id: '2',
        name: 'Web Server 01',
        type: 'Web Server',
        status: 'online',
        location: 'US-West-2',
        ipAddress: '10.0.2.20',
        cpu: 32,
        memory: 48,
        uptime: '30 days',
        lastSeen: new Date().toISOString(),
        tags: ['production', 'web'],
      },
      {
        id: '3',
        name: 'Database Primary',
        type: 'Database',
        status: 'warning',
        location: 'EU-Central-1',
        ipAddress: '10.0.3.10',
        cpu: 78,
        memory: 85,
        uptime: '60 days',
        lastSeen: new Date(Date.now() - 2 * 60000).toISOString(),
        tags: ['production', 'database'],
      },
      {
        id: '4',
        name: 'Cache Server',
        type: 'Cache',
        status: 'offline',
        location: 'US-East-1',
        ipAddress: '10.0.1.25',
        cpu: 0,
        memory: 0,
        uptime: '0 days',
        lastSeen: new Date(Date.now() - 45 * 60000).toISOString(),
        tags: ['production', 'cache'],
      },
      {
        id: '5',
        name: 'API Gateway',
        type: 'Gateway',
        status: 'online',
        location: 'Asia-Pacific-1',
        ipAddress: '10.0.4.30',
        cpu: 28,
        memory: 35,
        uptime: '15 days',
        lastSeen: new Date().toISOString(),
        tags: ['production', 'api'],
      },
    ];
  }

  private getDefaultAlerts(): Alert[] {
    return [
      {
        id: 'a1',
        title: 'High CPU Usage',
        message: 'Database Primary CPU usage exceeded 75% threshold',
        severity: 'critical',
        deviceId: '3',
        deviceName: 'Database Primary',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        acknowledged: false,
      },
      {
        id: 'a2',
        title: 'Device Offline',
        message: 'Cache Server has gone offline and is not responding',
        severity: 'critical',
        deviceId: '4',
        deviceName: 'Cache Server',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
        acknowledged: false,
      },
      {
        id: 'a3',
        title: 'High Memory Usage',
        message: 'Database Primary memory usage at 85%',
        severity: 'warning',
        deviceId: '3',
        deviceName: 'Database Primary',
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        acknowledged: true,
      },
      {
        id: 'a4',
        title: 'SSL Certificate Expiring',
        message: 'SSL certificate for Load Balancer 1 expires in 30 days',
        severity: 'warning',
        deviceId: '1',
        deviceName: 'Load Balancer 1',
        timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
        acknowledged: false,
      },
      {
        id: 'a5',
        title: 'Backup Completed',
        message: 'Daily backup completed successfully',
        severity: 'info',
        timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
        acknowledged: true,
        resolvedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
      },
    ];
  }
}

// Export singleton instance
export const db = new Database();
