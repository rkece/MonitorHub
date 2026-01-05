import { motion } from 'motion/react';
import { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
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
import { devicesData } from '../utils/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function DevicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filteredDevices = devicesData.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesZone = zoneFilter === 'all' || device.zone === zoneFilter;
    return matchesSearch && matchesStatus && matchesZone;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Warning':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Offline':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

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
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Devices', value: devicesData.length, color: 'from-blue-500 to-cyan-500' },
          { label: 'Active', value: devicesData.filter((d) => d.status === 'Active').length, color: 'from-green-500 to-emerald-500' },
          { label: 'Warning', value: devicesData.filter((d) => d.status === 'Warning').length, color: 'from-orange-500 to-amber-500' },
          { label: 'Offline', value: devicesData.filter((d) => d.status === 'Offline').length, color: 'from-red-500 to-rose-500' },
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
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Warning">Warning</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <Select value={zoneFilter} onValueChange={setZoneFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="North DC">North DC</SelectItem>
              <SelectItem value="Central DC">Central DC</SelectItem>
              <SelectItem value="South DC">South DC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Devices table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevices.map((device, index) => (
                <>
                  <motion.tr
                    key={device.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => setExpandedRow(expandedRow === device.id ? null : device.id)}
                  >
                    <TableCell className="font-mono text-sm">{device.id}</TableCell>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.zone}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 w-16">
                          <div
                            className={`h-full rounded-full ${
                              device.cpu > 80 ? 'bg-red-500' : device.cpu > 60 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${device.cpu}%` }}
                          />
                        </div>
                        <span className="text-sm">{device.cpu}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 w-16">
                          <div
                            className={`h-full rounded-full ${
                              device.memory > 80 ? 'bg-red-500' : device.memory > 60 ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${device.memory}%` }}
                          />
                        </div>
                        <span className="text-sm">{device.memory}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{device.uptime}</TableCell>
                    <TableCell className="text-sm text-slate-600 dark:text-slate-400">{device.lastSeen}</TableCell>
                    <TableCell>
                      <motion.div
                        animate={{ rotate: expandedRow === device.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {expandedRow === device.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </motion.div>
                    </TableCell>
                  </motion.tr>
                  {expandedRow === device.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 dark:bg-slate-800/50"
                    >
                      <TableCell colSpan={9}>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Device Details</p>
                            <p className="text-sm">
                              <span className="font-semibold">ID:</span> {device.id}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Location:</span> {device.zone}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Performance</p>
                            <p className="text-sm">
                              <span className="font-semibold">CPU Usage:</span> {device.cpu}%
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Memory Usage:</span> {device.memory}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</p>
                            <p className="text-sm">
                              <span className="font-semibold">Uptime:</span> {device.uptime}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Last Check:</span> {device.lastSeen}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </motion.tr>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </Card>
      </motion.div>
    </div>
  );
}