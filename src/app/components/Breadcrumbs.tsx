import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface BreadcrumbsProps {
  currentPage: string;
}

export function Breadcrumbs({ currentPage }: BreadcrumbsProps) {
  const pageNames: { [key: string]: string } = {
    dashboard: 'Dashboard',
    devices: 'Device Monitoring',
    alerts: 'Event Alerts',
    analytics: 'Analytics & Reports',
    settings: 'Settings',
  };

  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
      <Home className="w-4 h-4" />
      <ChevronRight className="w-4 h-4" />
      <motion.span
        className="text-slate-900 dark:text-white font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {pageNames[currentPage] || 'Dashboard'}
      </motion.span>
    </div>
  );
}
