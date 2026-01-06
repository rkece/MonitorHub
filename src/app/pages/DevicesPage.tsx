import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download, RefreshCw, Plus, Edit, Trash2, X, Server } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { db, type Device } from '../utils/database';
import { toast } from 'sonner';

export function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'Web Server',
    status: 'online' as Device['status'],
    location: 'US-East-1',
    ipAddress: '',
    cpu: 0,
    memory: 0,
    uptime: '0 days',
    tags: [] as string[],
  });

  // Load devices
  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = () => {
    setDevices(db.getDevices());
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || device.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'warning':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'offline':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'maintenance':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAddDevice = () => {
    if (!formData.name || !formData.ipAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newDevice = db.addDevice({
      ...formData,
      lastSeen: new Date().toISOString(),
    });

    setDevices(db.getDevices());
    setIsAddDialogOpen(false);
    resetForm();
    toast.success(`Device "${newDevice.name}" added successfully`);
  };

  const handleEditDevice = () => {
    if (!editingDevice || !formData.name || !formData.ipAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    db.updateDevice(editingDevice.id, formData);
    setDevices(db.getDevices());
    setIsEditDialogOpen(false);
    setEditingDevice(null);
    resetForm();
    toast.success(`Device "${formData.name}" updated successfully`);
  };

  const handleDeleteDevice = (device: Device) => {
    if (confirm(`Are you sure you want to delete "${device.name}"?`)) {
      db.deleteDevice(device.id);
      setDevices(db.getDevices());
      toast.success(`Device "${device.name}" deleted`);
    }
  };

  const openEditDialog = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      type: device.type,
      status: device.status,
      location: device.location,
      ipAddress: device.ipAddress,
      cpu: device.cpu,
      memory: device.memory,
      uptime: device.uptime,
      tags: device.tags,
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'Web Server',
      status: 'online',
      location: 'US-East-1',
      ipAddress: '',
      cpu: 0,
      memory: 0,
      uptime: '0 days',
      tags: [],
    });
  };

  const handleExport = () => {
    const data = JSON.stringify(filteredDevices, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devices-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Devices exported successfully');
  };

  const locations = Array.from(new Set(devices.map(d => d.location)));

  return (
    <div className="p-6 space-y-6">
      <Breadcrumbs currentPage="devices" />
      
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Device Monitoring</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Monitor and manage all infrastructure devices</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={loadDevices}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            className="gap-2 bg-purple-500 hover:bg-purple-600"
            onClick={() => {
              resetForm();
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', value: devices.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Online', value: devices.filter((d) => d.status === 'online').length, color: 'from-green-500 to-emerald-500' },
          { label: 'Warning', value: devices.filter((d) => d.status === 'warning').length, color: 'from-orange-500 to-amber-500' },
          { label: 'Offline', value: devices.filter((d) => d.status === 'offline').length, color: 'from-red-500 to-rose-500' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Devices table */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>CPU</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredDevices.map((device) => (
                <React.Fragment key={device.id}>
                  <motion.tr
                    key={`${device.id}-main`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <TableCell>
                      <button
                        onClick={() => setExpandedRow(expandedRow === device.id ? null : device.id)}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                      >
                        {expandedRow === device.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(device.status)}>
                        {device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell className="font-mono text-sm">{device.ipAddress}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${device.cpu > 75 ? 'bg-red-500' : device.cpu > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                            style={{ width: `${device.cpu}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 w-12">{device.cpu}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${device.memory > 75 ? 'bg-red-500' : device.memory > 50 ? 'bg-orange-500' : 'bg-green-500'}`}
                            style={{ width: `${device.memory}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 w-12">{device.memory}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(device)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDevice(device)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                  {expandedRow === device.id && (
                    <motion.tr
                      key={`${device.id}-expanded`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 dark:bg-slate-800/50"
                    >
                      <TableCell colSpan={9} className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Uptime</p>
                            <p className="font-semibold text-slate-900 dark:text-white">{device.uptime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Last Seen</p>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {new Date(device.lastSeen).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Device ID</p>
                            <p className="font-semibold text-slate-900 dark:text-white font-mono text-sm">{device.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Tags</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {device.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredDevices.length === 0 && (
          <div className="p-12 text-center">
            <Server className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-600 dark:text-slate-400">No devices found</p>
          </div>
        )}
      </Card>

      {/* Add Device Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
            <DialogDescription>
              Add a new device to your monitoring infrastructure
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Web Server 01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Server">Web Server</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Load Balancer">Load Balancer</SelectItem>
                  <SelectItem value="Cache">Cache</SelectItem>
                  <SelectItem value="Gateway">Gateway</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ip">IP Address *</Label>
              <Input
                id="ip"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                placeholder="10.0.1.15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US-East-1">US-East-1</SelectItem>
                  <SelectItem value="US-West-2">US-West-2</SelectItem>
                  <SelectItem value="EU-Central-1">EU-Central-1</SelectItem>
                  <SelectItem value="Asia-Pacific-1">Asia-Pacific-1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Device['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpu">CPU Usage (%)</Label>
              <Input
                id="cpu"
                type="number"
                min="0"
                max="100"
                value={formData.cpu}
                onChange={(e) => setFormData({ ...formData, cpu: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDevice} className="bg-purple-500 hover:bg-purple-600">
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Update device information and configuration
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Device Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web Server">Web Server</SelectItem>
                  <SelectItem value="Database">Database</SelectItem>
                  <SelectItem value="Load Balancer">Load Balancer</SelectItem>
                  <SelectItem value="Cache">Cache</SelectItem>
                  <SelectItem value="Gateway">Gateway</SelectItem>
                  <SelectItem value="Storage">Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-ip">IP Address *</Label>
              <Input
                id="edit-ip"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US-East-1">US-East-1</SelectItem>
                  <SelectItem value="US-West-2">US-West-2</SelectItem>
                  <SelectItem value="EU-Central-1">EU-Central-1</SelectItem>
                  <SelectItem value="Asia-Pacific-1">Asia-Pacific-1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Device['status'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cpu">CPU Usage (%)</Label>
              <Input
                id="edit-cpu"
                type="number"
                min="0"
                max="100"
                value={formData.cpu}
                onChange={(e) => setFormData({ ...formData, cpu: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDevice} className="bg-purple-500 hover:bg-purple-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}