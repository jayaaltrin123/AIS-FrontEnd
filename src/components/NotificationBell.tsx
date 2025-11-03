import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Ship, CheckCircle } from 'lucide-react';
import { Alert } from '../types';

interface Notification {
  id: string;
  type: 'alert' | 'ticket' | 'ship' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface NotificationBellProps {
  alerts?: Alert[];
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ alerts = [], onNotificationClick }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [previousAlertsCount, setPreviousAlertsCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Convert alerts to notifications
  useEffect(() => {
    if (!alerts || alerts.length === 0) {
      return;
    }

    // Only add new alerts that haven't been seen before
    const newAlerts = alerts.filter(alert => {
      return !notifications.some(n => n.id === alert.id && n.type === 'alert');
    });

    newAlerts.forEach(alert => {
      if (alert.status === 'active') {
        const notification: Notification = {
          id: `alert-${alert.id}`,
          type: 'alert',
          title: alert.title,
          message: alert.description,
          timestamp: alert.timestamp,
          read: false,
          severity: alert.severity,
        };

        setNotifications(prev => [notification, ...prev]);
      }
    });

    setPreviousAlertsCount(alerts.length);
  }, [alerts]);

  // Add system notifications (e.g., voice-triggered events)
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  // Expose method to add notifications from outside
  useEffect(() => {
    (window as any).addAISNotification = addNotification;
    return () => {
      delete (window as any).addAISNotification;
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );
    onNotificationClick?.(notification);
    setIsOpen(false);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-danger-red" />;
      case 'ship':
        return <Ship className="w-4 h-4 text-aqua-blue" />;
      case 'ticket':
        return <CheckCircle className="w-4 h-4 text-success-green" />;
      default:
        return <Bell className="w-4 h-4 text-warning-orange" />;
    }
  };

  const getSeverityColor = (severity?: Notification['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-danger-red';
      case 'high':
        return 'bg-warning-orange';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
        title="Notifications"
      >
        <Bell size={20} className="text-white" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-danger-red text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-96 glass-effect rounded-lg shadow-lg border border-white/10 py-2 z-50 max-h-[500px] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-aqua-blue hover:text-aqua-light transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-text-secondary hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                    <p className="text-text-secondary">No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          notification.read
                            ? 'hover:bg-white/5'
                            : 'bg-aqua-blue/10 hover:bg-aqua-blue/20'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-white truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-aqua-blue rounded-full flex-shrink-0" />
                              )}
                              {notification.severity && (
                                <span
                                  className={`text-xs px-1.5 py-0.5 rounded ${getSeverityColor(
                                    notification.severity
                                  )} text-white flex-shrink-0`}
                                >
                                  {notification.severity}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-text-muted mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;


