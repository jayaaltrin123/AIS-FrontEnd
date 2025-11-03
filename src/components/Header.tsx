import React, { useState } from 'react';
import { 
  Map, 
  Ship, 
  AlertTriangle, 
  BarChart3, 
  User, 
  Settings, 
  Menu,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';
import { Alert } from '../types';

interface HeaderProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
  voiceAlertsEnabled?: boolean;
  onVoiceAlertsToggle?: () => void;
  onNavigate?: (view: 'dashboard' | 'reports' | 'map' | 'ships' | 'alerts' | 'activity' | 'settings' | 'login' | 'register') => void;
  alerts?: Alert[];
}

const Header: React.FC<HeaderProps> = ({ 
  onMenuToggle, 
  isMenuOpen, 
  voiceAlertsEnabled = false, 
  onVoiceAlertsToggle,
  onNavigate,
  alerts = []
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', key: 'dashboard', icon: BarChart3, active: true },
    { name: 'Live Map', key: 'map', icon: Map },
    { name: 'Ships', key: 'ships', icon: Ship },
    { name: 'Alerts', key: 'alerts', icon: AlertTriangle },
    { name: 'Reports', key: 'reports', icon: BarChart3 },
  ] as const;

  return (
    <header className="glass-effect border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Mobile Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--aqua-blue), var(--aqua-light))' }}>
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white glow-text">AIS OilGuard</h1>
              <p className="text-xs text-text-secondary">Maritime Monitoring System</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`header-nav-button`}
              onClick={() => onNavigate?.(item.key)}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <NotificationBell alerts={alerts} />

          {/* Voice Alerts Toggle */}
          {onVoiceAlertsToggle && (
            <button
              onClick={onVoiceAlertsToggle}
              className={`p-2 rounded-lg transition-colors ${
                voiceAlertsEnabled 
                  ? 'bg-aqua-blue/20 text-aqua-blue' 
                  : 'hover:bg-white/10'
              }`}
              title={voiceAlertsEnabled ? 'Disable voice alerts' : 'Enable voice alerts'}
            >
              {voiceAlertsEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-aqua-blue to-aqua-light rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-white">
                  {(() => {
                    try {
                      const { authService } = require('../utils/auth');
                      const user = authService.getCurrentUser();
                      return user?.name || 'Guest User';
                    } catch {
                      return 'Admin User';
                    }
                  })()}
                </p>
                <p className="text-xs text-text-secondary">
                  {(() => {
                    try {
                      const { authService } = require('../utils/auth');
                      const user = authService.getCurrentUser();
                      return user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
                    } catch {
                      return 'Administrator';
                    }
                  })()}
                </p>
              </div>
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 glass-effect rounded-lg shadow-lg border border-white/10 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-white">
                      {(() => {
                        try {
                          const { authService } = require('../utils/auth');
                          const user = authService.getCurrentUser();
                          return user?.name || 'Guest User';
                        } catch {
                          return 'Admin User';
                        }
                      })()}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {(() => {
                        try {
                          const { authService } = require('../utils/auth');
                          const user = authService.getCurrentUser();
                          return user?.email || 'guest@oilguard.com';
                        } catch {
                          return 'admin@oilguard.com';
                        }
                      })()}
                    </p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/10 transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/10 transition-colors">
                    Preferences
                  </button>
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <button 
                      onClick={() => {
                        try {
                          const { authService } = require('../utils/auth');
                          authService.logout();
                          if (onNavigate) {
                            onNavigate('login');
                          }
                          window.location.reload();
                        } catch {
                          if (onNavigate) {
                            onNavigate('login');
                          }
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-danger-red hover:bg-white/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
