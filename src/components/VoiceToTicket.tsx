import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Send, Loader } from 'lucide-react';

interface VoiceToTicketProps {
  onTicketCreate?: (ticket: { title: string; description: string; timestamp: string }) => void;
}

// Extend Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const VoiceToTicket: React.FC<VoiceToTicketProps> = ({ onTicketCreate }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tickets, setTickets] = useState<Array<{ id: string; title: string; description: string; timestamp: string }>>([]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false; // Stop after user finishes speaking
    recognitionRef.current.interimResults = false; // Only return final results
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript_text = event.results[current][0].transcript;
      setTranscript(transcript_text);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        // User didn't speak, just stop listening
        recognitionRef.current?.stop();
      } else if (event.error === 'aborted') {
        // Recognition was aborted, already stopped
      } else {
        // Other errors - stop recognition
        recognitionRef.current?.stop();
      }
    };

    recognitionRef.current.onend = () => {
      // Automatically stop listening when recognition ends
      setIsListening(false);
      
      // Auto-process if we have transcript
      if (transcript.trim()) {
        handleCreateTicket();
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [transcript]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition not available');
      return;
    }

    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!transcript.trim()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newTicket = {
      id: `ticket-${Date.now()}`,
      title: transcript.substring(0, 50) + (transcript.length > 50 ? '...' : ''),
      description: transcript,
      timestamp: new Date().toISOString(),
    };

    setTickets(prev => [newTicket, ...prev]);
    onTicketCreate?.(newTicket);
    
    setTranscript('');
    setIsProcessing(false);
  };

  const clearTranscript = () => {
    setTranscript('');
    if (isListening) {
      stopListening();
    }
  };

  return (
    <div className="voice-to-ticket-container">
      {/* Voice Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-4"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-lg ${isListening ? 'bg-danger-red/20 animate-pulse' : 'bg-aqua-blue/20'}`}>
            {isListening ? (
              <MicOff className="w-5 h-5 text-danger-red" />
            ) : (
              <Mic className="w-5 h-5 text-aqua-blue" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Voice to Ticket Generator</h3>
            <p className="text-sm text-text-secondary">
              {isListening ? 'Listening... Speak now' : 'Click to start voice input'}
            </p>
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm font-medium text-white">Transcript:</p>
              <button
                onClick={clearTranscript}
                className="text-text-secondary hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-text-secondary">{transcript}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isListening ? (
            <button
              onClick={startListening}
              className="btn btn-primary flex items-center gap-2 flex-1"
            >
              <Mic className="w-4 h-4" />
              Start Voice Input
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="btn btn-secondary flex items-center gap-2 flex-1"
            >
              <MicOff className="w-4 h-4" />
              Stop Listening
            </button>
          )}

          {transcript && !isProcessing && (
            <button
              onClick={handleCreateTicket}
              className="btn btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Create Ticket
            </button>
          )}

          {isProcessing && (
            <button disabled className="btn btn-secondary flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              Processing...
            </button>
          )}
        </div>

        <p className="text-xs text-text-secondary mt-4">
          Note: Voice recognition automatically stops after you finish speaking.
        </p>
      </motion.div>

      {/* Tickets List */}
      {tickets.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-6"
        >
          <h4 className="text-lg font-semibold text-white mb-4">Created Tickets</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-white font-medium">{ticket.title}</h5>
                    <span className="text-xs text-text-secondary">
                      {new Date(ticket.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{ticket.description}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default VoiceToTicket;


