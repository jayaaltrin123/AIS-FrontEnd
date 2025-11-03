import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Ship, Gauge, Navigation, MapPin, Clock } from 'lucide-react';
import { Ship as ShipType } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AISMapOverlayProps {
  onShipSelect?: (ship: ShipType) => void;
}

// Custom ship icon for AIS data
const createAISShipIcon = (status: ShipType['status']) => {
  const color = status === 'danger' ? '#e63946' : status === 'warning' ? '#f77f00' : '#3baed9';
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2"/>
        <path d="M16 8L18 14H24L20 18L22 24L16 21L10 24L12 18L8 14H14L16 8Z" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to fit India bounds
const FitIndiaBounds: React.FC = () => {
  const map = useMap();
  
  useEffect(() => {
    // India bounds: approximately 6.5°N to 37°N, 68°E to 97°E
    const indiaBounds: [[number, number], [number, number]] = [
      [6.5, 68], // Southwest
      [37, 97]   // Northeast
    ];
    map.fitBounds(indiaBounds, { padding: [50, 50] });
  }, [map]);

  return null;
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
        
        <div className="flex items-center gap-2">
          <span className="font-medium">Type:</span>
          <span className="text-gray-600">{ship.shipType}</span>
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

const AISMapOverlay: React.FC<AISMapOverlayProps> = ({ onShipSelect }) => {
  const [aisShips, setAisShips] = useState<ShipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load AIS data from JSON file
  useEffect(() => {
    const loadAISData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/ais_data.json');
        
        if (!response.ok) {
          throw new Error('Failed to load AIS data');
        }
        
        const data = await response.json();
        setAisShips(data);
        setError(null);
      } catch (err) {
        console.error('Error loading AIS data:', err);
        setError('Failed to load AIS data. Using fallback data.');
        // Fallback to mock data if file fails
        setAisShips([]);
      } finally {
        setLoading(false);
      }
    };

    loadAISData();

    // Update ship positions periodically to simulate real-time updates
    const interval = setInterval(() => {
      setAisShips(prevShips =>
        prevShips.map(ship => ({
          ...ship,
          latitude: ship.latitude + (Math.random() - 0.5) * 0.01,
          longitude: ship.longitude + (Math.random() - 0.5) * 0.01,
          speed: Math.max(0, ship.speed + (Math.random() - 0.5) * 1),
          lastUpdate: new Date().toISOString(),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-[1000]">
        <div className="text-white">Loading AIS data...</div>
      </div>
    );
  }

  if (error && aisShips.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-[1000]">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  // Calculate center of India
  const indiaCenter: [number, number] = [20.5937, 78.9629];

  return (
    <div className="absolute inset-0 z-[500]">
      <MapContainer
        center={indiaCenter}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        className="ais-overlay-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitIndiaBounds />
        
        {/* AIS Ship markers */}
        {aisShips.map((ship) => (
          <Marker
            key={ship.mmsi}
            position={[ship.latitude, ship.longitude]}
            icon={createAISShipIcon(ship.status)}
          >
            <Popup>
              <ShipPopup 
                ship={ship} 
                onSelect={() => onShipSelect?.(ship)} 
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default AISMapOverlay;


