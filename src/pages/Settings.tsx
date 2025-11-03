import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Volume2, Map, Ship, Shield, Database, Save, Mic } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import VoiceToTicket from '../components/VoiceToTicket';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  settings: Array<{
    id: string;
    label: string;
    description: string;
    type: 'toggle' | 'select' | 'input' | 'slider';
    value: any;
    options?: Array<{ label: string; value: any }>;
  }>;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingSection[]>([
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          id: 'email_notifications',
          label: 'Email Notifications',
          description: 'Receive email alerts for critical events',
          type: 'toggle',
          value: true,
        },
        {
          id: 'alert_frequency',
          label: 'Alert Frequency',
          description: 'How often to receive alerts',
          type: 'select',
          value: 'immediate',
          options: [
            { label: 'Immediate', value: 'immediate' },
            { label: 'Every 5 minutes', value: '5min' },
            { label: 'Every 15 minutes', value: '15min' },
            { label: 'Hourly', value: 'hourly' },
          ],
        },
        {
          id: 'critical_only',
          label: 'Critical Alerts Only',
          description: 'Only receive notifications for critical alerts',
          type: 'toggle',
          value: false,
        },
      ],
    },
    {
      id: 'voice',
      title: 'Voice Alerts',
      icon: Volume2,
      settings: [
        {
          id: 'voice_enabled',
          label: 'Enable Voice Alerts',
          description: 'Enable continuous voice alerts for new alerts',
          type: 'toggle',
          value: false,
        },
        {
          id: 'voice_volume',
          label: 'Voice Volume',
          description: 'Adjust the volume for voice alerts',
          type: 'slider',
          value: 80,
        },
        {
          id: 'voice_speed',
          label: 'Speech Speed',
          description: 'Adjust the speed of voice alerts',
          type: 'slider',
          value: 1.0,
        },
      ],
    },
    {
      id: 'map',
      title: 'Map Settings',
      icon: Map,
      settings: [
        {
          id: 'auto_zoom',
          label: 'Auto Zoom',
          description: 'Automatically zoom to show all ships',
          type: 'toggle',
          value: true,
        },
        {
          id: 'update_interval',
          label: 'Update Interval',
          description: 'How often to update ship positions on the map',
          type: 'select',
          value: '5s',
          options: [
            { label: 'Real-time (1s)', value: '1s' },
            { label: 'Every 5 seconds', value: '5s' },
            { label: 'Every 10 seconds', value: '10s' },
            { label: 'Every 30 seconds', value: '30s' },
          ],
        },
        {
          id: 'show_alerts_on_map',
          label: 'Show Alerts on Map',
          description: 'Display alert markers on the map',
          type: 'toggle',
          value: true,
        },
      ],
    },
    {
      id: 'ships',
      title: 'Ship Monitoring',
      icon: Ship,
      settings: [
        {
          id: 'ship_filter_default',
          label: 'Default Ship Filter',
          description: 'Default filter to apply when viewing ships',
          type: 'select',
          value: 'all',
          options: [
            { label: 'All Ships', value: 'all' },
            { label: 'Normal Only', value: 'normal' },
            { label: 'Warning Only', value: 'warning' },
            { label: 'Critical Only', value: 'danger' },
          ],
        },
        {
          id: 'ship_refresh_rate',
          label: 'Ship Data Refresh Rate',
          description: 'How often to refresh ship data',
          type: 'select',
          value: '5s',
          options: [
            { label: 'Every 1 second', value: '1s' },
            { label: 'Every 5 seconds', value: '5s' },
            { label: 'Every 10 seconds', value: '10s' },
            { label: 'Every 30 seconds', value: '30s' },
          ],
        },
      ],
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      settings: [
        {
          id: 'session_timeout',
          label: 'Session Timeout',
          description: 'Automatic logout after inactivity',
          type: 'select',
          value: '30min',
          options: [
            { label: '15 minutes', value: '15min' },
            { label: '30 minutes', value: '30min' },
            { label: '1 hour', value: '1h' },
            { label: '2 hours', value: '2h' },
            { label: 'Never', value: 'never' },
          ],
        },
        {
          id: 'two_factor',
          label: 'Two-Factor Authentication',
          description: 'Require 2FA for login',
          type: 'toggle',
          value: false,
        },
      ],
    },
    {
      id: 'data',
      title: 'Data Management',
      icon: Database,
      settings: [
        {
          id: 'data_retention',
          label: 'Data Retention Period',
          description: 'How long to keep historical data',
          type: 'select',
          value: '90d',
          options: [
            { label: '30 days', value: '30d' },
            { label: '60 days', value: '60d' },
            { label: '90 days', value: '90d' },
            { label: '180 days', value: '180d' },
            { label: '1 year', value: '1y' },
          ],
        },
        {
          id: 'auto_backup',
          label: 'Automatic Backup',
          description: 'Automatically backup data daily',
          type: 'toggle',
          value: true,
        },
      ],
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (sectionId: string, settingId: string, value: any) => {
    setSettings(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              settings: section.settings.map(setting =>
                setting.id === settingId ? { ...setting, value } : setting
              ),
            }
          : section
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend/localStorage
    console.log('Saving settings...', settings);
    setHasChanges(false);
    // Show success message
    alert('Settings saved successfully!');
  };

  const renderSettingControl = (setting: SettingSection['settings'][0], sectionId: string) => {
    switch (setting.type) {
      case 'toggle':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-aqua-blue"></div>
          </label>
        );

      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-aqua-blue"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'input':
        return (
          <input
            type="text"
            value={setting.value}
            onChange={(e) => handleSettingChange(sectionId, setting.id, e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-aqua-blue"
          />
        );

      case 'slider':
        return (
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max={setting.id === 'voice_volume' ? 100 : 2}
              step={setting.id === 'voice_volume' ? 1 : 0.1}
              value={setting.value}
              onChange={(e) => handleSettingChange(sectionId, setting.id, parseFloat(e.target.value))}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-white text-sm w-12 text-right">{setting.value}{setting.id === 'voice_volume' ? '%' : 'x'}</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, #8b5cf6, #3baed9)' }}>
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white glow-text">Settings</h2>
            <p className="text-sm text-text-secondary">Configure your system preferences</p>
          </div>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="btn btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settings.map((section) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-white/5">
                <section.icon className="w-5 h-5 text-aqua-blue" />
              </div>
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
            </div>

            <div className="space-y-6">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex items-start justify-between gap-4 pb-6 border-b border-white/10 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-white font-medium">{setting.label}</label>
                    </div>
                    <p className="text-sm text-text-secondary">{setting.description}</p>
                  </div>
                  <div className="flex items-center">
                    {renderSettingControl(setting, section.id)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Theme Toggle Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Theme</h3>
            <p className="text-sm text-text-secondary">Switch between light and dark themes</p>
          </div>
          <ThemeToggle />
        </div>
      </motion.div>

      {/* Voice to Ticket Generator Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/5">
            <Mic className="w-5 h-5 text-aqua-blue" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Voice to Ticket Generator</h3>
            <p className="text-sm text-text-secondary">Create tickets using voice commands</p>
          </div>
        </div>
        
        <VoiceToTicket
          onTicketCreate={(ticket) => {
            // Trigger notification when ticket is created
            if (typeof window !== 'undefined' && (window as any).addAISNotification) {
              (window as any).addAISNotification({
                type: 'ticket',
                title: 'New Ticket Created',
                message: ticket.description,
                severity: 'medium' as const,
              });
            }
          }}
        />
      </motion.div>
    </div>
  );
};

export default SettingsPage;

