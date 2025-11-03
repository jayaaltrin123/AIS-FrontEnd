import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Ship, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import AISMapOverlay from '../components/AISMapOverlay';
import { Ship as ShipType, Alert } from '../types';

// Mock data generator
const generateMockShips = (): ShipType[] => {
  const shipTypes = ['Cargo', 'Tanker', 'Fishing', 'Passenger', 'Military'];
  const statuses: ShipType['status'][] = ['normal', 'warning', 'danger'];
  
  return Array.from({ length: 40 }, (_, i) => ({
    mmsi: (100000000 + i).toString(),
    name: `MV ${['Ocean', 'Sea', 'Marine', 'Blue', 'Deep'][i % 5]} ${['Star', 'Wave', 'Breeze', 'Storm', 'Dawn'][i % 5]}`,
    latitude: 20 + (Math.random() - 0.5) * 20,
    longitude: -80 + (Math.random() - 0.5) * 40,
    speed: Math.random() * 25,
    course: Math.random() * 360,
    heading: Math.random() * 360,
    shipType: shipTypes[Math.floor(Math.random() * shipTypes.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
  }));
};

const generateMockAlerts = (): Alert[] => {
  const alertTypes: Alert['type'][] = ['collision_risk', 'illegal_discharge', 'loitering', 'grounding', 'anomaly'];
  const severities: Alert['severity'][] = ['low', 'medium', 'high', 'critical'];
  
  return Array.from({ length: 15 }, (_, i) => {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: `alert-${i}`,
      type,
      severity,
      title: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `Detected ${type.replace('_', ' ')} in monitoring area.`,
      shipMmsi: Math.random() > 0.3 ? (100000000 + Math.floor(Math.random() * 25)).toString() : undefined,
      latitude: Math.random() > 0.3 ? 20 + (Math.random() - 0.5) * 20 : undefined,
      longitude: Math.random() > 0.3 ? -80 + (Math.random() - 0.5) * 40 : undefined,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      status: 'active' as const,
    };
  });
};

interface MapPageProps {
  voiceAlertsEnabled?: boolean;
  onAlertsUpdate?: (alerts: Alert[]) => void;
}

const MapPage: React.FC<MapPageProps> = ({ voiceAlertsEnabled, onAlertsUpdate }) => {
  const [ships, setShips] = useState<ShipType[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showAISOverlay, setShowAISOverlay] = useState(true);

  // Initialize data
  useEffect(() => {
    const mockShips = generateMockShips();
    const mockAlerts = generateMockAlerts();
    setShips(mockShips);
    setAlerts(mockAlerts);
    onAlertsUpdate?.(mockAlerts);
  }, [onAlertsUpdate]);

  // Real-time updates - more frequent when voice alerts are enabled
  useEffect(() => {
    const updateInterval = voiceAlertsEnabled ? 2000 : 5000; // Update every 2s if voice alerts enabled, else 5s

    const interval = setInterval(() => {
      setIsUpdating(true);
      
      // Update ship positions
      setShips(prevShips =>
        prevShips.map(ship => ({
          ...ship,
          latitude: ship.latitude + (Math.random() - 0.5) * 0.01,
          longitude: ship.longitude + (Math.random() - 0.5) * 0.01,
          speed: Math.max(0, ship.speed + (Math.random() - 0.5) * 2),
          lastUpdate: new Date().toISOString(),
        }))
      );

      // Generate new alerts occasionally
      if (Math.random() > 0.8 || (voiceAlertsEnabled && Math.random() > 0.9)) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: ['collision_risk', 'illegal_discharge', 'loitering'][Math.floor(Math.random() * 3)] as any,
          severity: voiceAlertsEnabled ? 'critical' : (['high', 'critical'][Math.floor(Math.random() * 2)] as any),
          title: 'New Alert Detected',
          description: 'A new alert has been detected in the monitoring area. Immediate attention required.',
          shipMmsi: (100000000 + Math.floor(Math.random() * 40)).toString(),
          latitude: 20 + (Math.random() - 0.5) * 20,
          longitude: -80 + (Math.random() - 0.5) * 40,
          timestamp: new Date().toISOString(),
          status: 'active',
        };

        setAlerts(prev => {
          const updated = [newAlert, ...prev].slice(0, 20); // Keep max 20 alerts
          onAlertsUpdate?.(updated);
          return updated;
        });
      }

      setLastUpdate(new Date());
      setIsUpdating(false);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [voiceAlertsEnabled, onAlertsUpdate]);

  const handleManualRefresh = () => {
    setIsUpdating(true);
    const mockShips = generateMockShips();
    const mockAlerts = generateMockAlerts();
    setShips(mockShips);
    setAlerts(mockAlerts);
    onAlertsUpdate?.(mockAlerts);
    setLastUpdate(new Date());
    setTimeout(() => setIsUpdating(false), 500);
  };

  const handleShipSelect = (ship: ShipType) => {
    console.log('Selected ship:', ship);
  };

  const handleAlertSelect = (alert: Alert) => {
    console.log('Selected alert:', alert);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg glow-pulse" style={{ background: 'linear-gradient(135deg, #3baed9, #5bc0de)' }}>
            <MapIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white glow-text">Live AIS Map</h2>
            <p className="text-sm text-text-secondary">
              {ships.length} vessels • {alerts.filter(a => a.status === 'active').length} active alerts
              {voiceAlertsEnabled && ' • Voice alerts enabled'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-text-secondary">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isUpdating}
            className={`btn btn-secondary flex items-center gap-2 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-aqua-blue/20">
              <Ship className="w-5 h-5 text-aqua-blue" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{ships.length}</div>
              <div className="text-xs text-text-secondary">Total Ships</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-danger-red/20">
              <AlertTriangle className="w-5 h-5 text-danger-red" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{alerts.filter(a => a.status === 'active').length}</div>
              <div className="text-xs text-text-secondary">Active Alerts</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning-orange/20">
              <AlertTriangle className="w-5 h-5 text-warning-orange" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{alerts.filter(a => a.severity === 'critical').length}</div>
              <div className="text-xs text-text-secondary">Critical Alerts</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success-green/20">
              <RefreshCw className={`w-5 h-5 text-success-green ${voiceAlertsEnabled ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {voiceAlertsEnabled ? '2s' : '5s'}
              </div>
              <div className="text-xs text-text-secondary">Update Rate</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card gradient-border hover-tilt"
        style={{ padding: '1rem', height: '70vh', minHeight: '600px' }}
      >
        <div className="relative w-full h-full">
          {/* Base Interactive Map */}
          <InteractiveMap
            ships={ships}
            alerts={alerts}
            onShipSelect={handleShipSelect}
            onAlertSelect={handleAlertSelect}
          />
          
          {/* AIS Data Overlay (India Map) */}
          {showAISOverlay && (
            <AISMapOverlay
              onShipSelect={handleShipSelect}
            />
          )}
          
          {/* Toggle AIS Overlay Button */}
          <div className="absolute top-4 left-4 z-[1000]">
            <button
              onClick={() => setShowAISOverlay(!showAISOverlay)}
              className={`glass-effect p-3 rounded-lg transition-colors flex items-center gap-2 ${
                showAISOverlay 
                  ? 'bg-aqua-blue/20 text-aqua-blue' 
                  : 'hover:bg-white/20 text-text-secondary'
              }`}
              title={showAISOverlay ? 'Hide AIS India Overlay' : 'Show AIS India Overlay'}
            >
              <Layers className="w-5 h-5" />
              <span className="text-sm font-medium">AIS India</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MapPage;

