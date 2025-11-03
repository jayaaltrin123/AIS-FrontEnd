import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ship, Search, Filter, MapPin, Gauge, Navigation, Clock, AlertTriangle } from 'lucide-react';
import { Ship as ShipType } from '../types';
import InteractiveMap from '../components/InteractiveMap';
import { Alert } from '../types';

// Mock data generator
const generateMockShips = (): ShipType[] => {
  const shipTypes = ['Cargo', 'Tanker', 'Fishing', 'Passenger', 'Military'];
  const statuses: ShipType['status'][] = ['normal', 'warning', 'danger'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    mmsi: (100000000 + i).toString(),
    name: `MV ${['Ocean', 'Sea', 'Marine', 'Blue', 'Deep', 'Atlantic', 'Pacific'][i % 7]} ${['Star', 'Wave', 'Breeze', 'Storm', 'Dawn', 'Crown', 'Pearl'][i % 7]}`,
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

interface ShipsProps {
  onShipSelect?: (ship: ShipType) => void;
}

const Ships: React.FC<ShipsProps> = ({ onShipSelect }) => {
  const [ships, setShips] = useState<ShipType[]>([]);
  const [filteredShips, setFilteredShips] = useState<ShipType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'normal' | 'warning' | 'danger'>('all');
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [showMap, setShowMap] = useState(true);

  // Generate mock alerts for the map
  const alerts: Alert[] = [];

  useEffect(() => {
    const mockShips = generateMockShips();
    setShips(mockShips);
    setFilteredShips(mockShips);
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

  // Filter ships based on search and status
  useEffect(() => {
    let filtered = ships;

    if (searchQuery) {
      filtered = filtered.filter(ship =>
        ship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ship.mmsi.includes(searchQuery) ||
        ship.shipType.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ship => ship.status === selectedStatus);
    }

    setFilteredShips(filtered);
  }, [searchQuery, selectedStatus, ships]);

  const handleShipClick = (ship: ShipType) => {
    setSelectedShip(ship);
    onShipSelect?.(ship);
  };

  const getStatusColor = (status: ShipType['status']) => {
    switch (status) {
      case 'danger': return 'bg-danger-red';
      case 'warning': return 'bg-warning-orange';
      default: return 'bg-success-green';
    }
  };

  const getStatusText = (status: ShipType['status']) => {
    switch (status) {
      case 'danger': return 'Critical';
      case 'warning': return 'Warning';
      default: return 'Normal';
    }
  };

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
            style={{ background: 'linear-gradient(135deg, #3baed9, #5bc0de)' }}
            animate={{
              rotate: [0, 5, -5, 0],
              boxShadow: ['0 4px 15px rgba(59, 174, 217, 0.3)', '0 8px 25px rgba(59, 174, 217, 0.5)', '0 4px 15px rgba(59, 174, 217, 0.3)'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Ship className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white glow-text">Ships Registry</h2>
            <p className="text-sm text-text-secondary">Monitor and track all vessels in the system</p>
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
              placeholder="Search by name, MMSI, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/8 border-2 border-white/15 rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all text-base hover:bg-white/10"
              style={{ height: '52px' }}
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'normal', 'warning', 'danger'] as const).map((status) => (
              <motion.button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? status === 'all'
                      ? 'bg-aqua-blue text-white shadow-lg'
                      : status === 'danger'
                      ? 'bg-danger-red text-white shadow-lg'
                      : status === 'warning'
                      ? 'bg-warning-orange text-white shadow-lg'
                      : 'bg-success-green text-white shadow-lg'
                    : 'bg-white/8 text-text-secondary hover:bg-white/10 border-2 border-white/15'
                }`}
                style={{ height: '52px' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className={`grid ${showMap ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {/* Ships List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Vessels ({filteredShips.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredShips.map((ship, index) => (
              <motion.div
                key={ship.mmsi}
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.4 }}
                onClick={() => handleShipClick(ship)}
                className={`card p-5 cursor-pointer hover:bg-white/10 transition-all rounded-xl ${
                  selectedShip?.mmsi === ship.mmsi ? 'ring-2 ring-aqua-blue shadow-lg' : ''
                }`}
                whileHover={{ 
                  scale: 1.02,
                  y: -4,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(ship.status)}`} />
                    <div>
                      <h4 className="text-white font-semibold">{ship.name}</h4>
                      <p className="text-xs text-text-secondary">MMSI: {ship.mmsi}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ship.status)} text-white`}>
                    {getStatusText(ship.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Ship className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">Type:</span>
                    <span className="text-white">{ship.shipType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">Speed:</span>
                    <span className="text-white">{ship.speed.toFixed(1)} knots</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">Course:</span>
                    <span className="text-white">{ship.course.toFixed(0)}°</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-secondary">Updated:</span>
                    <span className="text-white">{new Date(ship.lastUpdate).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-text-secondary">
                  <MapPin className="w-3 h-3" />
                  <span>{ship.latitude.toFixed(4)}°, {ship.longitude.toFixed(4)}°</span>
                </div>
              </motion.div>
            ))}

            {filteredShips.length === 0 && (
              <div className="text-center py-12">
                <Ship className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                <p className="text-text-secondary">No ships found matching your criteria</p>
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
              <div className="p-2 rounded-lg glow-pulse" style={{ background: 'linear-gradient(135deg, #3baed9, #5bc0de)' }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white glow-text">Ship Locations</h2>
                <p className="text-sm text-text-secondary">
                  {filteredShips.length} vessels displayed
                </p>
              </div>
            </div>
            
            <InteractiveMap
              ships={filteredShips}
              alerts={alerts}
              onShipSelect={handleShipClick}
            />
          </motion.div>
        )}
      </div>

      {/* Selected Ship Details */}
      {selectedShip && !showMap && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Ship Details</h3>
            <button
              onClick={() => setSelectedShip(null)}
              className="text-text-secondary hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-text-secondary text-sm mb-1">Name</p>
              <p className="text-white font-medium">{selectedShip.name}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">MMSI</p>
              <p className="text-white font-medium">{selectedShip.mmsi}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Type</p>
              <p className="text-white font-medium">{selectedShip.shipType}</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Status</p>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedShip.status)} text-white`}>
                {getStatusText(selectedShip.status)}
              </span>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Speed</p>
              <p className="text-white font-medium">{selectedShip.speed.toFixed(1)} knots</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Course</p>
              <p className="text-white font-medium">{selectedShip.course.toFixed(0)}°</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Heading</p>
              <p className="text-white font-medium">{selectedShip.heading.toFixed(0)}°</p>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-1">Last Update</p>
              <p className="text-white font-medium">{new Date(selectedShip.lastUpdate).toLocaleString()}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-text-secondary text-sm mb-1">Position</p>
              <p className="text-white font-medium">
                {selectedShip.latitude.toFixed(4)}°, {selectedShip.longitude.toFixed(4)}°
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Ships;


