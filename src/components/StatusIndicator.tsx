import React from 'react';
import { motion } from 'framer-motion';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  label, 
  size = 'md' 
}) => {
  const statusConfig = {
    online: {
      color: 'bg-success-green',
      pulse: 'animate-pulse',
      label: 'Online'
    },
    offline: {
      color: 'bg-gray-500',
      pulse: '',
      label: 'Offline'
    },
    warning: {
      color: 'bg-warning-orange',
      pulse: 'animate-pulse',
      label: 'Warning'
    },
    error: {
      color: 'bg-danger-red',
      pulse: 'animate-pulse',
      label: 'Error'
    }
  };

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`${sizeClasses[size]} ${config.color} rounded-full ${config.pulse}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      {label && (
        <span className="text-sm text-text-secondary">
          {label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
