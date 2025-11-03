import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InteractiveMap from '../components/InteractiveMap';
import AlertsPanel from '../components/AlertsPanel';
import StatisticsCards from '../components/StatisticsCards';
import ReportsSection from '../components/ReportsSection';
import { Ship, Alert, Statistics } from '../types';

// Mock data generator
const generateMockShips = (): Ship[] => {
  const shipTypes = ['Cargo', 'Tanker', 'Fishing', 'Passenger', 'Military'];
  const statuses: Ship['status'][] = ['normal', 'warning', 'danger'];
  
  return Array.from({ length: 25 }, (_, i) => ({
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
  const statuses: Alert['status'][] = ['active', 'acknowledged', 'resolved'];
  
  return Array.from({ length: 15 }, (_, i) => {
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

interface DashboardProps {
  onAlertsUpdate?: (alerts: Alert[]) => void;
  onNavigate?: (view: 'dashboard' | 'reports' | 'map' | 'ships' | 'alerts') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onAlertsUpdate, onNavigate }) => {
  const [ships, setShips] = useState<Ship[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalShips: 0,
    activeAlerts: 0,
    oilSpillRisks: 0,
    last24hIncidents: 0,
  });
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'reports'>('dashboard');

  // Initialize mock data
  useEffect(() => {
    const mockShips = generateMockShips();
    const mockAlerts = generateMockAlerts();
    
    setShips(mockShips);
    setAlerts(mockAlerts);
    onAlertsUpdate?.(mockAlerts);
    
    setStatistics({
      totalShips: mockShips.length,
      activeAlerts: mockAlerts.filter(a => a.status === 'active').length,
      oilSpillRisks: mockAlerts.filter(a => a.type === 'illegal_discharge' && a.status === 'active').length,
      last24hIncidents: mockAlerts.filter(a => 
        new Date(a.timestamp) > new Date(Date.now() - 86400000)
      ).length,
    });
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setShips(prevShips => 
        prevShips.map(ship => ({
          ...ship,
          latitude: ship.latitude + (Math.random() - 0.5) * 0.01,
          longitude: ship.longitude + (Math.random() - 0.5) * 0.01,
          speed: Math.max(0, ship.speed + (Math.random() - 0.5) * 2),
          lastUpdate: new Date().toISOString(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleShipSelect = (ship: Ship) => {
    setSelectedShip(ship);
    console.log('Selected ship:', ship);
  };

  const handleAlertSelect = (alert: Alert) => {
    setSelectedAlert(alert);
    console.log('Selected alert:', alert);
  };

  if (currentView === 'reports') {
    return (
      <div className="p-6">
        <ReportsSection />
      </div>
    );
  }

  return (
    <motion.div 
      className="dashboard-container ocean-ripples"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Statistics Cards */}
      <StatisticsCards statistics={statistics} />

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* Map - Takes up 2/3 of the space */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: -30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="map-container"
        >
          <motion.div 
            className="card gradient-border hover-tilt rounded-xl" 
            style={{ padding: '1rem', height: '600px' }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div 
                className="p-3 rounded-xl glow-pulse" 
                style={{ background: 'linear-gradient(135deg, #3baed9, #5bc0de)' }}
                animate={{
                  boxShadow: ['0 4px 15px rgba(59, 174, 217, 0.4)', '0 8px 25px rgba(59, 174, 217, 0.6)', '0 4px 15px rgba(59, 174, 217, 0.4)'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </motion.div>
              <div>
                <h2 className="text-xl font-bold text-white glow-text">Live Maritime Map</h2>
                <p className="text-sm text-text-secondary">
                  {ships.length} vessels • {alerts.filter(a => a.status === 'active').length} active alerts
                </p>
              </div>
            </motion.div>
            
            <InteractiveMap
              ships={ships}
              alerts={alerts}
              onShipSelect={handleShipSelect}
              onAlertSelect={handleAlertSelect}
            />
          </motion.div>
        </motion.div>

        {/* Alerts Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="alerts-container"
        >
          <div className="shimmer" style={{ borderRadius: '12px' }}>
            <AlertsPanel alerts={alerts} />
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="card p-6 float-slow rounded-xl"
        whileHover={{ 
          scale: 1.01,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 glow-text">Quick Actions</h3>
            <p className="text-sm text-text-secondary">Common monitoring tasks and system controls</p>
          </div>
          
          <div className="flex gap-3">
            <motion.button
              onClick={() => setCurrentView('reports')}
              className="btn btn-secondary hover-tilt"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Reports
            </motion.button>
            <motion.button 
              className="btn btn-primary hover-tilt"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Export Data
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
