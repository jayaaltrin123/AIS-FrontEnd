import React from 'react';
import { 
  Home, 
  Map, 
  AlertTriangle, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Ship,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentView?: 'dashboard' | 'reports' | 'map' | 'ships' | 'alerts' | 'activity' | 'settings';
  onNavigate?: (view: 'dashboard' | 'reports' | 'map' | 'ships' | 'alerts' | 'activity' | 'settings') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, currentView, onNavigate }) => {
  const menuItems = [
    { name: 'Dashboard', key: 'dashboard', icon: Home },
    { name: 'Live Map', key: 'map', icon: Map },
    { name: 'Ships', key: 'ships', icon: Ship },
    { name: 'Alerts', key: 'alerts', icon: AlertTriangle },
    { name: 'Reports', key: 'reports', icon: BarChart3 },
    { name: 'Activity', key: 'activity', icon: Activity },
    { name: 'Settings', key: 'settings', icon: Settings },
  ] as const;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: isOpen ? 0 : -280,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-full w-72 glass-effect border-r border-white/10 z-50 lg:relative lg:translate-x-0 lg:opacity-100`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-aqua-blue to-aqua-light rounded-lg flex items-center justify-center">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">OilGuard</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <button
                    onClick={() => onNavigate?.(item.key as 'dashboard' | 'reports' | 'map' | 'ships' | 'alerts' | 'activity' | 'settings')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      currentView === item.key
                        ? 'bg-[var(--nav-accent)] text-white shadow-lg'
                        : 'text-text-secondary hover:text-white hover:bg-[var(--nav-accent-soft)] border border-transparent hover:border-[var(--nav-accent)]'
                    }`}
                  >
                    <item.icon 
                      size={20} 
                      className={`transition-transform group-hover:scale-110 ${
                        currentView === item.key ? 'text-white' : 'text-text-secondary group-hover:text-white'
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="glass-effect rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-white">System Status</span>
              </div>
              <p className="text-xs text-text-secondary">
                All systems operational
              </p>
              <div className="mt-2 text-xs text-text-muted">
                Last update: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
