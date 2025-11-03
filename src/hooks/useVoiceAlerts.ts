import { useEffect, useRef } from 'react';
import { Alert } from '../types';

interface UseVoiceAlertsProps {
  alerts: Alert[];
  enabled: boolean;
}

export const useVoiceAlerts = ({ alerts, enabled }: UseVoiceAlertsProps) => {
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const announcedAlertIds = useRef<Set<string>>(new Set());
  const isSpeaking = useRef<boolean>(false);
  const alertQueue = useRef<Alert[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        if (speechSynthesis.current) {
          speechSynthesis.current.getVoices();
        }
      };
      loadVoices();
      speechSynthesis.current.onvoiceschanged = loadVoices;
    }
  }, []);

  // Process alert queue - this function is called when new alerts are added
  const processAlertQueue = () => {
    if (!enabled || !speechSynthesis.current || isSpeaking.current) {
      return;
    }

    const processNextAlert = () => {
      if (alertQueue.current.length === 0) {
        isSpeaking.current = false;
        return;
      }

      const alert = alertQueue.current.shift();
      if (!alert) {
        isSpeaking.current = false;
        return;
      }

      isSpeaking.current = true;
      
      const severityEmphasis = alert.severity === 'critical' ? 'CRITICAL ALERT' : 'HIGH PRIORITY ALERT';
      const message = `${severityEmphasis}: ${alert.title}. ${alert.description}${alert.shipMmsi ? ` Ship MMSI: ${alert.shipMmsi}` : ''}`;
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = alert.severity === 'critical' ? 0.85 : 0.9;
      utterance.pitch = alert.severity === 'critical' ? 1.2 : 1.1;
      utterance.volume = 0.9;
      
      // Try to use a more natural voice if available
      const voices = speechSynthesis.current?.getVoices() || [];
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Alex') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        isSpeaking.current = false;
        // Process next alert if any
        if (alertQueue.current.length > 0) {
          setTimeout(processNextAlert, 500);
        }
      };

      utterance.onerror = () => {
        isSpeaking.current = false;
        // Continue processing queue even on error
        if (alertQueue.current.length > 0) {
          setTimeout(processNextAlert, 500);
        }
      };
      
      speechSynthesis.current?.speak(utterance);
    };

    processNextAlert();
  };

  // Monitor alerts continuously
  useEffect(() => {
    if (!enabled || !speechSynthesis.current) {
      // Clear queue when disabled
      alertQueue.current = [];
      announcedAlertIds.current.clear();
      return;
    }

    // Find new alerts that need to be announced
    const newAlerts = alerts.filter(alert => {
      // Only announce active alerts with high or critical severity
      if (alert.status !== 'active') return false;
      if (alert.severity !== 'critical' && alert.severity !== 'high') return false;
      
      // Check if we've already announced this alert
      if (announcedAlertIds.current.has(alert.id)) return false;
      
      return true;
    });

    // Add new alerts to queue and mark as announced
    if (newAlerts.length > 0) {
      newAlerts.forEach(alert => {
        announcedAlertIds.current.add(alert.id);
        alertQueue.current.push(alert);
      });
      // Process the queue when new alerts are added
      processAlertQueue();
    }

    // Clean up old alert IDs to allow re-announcing if status changes
    const activeAlertIds = new Set(alerts.filter(a => a.status === 'active').map(a => a.id));
    announcedAlertIds.current.forEach(id => {
      if (!activeAlertIds.has(id)) {
        announcedAlertIds.current.delete(id);
      }
    });
  }, [alerts, enabled]);

  const speakAlert = (alert: Alert) => {
    if (!speechSynthesis.current) return;
    
    const message = `Alert: ${alert.title}. ${alert.description}`;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    speechSynthesis.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }
  };

  return {
    speakAlert,
    stopSpeaking,
    isSupported: !!speechSynthesis.current,
  };
};
