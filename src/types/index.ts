export interface Ship {
  mmsi: string;
  name: string;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  heading: number;
  shipType: string;
  status: 'normal' | 'warning' | 'danger';
  lastUpdate: string;
}

export interface Alert {
  id: string;
  type: 'collision_risk' | 'illegal_discharge' | 'loitering' | 'grounding' | 'anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  shipMmsi?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface Statistics {
  totalShips: number;
  activeAlerts: number;
  oilSpillRisks: number;
  last24hIncidents: number;
}

export interface MapMarker {
  id: string;
  type: 'ship' | 'alert' | 'risk_zone';
  position: [number, number];
  data: Ship | Alert;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'Operator';
  avatar?: string;
}
