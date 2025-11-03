import React from 'react';
import { 
  Ship, 
  AlertTriangle, 
  Droplets, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Statistics } from '../types';

interface StatisticsCardsProps {
  statistics: Statistics;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics }) => {
  const cards = [
    {
      title: 'Total Ships Tracked',
      value: statistics.totalShips.toLocaleString(),
      icon: Ship,
      color: 'linear-gradient(135deg, #3baed9, #5bc0de)',
      change: '+12%',
      trend: 'up' as const,
      description: 'Active vessels in monitoring area'
    },
    {
      title: 'Active Alerts',
      value: statistics.activeAlerts.toString(),
      icon: AlertTriangle,
      color: 'linear-gradient(135deg, #f77f00, #e63946)',
      change: '-3%',
      trend: 'down' as const,
      description: 'Critical alerts requiring attention'
    },
    {
      title: 'Oil Spill Risks',
      value: statistics.oilSpillRisks.toString(),
      icon: Droplets,
      color: 'linear-gradient(135deg, #e63946, #d62828)',
      change: '+1',
      trend: 'up' as const,
      description: 'Potential environmental threats'
    },
    {
      title: 'Last 24h Incidents',
      value: statistics.last24hIncidents.toString(),
      icon: Clock,
      color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      change: '0%',
      trend: 'neutral' as const,
      description: 'Recent security events'
    }
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6 hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg" style={{ background: card.color }}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1">
              {card.trend === 'up' && <TrendingUp className="w-4 h-4 text-success-green" />}
              {card.trend === 'down' && <TrendingDown className="w-4 h-4 text-danger-red" />}
              <span className={`text-sm font-medium ${
                card.trend === 'up' ? 'text-success-green' : 
                card.trend === 'down' ? 'text-danger-red' : 
                'text-text-secondary'
              }`}>
                {card.change}
              </span>
            </div>
          </div>
          
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-white mb-1">
              {card.value}
            </h3>
            <p className="text-sm text-text-secondary">
              {card.title}
            </p>
          </div>
          
          <p className="text-xs text-text-muted">
            {card.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default StatisticsCards;
