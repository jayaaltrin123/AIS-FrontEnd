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
      className="min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8 relative" 
      style={{ 
        background: 'var(--ocean-gradient)',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: 'linear-gradient(135deg, rgba(59, 174, 217, 0.3), rgba(91, 192, 222, 0.3))',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, Math.random() * 50 - 25, 0],
              y: [0, Math.random() * 50 - 25, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Centered Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full relative z-10"
        style={{
          maxWidth: '600px',
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
          <motion.div 
            className="text-center mb-8" 
            style={{ flexShrink: 0 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex flex-col items-center gap-4 mb-4">
              <motion.div 
                className="bg-gradient-to-br from-aqua-blue to-aqua-light rounded-2xl flex items-center justify-center" 
                style={{
                  width: '80px',
                  height: '80px',
                  boxShadow: '0 8px 30px rgba(59, 174, 217, 0.5)'
                }}
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Ship className="w-10 h-10 text-white" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-white glow-text mb-2">AIS OilGuard</h1>
                <p className="text-text-secondary text-base font-normal">Sign in to your account</p>
              </motion.div>
            </div>
          </motion.div>

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
            <motion.div 
              style={{ flexShrink: 0 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="email" className="block text-base font-medium text-white mb-3">
                Email Address
              </label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none z-10"
                  style={{ width: '56px' }}
                >
                  <Mail className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full max-w-sm pl-12 pr-4 py-3 bg-white/10 border ${
                      errors.email ? 'border-red-500' : 'border-white/20'
                    } rounded-2xl text-white placeholder-gray-300 
                    focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 
                    transition-all duration-300 hover:bg-white/15 shadow-sm flex items-center`}
                    placeholder="Enter your email"
                    style={{
                      fontSize: '16px',
                      height: '56px',
                      width: '320px',
                    }}
                  />

              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 text-sm text-danger-red font-medium"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div 
              style={{ flexShrink: 0 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="password" className="block text-base font-medium text-white mb-3">
                Password
              </label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none z-10"
                  style={{ width: '56px' }}
                >
                  <Lock className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full max-w-sm pl-12 pr-4 py-3 bg-white/10 border ${
                      errors.password ? 'border-red-500' : 'border-white/20'
                    } rounded-2xl text-white placeholder-gray-300 
                    focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 
                    transition-all duration-300 hover:bg-white/15 shadow-sm flex items-center`}
                    placeholder="Enter your password"
                    style={{
                      fontSize: '16px',
                      height: '56px',
                      width: '320px',
                    }}
                  />

                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center z-10"
                  style={{ width: '56px' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-text-secondary hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-secondary hover:text-white transition-colors" />
                  )}
                </motion.button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 text-sm text-danger-red font-medium"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

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
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl font-semibold shadow-xl text-base text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--aqua-blue), var(--aqua-light))',
                boxShadow: '0 8px 25px rgba(59, 174, 217, 0.4)',
                height: '64px',
                flexShrink: 0
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: '0 12px 35px rgba(59, 174, 217, 0.6)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
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

