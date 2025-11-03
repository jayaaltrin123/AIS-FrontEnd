import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Ship, 
  Eye,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const [filteredAlerts, setFilteredAlerts] = useState(alerts);
  const [filter, setFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredAlerts(alerts);
    } else {
      setFilteredAlerts(alerts.filter(alert => alert.status === filter));
    }
  }, [alerts, filter]);

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'collision_risk':
        return '⚠️';
      case 'illegal_discharge':
        return '🛑';
      case 'loitering':
        return '⏰';
      case 'grounding':
        return '🏝️';
      default:
        return '🔍';
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'border-l-danger-red';
      case 'high':
        return 'border-l-warning-orange';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-aqua-blue';
      default:
        return 'border-l-gray-500';
    }
  };

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'active':
        return 'text-danger-red';
      case 'acknowledged':
        return 'text-warning-orange';
      case 'resolved':
        return 'text-success-green';
      default:
        return 'text-text-secondary';
    }
  };

  const handleAlertAction = (alertId: string, action: 'acknowledge' | 'resolve') => {
    // In a real app, this would make an API call
    console.log(`${action} alert ${alertId}`);
  };

  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Real-time Alerts</h2>
            <p className="text-sm text-text-secondary">
              {filteredAlerts.length} alerts • {alerts.filter(a => a.status === 'active').length} active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-text-secondary" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-transparent text-sm text-text-secondary border border-white/20 rounded px-2 py-1"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`border-l-4 ${getSeverityColor(alert.severity)} bg-white/5 rounded-r-lg p-4 cursor-pointer hover:bg-white/10 transition-all`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {alert.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(alert.status)} bg-current/20`}>
                      {alert.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary mb-2 line-clamp-2">
                    {alert.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                    {alert.shipMmsi && (
                      <div className="flex items-center gap-1">
                        <Ship className="w-3 h-3" />
                        {alert.shipMmsi}
                      </div>
                    )}
                    {alert.latitude && alert.longitude && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.latitude.toFixed(2)}°, {alert.longitude.toFixed(2)}°
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAlertAction(alert.id, 'acknowledge');
                        }}
                        className="p-1 text-warning-orange hover:bg-warning-orange/20 rounded transition-colors"
                        title="Acknowledge"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAlertAction(alert.id, 'resolve');
                        }}
                        className="p-1 text-success-green hover:bg-success-green/20 rounded transition-colors"
                        title="Resolve"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-text-muted mx-auto mb-3" />
          <p className="text-text-muted">No alerts found</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
