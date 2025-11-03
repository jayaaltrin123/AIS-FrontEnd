import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Filter,
  Calendar,
  MapPin,
  Ship,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportsSectionProps {
  className?: string;
}

// Sample data for charts
const dailyRisksData = [
  { date: '2024-01-01', risks: 12, incidents: 3 },
  { date: '2024-01-02', risks: 8, incidents: 1 },
  { date: '2024-01-03', risks: 15, incidents: 4 },
  { date: '2024-01-04', risks: 6, incidents: 2 },
  { date: '2024-01-05', risks: 20, incidents: 5 },
  { date: '2024-01-06', risks: 14, incidents: 3 },
  { date: '2024-01-07', risks: 18, incidents: 6 },
];

const alertTypesData = [
  { name: 'Collision Risk', value: 35, color: '#e63946' },
  { name: 'Illegal Discharge', value: 25, color: '#f77f00' },
  { name: 'Loitering', value: 20, color: '#fbbf24' },
  { name: 'Grounding', value: 15, color: '#06d6a0' },
  { name: 'Other', value: 5, color: '#3baed9' },
];

const topShipsData = [
  { name: 'MV Ocean Star', mmsi: '123456789', alerts: 12, risk: 'High' },
  { name: 'SS Maritime', mmsi: '987654321', alerts: 8, risk: 'Medium' },
  { name: 'FV Sea Breeze', mmsi: '456789123', alerts: 6, risk: 'Medium' },
  { name: 'MV Blue Wave', mmsi: '789123456', alerts: 4, risk: 'Low' },
  { name: 'SS Horizon', mmsi: '321654987', alerts: 3, risk: 'Low' },
];

const riskZonesData = [
  { zone: 'North Atlantic', risks: 45, ships: 120 },
  { zone: 'Mediterranean', risks: 32, ships: 85 },
  { zone: 'Caribbean', risks: 28, ships: 65 },
  { zone: 'South Pacific', risks: 22, ships: 45 },
  { zone: 'Indian Ocean', risks: 18, ships: 38 },
];

const ReportsSection: React.FC<ReportsSectionProps> = ({ className = '' }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedChart, setSelectedChart] = useState('risks');

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a PDF/CSV report
    console.log('Downloading report...');
  };

  // Recharts Pie label renderer: percent may be undefined in types, so guard it
  const renderAlertTypeLabel = (props: any) => {
    const percent: number = typeof props?.percent === 'number' ? props.percent : 0;
    return `${Math.round(percent * 100)}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3baed9)' }}>
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
            <p className="text-sm text-text-secondary">Risk patterns and vessel behavior analysis</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-transparent text-sm text-text-secondary border border-white/20 rounded px-3 py-2"
          >
            <option value="24h">Last 24h</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={handleDownloadReport}
            className="btn btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Risks Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Daily Risk Trends</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedChart('risks')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedChart === 'risks' 
                    ? 'bg-aqua-blue text-white' 
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Risks
              </button>
              <button
                onClick={() => setSelectedChart('incidents')}
                className={`px-3 py-1 rounded text-sm ${
                  selectedChart === 'incidents' 
                    ? 'bg-aqua-blue text-white' 
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Incidents
              </button>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyRisksData}>
              <defs>
                <linearGradient id="colorRisks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3baed9" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3baed9" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="var(--text-secondary)"
                fontSize={12}
                tick={{ fill: 'var(--text-secondary)' }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                stroke="var(--text-secondary)" 
                fontSize={12}
                tick={{ fill: 'var(--text-secondary)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--navy-medium)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedChart}
                stroke="#3baed9"
                fillOpacity={1}
                fill="url(#colorRisks)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Alert Types Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Alert Types Distribution</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertTypesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={renderAlertTypeLabel}
                labelLine={false}
              >
                {alertTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--navy-medium)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="mt-4 space-y-2">
            {alertTypesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text-secondary">{item.name}</span>
                </div>
                <span className="text-white font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Risk Ships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Ship className="w-5 h-5 text-aqua-blue" />
            <h3 className="text-lg font-semibold text-white">Top Risk Vessels</h3>
          </div>
          
          <div className="space-y-3">
            {topShipsData.map((ship, index) => (
              <div key={ship.mmsi} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, var(--aqua-blue), var(--aqua-light))' }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{ship.name}</p>
                    <p className="text-xs text-text-secondary">MMSI: {ship.mmsi}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{ship.alerts} alerts</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ship.risk === 'High' ? 'bg-danger-red text-white' :
                    ship.risk === 'Medium' ? 'bg-warning-orange text-white' :
                    'bg-success-green text-white'
                  }`}>
                    {ship.risk}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risk Zones Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-aqua-blue" />
            <h3 className="text-lg font-semibold text-white">Risk Zones Overview</h3>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={riskZonesData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                type="number" 
                stroke="var(--text-secondary)" 
                fontSize={12}
                tick={{ fill: 'var(--text-secondary)' }}
              />
              <YAxis 
                dataKey="zone" 
                type="category" 
                stroke="var(--text-secondary)" 
                fontSize={12}
                width={120}
                tick={{ fill: 'var(--text-secondary)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--navy-medium)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
              <Bar 
                dataKey="risks" 
                fill="var(--danger-red)" 
                radius={[0, 4, 4, 0]}
                name="Risk Count"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Period Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-aqua-blue">156</div>
            <div className="text-sm text-text-secondary">Total Risks Detected</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-warning-orange">23</div>
            <div className="text-sm text-text-secondary">Active Incidents</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-danger-red">8</div>
            <div className="text-sm text-text-secondary">Critical Alerts</div>
          </div>
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-success-green">89%</div>
            <div className="text-sm text-text-secondary">Response Rate</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportsSection;
