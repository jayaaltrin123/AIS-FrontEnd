import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, User, Ship, AlertTriangle, Settings, Filter, Download } from 'lucide-react';

interface ActivityLog {
  id: string;
  type: 'alert' | 'ship' | 'system' | 'user';
  action: string;
  description: string;
  user?: string;
  timestamp: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
}

// Mock data generator
const generateMockActivities = (): ActivityLog[] => {
  const actions = [
    'Alert created', 'Alert acknowledged', 'Alert resolved',
    'Ship detected', 'Ship updated', 'Ship status changed',
    'System update', 'Settings changed', 'User login',
    'Report generated', 'Data exported', 'Map view changed'
  ];

  const types: ActivityLog['type'][] = ['alert', 'ship', 'system', 'user'];
  const severities: ActivityLog['severity'][] = ['info', 'warning', 'error', 'success'];

  return Array.from({ length: 50 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: `activity-${i}`,
      type,
      action,
      description: `${action} at ${new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleString()}`,
      user: Math.random() > 0.5 ? 'Admin User' : 'Operator',
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      severity,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityLog[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | ActivityLog['type']>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | ActivityLog['severity']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const mockActivities = generateMockActivities();
    setActivities(mockActivities);
    setFilteredActivities(mockActivities);
  }, []);

  // Simulate real-time activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newActivity: ActivityLog = {
          id: `activity-${Date.now()}`,
          type: ['alert', 'ship', 'system'][Math.floor(Math.random() * 3)] as any,
          action: 'System update',
          description: 'New activity detected in the system',
          user: 'System',
          timestamp: new Date().toISOString(),
          severity: 'info',
        };
        
        const updated = [newActivity, ...activities].slice(0, 50);
        setActivities(updated);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activities]);

  // Filter activities
  useEffect(() => {
    let filtered = activities;

    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.user?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(activity => activity.type === selectedType);
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(activity => activity.severity === selectedSeverity);
    }

    setFilteredActivities(filtered);
  }, [searchQuery, selectedType, selectedSeverity, activities]);

  const getTypeIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'ship': return <Ship className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: ActivityLog['type']) => {
    switch (type) {
      case 'alert': return 'text-danger-red';
      case 'ship': return 'text-aqua-blue';
      case 'system': return 'text-warning-orange';
      case 'user': return 'text-success-green';
    }
  };

  const getSeverityColor = (severity?: ActivityLog['severity']) => {
    switch (severity) {
      case 'error': return 'bg-danger-red';
      case 'warning': return 'bg-warning-orange';
      case 'success': return 'bg-success-green';
      default: return 'bg-aqua-blue';
    }
  };

  const handleExport = () => {
    // In a real app, this would export to CSV/JSON
    console.log('Exporting activity log...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3baed9)' }}>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white glow-text">Activity Log</h2>
            <p className="text-sm text-text-secondary">Track all system activities and events</p>
          </div>
        </div>
        <button
          onClick={handleExport}
          className="btn btn-secondary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-aqua-blue"
          >
            <option value="all">All Types</option>
            <option value="alert">Alerts</option>
            <option value="ship">Ships</option>
            <option value="system">System</option>
            <option value="user">User</option>
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-aqua-blue"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Activities ({filteredActivities.length})
        </h3>

        <div className="space-y-4 max-h-[700px] overflow-y-auto">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="flex gap-4 pb-4 border-b border-white/10 last:border-0"
            >
              {/* Timeline indicator */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityColor(activity.severity)} ${getTypeColor(activity.type)}`}>
                  {getTypeIcon(activity.type)}
                </div>
                {index < filteredActivities.length - 1 && (
                  <div className="w-0.5 h-full bg-white/10 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-semibold">{activity.action}</h4>
                    <p className="text-sm text-text-secondary mt-1">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(activity.timestamp).toLocaleString()}</span>
                    </div>
                    {activity.user && (
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <User className="w-3 h-3" />
                        <span>{activity.user}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full bg-white/10 text-text-secondary`}>
                    {activity.type}
                  </span>
                  {activity.severity && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(activity.severity)} text-white`}>
                      {activity.severity}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">No activities found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-aqua-blue">{activities.filter(a => a.type === 'alert').length}</div>
          <div className="text-sm text-text-secondary mt-1">Alert Activities</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-success-green">{activities.filter(a => a.type === 'ship').length}</div>
          <div className="text-sm text-text-secondary mt-1">Ship Activities</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-warning-orange">{activities.filter(a => a.type === 'system').length}</div>
          <div className="text-sm text-text-secondary mt-1">System Activities</div>
        </div>
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{activities.filter(a => a.type === 'user').length}</div>
          <div className="text-sm text-text-secondary mt-1">User Activities</div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;


