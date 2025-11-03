import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { 
  Ship, 
  AlertTriangle, 
  MapPin, 
  Navigation,
  Clock,
  Gauge
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Ship as ShipType, Alert } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  ships: ShipType[];
  alerts: Alert[];
  onShipSelect?: (ship: ShipType) => void;
  onAlertSelect?: (alert: Alert) => void;
}

// Custom ship icon
const createShipIcon = (status: ShipType['status']) => {
  const color = status === 'danger' ? '#e63946' : status === 'warning' ? '#f77f00' : '#3baed9';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14 8H20L16 12L18 18L12 15L6 18L8 12L4 8H10L12 2Z" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    `)}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Custom alert icon
const createAlertIcon = (severity: Alert['severity']) => {
  const color = severity === 'critical' ? '#e63946' : severity === 'high' ? '#f77f00' : '#fbbf24';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L22 20H2L12 2Z" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M12 8V14M12 18H12.01" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `)}`,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
  });
};

// Map controls component
const MapControls: React.FC<{ 
  onZoomToShips: () => void;
  onToggleAlerts: () => void;
  showAlerts: boolean;
}> = ({ onZoomToShips, onToggleAlerts, showAlerts }) => {
  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onZoomToShips}
        className="glass-effect p-3 rounded-lg hover:bg-white/20 transition-colors"
        title="Zoom to all ships"
      >
        <Ship className="w-5 h-5 text-white" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleAlerts}
        className={`p-3 rounded-lg transition-colors ${
          showAlerts ? 'bg-danger-red/20 text-danger-red' : 'glass-effect hover:bg-white/20'
        }`}
        title="Toggle alerts"
      >
        <AlertTriangle className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

// Ship popup component
const ShipPopup: React.FC<{ ship: ShipType; onSelect: () => void }> = ({ ship, onSelect }) => {
  return (
    <div className="p-4 min-w-[280px]">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-3 h-3 rounded-full ${
          ship.status === 'danger' ? 'bg-danger-red' : 
          ship.status === 'warning' ? 'bg-warning-orange' : 
          'bg-success-green'
        }`} />
        <h3 className="text-lg font-bold text-gray-800">{ship.name}</h3>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Ship className="w-4 h-4 text-gray-600" />
          <span className="font-medium">MMSI:</span>
          <span className="text-gray-600">{ship.mmsi}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Speed:</span>
          <span className="text-gray-600">{ship.speed} knots</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Course:</span>
          <span className="text-gray-600">{ship.course}°</span>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Position:</span>
          <span className="text-gray-600">{ship.latitude.toFixed(4)}°, {ship.longitude.toFixed(4)}°</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Last Update:</span>
          <span className="text-gray-600">{new Date(ship.lastUpdate).toLocaleTimeString()}</span>
        </div>
      </div>
      
      <button
        onClick={onSelect}
        className="w-full mt-4 bg-aqua-blue text-white py-2 px-4 rounded-lg hover:bg-aqua-light transition-colors"
      >
        View Details
      </button>
    </div>
  );
};

// Alert popup component
const AlertPopup: React.FC<{ alert: Alert; onSelect: () => void }> = ({ alert, onSelect }) => {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'collision_risk': return '⚠️';
      case 'illegal_discharge': return '🛑';
      case 'loitering': return '⏰';
      case 'grounding': return '🏝️';
      default: return '🔍';
    }
  };

  return (
    <div className="p-4 min-w-[280px]">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{getAlertIcon(alert.type)}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{alert.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${
            alert.severity === 'critical' ? 'bg-danger-red text-white' :
            alert.severity === 'high' ? 'bg-warning-orange text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {alert.severity.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="font-medium">Time:</span>
          <span className="text-gray-600">{new Date(alert.timestamp).toLocaleString()}</span>
        </div>
        
        {alert.shipMmsi && (
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Ship:</span>
            <span className="text-gray-600">{alert.shipMmsi}</span>
          </div>
        )}
        
        {alert.latitude && alert.longitude && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="font-medium">Location:</span>
            <span className="text-gray-600">{alert.latitude.toFixed(4)}°, {alert.longitude.toFixed(4)}°</span>
          </div>
        )}
      </div>
      
      <button
        onClick={onSelect}
        className="w-full mt-4 bg-danger-red text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
      >
        View Alert
      </button>
    </div>
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  ships, 
  alerts, 
  onShipSelect, 
  onAlertSelect 
}) => {
  const [showAlerts, setShowAlerts] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  // Calculate map center based on ships
  useEffect(() => {
    if (ships.length > 0) {
      const avgLat = ships.reduce((sum, ship) => sum + ship.latitude, 0) / ships.length;
      const avgLng = ships.reduce((sum, ship) => sum + ship.longitude, 0) / ships.length;
      setMapCenter([avgLat, avgLng]);
      setMapZoom(6);
    }
  }, [ships]);

  const handleZoomToShips = () => {
    if (ships.length > 0) {
      const avgLat = ships.reduce((sum, ship) => sum + ship.latitude, 0) / ships.length;
      const avgLng = ships.reduce((sum, ship) => sum + ship.longitude, 0) / ships.length;
      setMapCenter([avgLat, avgLng]);
      setMapZoom(8);
    }
  };

  const handleToggleAlerts = () => {
    setShowAlerts(!showAlerts);
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Ship markers */}
        {ships.map((ship) => (
          <Marker
            key={ship.mmsi}
            position={[ship.latitude, ship.longitude]}
            icon={createShipIcon(ship.status)}
          >
            <Popup>
              <ShipPopup 
                ship={ship} 
                onSelect={() => onShipSelect?.(ship)} 
              />
            </Popup>
          </Marker>
        ))}
        
        {/* Alert markers */}
        {showAlerts && alerts.map((alert) => (
          <React.Fragment key={alert.id}>
            {alert.latitude && alert.longitude && (
              <>
                <Marker
                  position={[alert.latitude, alert.longitude]}
                  icon={createAlertIcon(alert.severity)}
                >
                  <Popup>
                    <AlertPopup 
                      alert={alert} 
                      onSelect={() => onAlertSelect?.(alert)} 
                    />
                  </Popup>
                </Marker>
                
                {/* Risk zone circle for critical alerts */}
                {alert.severity === 'critical' && (
                  <Circle
                    center={[alert.latitude, alert.longitude]}
                    radius={5000} // 5km radius
                    pathOptions={{
                      color: '#e63946',
                      fillColor: '#e63946',
                      fillOpacity: 0.1,
                      weight: 2
                    }}
                  />
                )}
              </>
            )}
          </React.Fragment>
        ))}
      </MapContainer>
      
      <MapControls
        onZoomToShips={handleZoomToShips}
        onToggleAlerts={handleToggleAlerts}
        showAlerts={showAlerts}
      />
    </div>
  );
};

export default InteractiveMap;
