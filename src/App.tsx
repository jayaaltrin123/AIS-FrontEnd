import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Ships from './pages/Ships';
import Alerts from './pages/Alerts';
import ActivityPage from './pages/Activity';
import SettingsPage from './pages/Settings';
import MapPage from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportsSection from './components/ReportsSection';
import { useVoiceAlerts } from './hooks/useVoiceAlerts';
import { Alert } from './types';
import './styles/globals.css';

type ViewType = 'dashboard' | 'reports' | 'map' | 'ships' | 'alerts' | 'activity' | 'settings' | 'login' | 'register';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [voiceAlertsEnabled, setVoiceAlertsEnabled] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    // Check if user is authenticated on app load
    const { authService } = require('./utils/auth');
    return authService.isAuthenticated() ? 'dashboard' : 'login';
  });

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleVoiceAlertsToggle = () => {
    setVoiceAlertsEnabled(!voiceAlertsEnabled);
  };

  // Use voice alerts hook - enhanced for continuous monitoring
  useVoiceAlerts({ alerts, enabled: voiceAlertsEnabled });

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onAlertsUpdate={setAlerts} onNavigate={(view) => setCurrentView(view as ViewType)} />;
      case 'ships':
        return <Ships />;
      case 'alerts':
        return <Alerts alerts={alerts} onAlertsUpdate={setAlerts} />;
      case 'map':
        return <MapPage voiceAlertsEnabled={voiceAlertsEnabled} onAlertsUpdate={setAlerts} />;
      case 'reports':
        return (
          <div className="p-6">
            <ReportsSection />
          </div>
        );
      case 'activity':
        return <ActivityPage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return (
          <Login 
            onNavigate={(view) => setCurrentView(view as ViewType)} 
            onSuccess={(user) => {
              setCurrentUser(user);
              setCurrentView('dashboard');
            }}
          />
        );
      case 'register':
        return (
          <Register 
            onNavigate={(view) => setCurrentView(view as ViewType)} 
            onSuccess={(user) => {
              setCurrentUser(user);
            }}
          />
        );
      default:
        return <Dashboard onAlertsUpdate={setAlerts} onNavigate={(view) => setCurrentView(view as ViewType)} />;
    }
  };

  // Don't show header/sidebar for login and register pages
  const showLayout = currentView !== 'login' && currentView !== 'register';

  return (
    <div className="min-h-screen" style={{ background: 'var(--ocean-gradient)' }}>
      {showLayout && (
        <>
          {/* Header */}
          <Header 
            onMenuToggle={handleMenuToggle} 
            isMenuOpen={isSidebarOpen}
            voiceAlertsEnabled={voiceAlertsEnabled}
            onVoiceAlertsToggle={handleVoiceAlertsToggle}
            onNavigate={(view) => setCurrentView(view as ViewType)}
            alerts={alerts}
          />
          
          <div className="flex">
            {/* Sidebar */}
            <Sidebar 
              isOpen={isSidebarOpen} 
              onToggle={handleMenuToggle} 
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view as ViewType)}
            />
            
            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${
              isSidebarOpen ? 'lg:ml-0' : 'lg:ml-0'
            }`}>
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderView()}
              </motion.div>
            </main>
          </div>
        </>
      )}
      
      {/* Login/Register pages render without layout */}
      {!showLayout && (
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      )}
    </div>
  );
}

export default App;