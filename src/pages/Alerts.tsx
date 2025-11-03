import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Filter, Clock, Ship, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Alert as AlertType } from '../types';
import InteractiveMap from '../components/InteractiveMap';
import { Ship as ShipType } from '../types';

// Mock data generator
const generateMockAlerts = (): AlertType[] => {
  const alertTypes: AlertType['type'][] = ['collision_risk', 'illegal_discharge', 'loitering', 'grounding', 'anomaly'];
  const severities: AlertType['severity'][] = ['low', 'medium', 'high', 'critical'];
  const statuses: AlertType['status'][] = ['active', 'acknowledged', 'resolved'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      id: `alert-${i}`,
      type,
      severity,
      title: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Detected ${type.replace('_', ' ')} in monitoring area. Immediate attention required.`,
      shipMmsi: Math.random() > 0.3 ? (100000000 + Math.floor(Math.random() * 25)).toString() : undefined,
      latitude: Math.random() > 0.3 ? 20 + (Math.random() - 0.5) * 20 : undefined,
      longitude: Math.random() > 0.3 ? -80 + (Math.random() - 0.5) * 40 : undefined,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      status,
    };
  });
};

interface AlertsProps {
  alerts?: AlertType[];
  onAlertsUpdate?: (alerts: AlertType[]) => void;
}

const Alerts: React.FC<AlertsProps> = ({ alerts: externalAlerts, onAlertsUpdate }) => {
  const [alerts, setAlerts] = useState<AlertType[]>(externalAlerts || []);
  const [filteredAlerts, setFilteredAlerts] = useState<AlertType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    if (!externalAlerts || externalAlerts.length === 0) {
      const mockAlerts = generateMockAlerts();
      setAlerts(mockAlerts);
      onAlertsUpdate?.(mockAlerts);
    } else {
      setAlerts(externalAlerts);
    }
  }, [externalAlerts, onAlertsUpdate]);

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: AlertType = {
          id: `alert-${Date.now()}`,
          type: ['collision_risk', 'illegal_discharge', 'loitering'][Math.floor(Math.random() * 3)] as any,
          severity: ['high', 'critical'][Math.floor(Math.random() * 2)] as any,
          title: 'New Alert Detected',
          description: 'A new alert has been detected in the monitoring area.',
          shipMmsi: (100000000 + Math.floor(Math.random() * 25)).toString(),
          latitude: 20 + (Math.random() - 0.5) * 20,
          longitude: -80 + (Math.random() - 0.5) * 40,
          timestamp: new Date().toISOString(),
          status: 'active',
        };
        
        const updatedAlerts = [newAlert, ...alerts];
        setAlerts(updatedAlerts);
        onAlertsUpdate?.(updatedAlerts);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [alerts, onAlertsUpdate]);

  // Filter alerts
  useEffect(() => {
    let filtered = alerts;

    if (searchQuery) {
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.shipMmsi?.includes(searchQuery)
      );
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(alert => alert.severity === selectedSeverity);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === selectedStatus);
    }

    setFilteredAlerts(filtered);
  }, [searchQuery, selectedSeverity, selectedStatus, alerts]);

  const handleAlertClick = (alert: AlertType) => {
    setSelectedAlert(alert);
  };

  const handleAcknowledge = (alertId: string) => {
    const updated = alerts.map(a => 
      a.id === alertId ? { ...a, status: 'acknowledged' as const } : a
    );
    setAlerts(updated);
    onAlertsUpdate?.(updated);
  };

  const handleResolve = (alertId: string) => {
    const updated = alerts.map(a => 
      a.id === alertId ? { ...a, status: 'resolved' as const } : a
    );
    setAlerts(updated);
    onAlertsUpdate?.(updated);
  };

  const getSeverityColor = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-danger-red';
      case 'high': return 'bg-warning-orange';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getAlertIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'collision_risk': return '⚠️';
      case 'illegal_discharge': return '🛑';
      case 'loitering': return '⏰';
      case 'grounding': return '🏝️';
      default: return '🔍';
    }
  };

  // Generate ships from alerts with positions
  const alertShips: ShipType[] = alerts
    .filter(a => a.shipMmsi && a.latitude && a.longitude)
    .map(a => ({
      mmsi: a.shipMmsi!,
      name: `Ship ${a.shipMmsi}`,
      latitude: a.latitude!,
      longitude: a.longitude!,
      speed: 0,
      course: 0,
      heading: 0,
      shipType: 'Unknown',
      status: a.severity === 'critical' ? 'danger' : a.severity === 'high' ? 'warning' : 'normal',
      lastUpdate: a.timestamp,
    }));

  return (
    <motion.div 
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl" 
            style={{ background: 'linear-gradient(135deg, #e63946, #f77f00)' }}
            animate={{
              boxShadow: ['0 4px 15px rgba(230, 57, 70, 0.3)', '0 8px 25px rgba(230, 57, 70, 0.5)', '0 4px 15px rgba(230, 57, 70, 0.3)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <AlertTriangle className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white glow-text">Alert Management</h2>
            <p className="text-sm text-text-secondary">
              {alerts.filter(a => a.status === 'active').length} active alerts • {alerts.filter(a => a.severity === 'critical').length} critical
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => setShowMap(!showMap)}
          className="btn btn-secondary flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </motion.button>
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="card p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
              animate={{
                scale: searchQuery ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Search className="w-5 h-5" />
            </motion.div>
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all text-base hover:bg-white/10"
              style={{ height: '52px' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <motion.select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="px-4 py-3 bg-white/8 border-2 border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all"
              style={{ height: '52px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </motion.select>
            <motion.select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-4 py-3 bg-white/8 border-2 border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all"
              style={{ height: '52px' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="resolved">Resolved</option>
            </motion.select>
          </div>
        </div>
      </motion.div>

      <div className={`grid ${showMap ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Alerts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Alerts ({filteredAlerts.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                onClick={() => handleAlertClick(alert)}
                className={`card p-5 cursor-pointer hover:bg-white/10 transition-all rounded-xl ${
                  selectedAlert?.id === alert.id ? 'ring-2 ring-aqua-blue shadow-lg' : ''
                } ${alert.status === 'active' ? 'border-l-4 border-aqua-blue' : ''}`}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                    <div>
                      <h4 className="text-white font-semibold">{alert.title}</h4>
                      <p className="text-xs text-text-secondary">{alert.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(alert.severity)} text-white`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      alert.status === 'active' ? 'bg-aqua-blue text-white' :
                      alert.status === 'acknowledged' ? 'bg-yellow-500 text-white' :
                      'bg-success-green text-white'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-3">{alert.description}</p>

                <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                  {alert.shipMmsi && (
                    <div className="flex items-center gap-1">
                      <Ship className="w-3 h-3" />
                      <span>MMSI: {alert.shipMmsi}</span>
                    </div>
                  )}
                  {alert.latitude && alert.longitude && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.latitude.toFixed(2)}°, {alert.longitude.toFixed(2)}°</span>
                    </div>
                  )}
                </div>

                {alert.status === 'active' && (
                  <motion.div 
                    className="flex gap-2 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcknowledge(alert.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-500/20 text-yellow-500 rounded-xl hover:bg-yellow-500/30 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Acknowledge
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResolve(alert.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-success-green/20 text-success-green rounded-xl hover:bg-success-green/30 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XCircle className="w-4 h-4" />
                      Resolve
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No alerts found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Map View */}
        {showMap && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="card gradient-border hover-tilt rounded-xl"
            style={{ padding: '1rem', height: '600px' }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg glow-pulse" style={{ background: 'linear-gradient(135deg, #e63946, #f77f00)' }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white glow-text">Alert Locations</h2>
                <p className="text-sm text-text-secondary">
                  {filteredAlerts.length} alerts displayed
                </p>
              </div>
            </div>
            
            <InteractiveMap
              ships={alertShips}
              alerts={filteredAlerts}
              onAlertSelect={handleAlertClick}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Alerts;


