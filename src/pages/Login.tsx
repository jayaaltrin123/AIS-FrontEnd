import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, Ship, Info } from 'lucide-react';
import { authService } from '../utils/auth';

interface LoginProps {
  onNavigate?: (view: string) => void;
  onSuccess?: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      onNavigate?.('dashboard');
    }
  }, [onNavigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Authenticate user
    const result = authService.login({ email, password });

    setIsLoading(false);

    if (result.success && result.user) {
      onNavigate?.('dashboard');
      onSuccess?.(result.user);
    } else {
      setErrors({ general: result.message });
    }
  };

  const fillDemoCredentials = (type: 'admin' | 'operator') => {
    const demos = authService.getDemoCredentials();
    if (type === 'admin') {
      setEmail(demos.admin.email);
      setPassword(demos.admin.password);
    } else {
      setEmail(demos.operator.email);
      setPassword(demos.operator.password);
    }
    setShowDemoCredentials(false);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8" 
      style={{ 
        background: 'var(--ocean-gradient)',
        minHeight: '100vh'
      }}
    >
      {/* Centered Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full"
        style={{
          maxWidth: '420px',
          width: '100%'
        }}
      >
        {/* Card Container with Shadow */}
        <div 
          className="relative rounded-2xl overflow-hidden"
          style={{
            padding: '2px',
            background: 'linear-gradient(135deg, rgba(59, 174, 217, 0.4), rgba(91, 192, 222, 0.4))',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            width: '100%'
          }}
        >
          {/* Inner Card */}
          <div 
            className="rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(27, 38, 59, 0.98))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'auto'
            }}
          >
          {/* Logo and Header */}
          <div className="text-center mb-6" style={{ flexShrink: 0 }}>
            <div className="flex flex-col items-center gap-3 mb-4">
              <div 
                className="bg-gradient-to-br from-aqua-blue to-aqua-light rounded-xl flex items-center justify-center" 
                style={{
                  width: '60px',
                  height: '60px',
                  boxShadow: '0 4px 20px rgba(59, 174, 217, 0.4)'
                }}
              >
                <Ship className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white glow-text mb-1.5">AIS OilGuard</h1>
                <p className="text-text-secondary text-sm font-normal">Sign in to your account</p>
              </div>
            </div>
          </div>

          {/* Demo Credentials Info */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 bg-aqua-blue/10 border border-aqua-blue/20 rounded-xl backdrop-blur-sm"
            style={{ flexShrink: 0 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-aqua-blue" />
                <span className="text-sm font-medium text-white">Demo Credentials</span>
              </div>
              <button
                onClick={() => setShowDemoCredentials(!showDemoCredentials)}
                className="text-xs text-aqua-blue hover:text-aqua-light transition-colors"
              >
                {showDemoCredentials ? 'Hide' : 'Show'}
              </button>
            </div>
            {showDemoCredentials && (
              <div className="space-y-2 text-xs text-text-secondary">
                <div>
                  <strong className="text-white">Admin:</strong> admin@oilguard.com / admin123
                </div>
                <div>
                  <strong className="text-white">Operator:</strong> operator@oilguard.com / operator123
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => fillDemoCredentials('admin')}
                    className="px-3 py-1 bg-aqua-blue/20 text-aqua-blue rounded hover:bg-aqua-blue/30 transition-colors text-xs"
                  >
                    Fill Admin
                  </button>
                  <button
                    onClick={() => fillDemoCredentials('operator')}
                    className="px-3 py-1 bg-aqua-blue/20 text-aqua-blue rounded hover:bg-aqua-blue/30 transition-colors text-xs"
                  >
                    Fill Operator
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-danger-red/20 border border-danger-red/30 rounded-xl backdrop-blur-sm"
              style={{ flexShrink: 0 }}
            >
              <p className="text-sm text-danger-red font-medium">{errors.general}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
            {/* Email Field */}
            <div style={{ flexShrink: 0 }}>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-secondary" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                    errors.email ? 'border-danger-red' : 'border-white/10'
                  } rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-2 focus:ring-aqua-blue/20 transition-all text-sm`}
                  placeholder="Enter your email"
                  style={{ height: '48px' }}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-danger-red font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div style={{ flexShrink: 0 }}>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-secondary" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${
                    errors.password ? 'border-danger-red' : 'border-white/10'
                  } rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-2 focus:ring-aqua-blue/20 transition-all text-sm`}
                  placeholder="Enter your password"
                  style={{ height: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-text-secondary hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-text-secondary hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-danger-red font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between" style={{ flexShrink: 0, marginTop: '-0.25rem' }}>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-white/5 border-white/10 rounded text-aqua-blue focus:ring-aqua-blue focus:ring-2"
                />
                <span className="ml-2 text-xs text-text-secondary font-normal">Remember me</span>
              </label>
              <button 
                type="button" 
                className="text-xs text-aqua-blue hover:text-aqua-light transition-colors bg-transparent border-none cursor-pointer font-medium"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all mt-2"
              style={{
                background: 'linear-gradient(135deg, var(--aqua-blue), var(--aqua-light))',
                boxShadow: '0 4px 15px rgba(59, 174, 217, 0.3)',
                height: '48px',
                flexShrink: 0
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center" style={{ flexShrink: 0 }}>
            <p className="text-text-secondary text-sm font-normal">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate?.('register')}
                className="text-aqua-blue hover:text-aqua-light font-semibold transition-colors bg-transparent border-none cursor-pointer"
                style={{ marginLeft: '4px' }}
              >
                Sign up
              </button>
            </p>
          </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

