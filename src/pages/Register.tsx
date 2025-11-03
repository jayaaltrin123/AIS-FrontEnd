import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Ship, CheckCircle, XCircle } from 'lucide-react';
import { authService } from '../utils/auth';

interface RegisterProps {
  onNavigate?: (view: string) => void;
  onSuccess?: (user: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Register user
    const result = authService.register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });

    setIsLoading(false);

    if (result.success && result.user) {
      setSuccess(true);
      setTimeout(() => {
        onNavigate?.('login');
        onSuccess?.(result.user);
      }, 2000);
    } else {
      setErrors({ general: result.message });
    }
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
            className="rounded-2xl overflow-y-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.98), rgba(27, 38, 59, 0.98))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
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
                <p className="text-text-secondary text-base font-normal">Create a new account</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-success-green/20 border border-success-green/30 rounded-xl backdrop-blur-sm flex items-center gap-2"
              style={{ flexShrink: 0 }}
            >
              <CheckCircle className="w-5 h-5 text-success-green flex-shrink-0" />
              <p className="text-sm text-success-green font-medium">Registration successful! Redirecting to login...</p>
            </motion.div>
          )}

          {/* General Error */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 bg-danger-red/20 border border-danger-red/30 rounded-xl backdrop-blur-sm flex items-center gap-2"
              style={{ flexShrink: 0 }}
            >
              <XCircle className="w-5 h-5 text-danger-red flex-shrink-0" />
              <p className="text-sm text-danger-red font-medium">{errors.general}</p>
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5" style={{ overflowY: 'auto' }}>
            {/* Name Field */}
            <motion.div 
              style={{ flexShrink: 0 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="name" className="block text-base font-medium text-white mb-3">
                Full Name
              </label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none z-10"
                  style={{ width: '56px' }}
                >
                  <User className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-14 pr-5 bg-white/8 border-2 ${
                    errors.name ? 'border-danger-red' : 'border-white/15'
                  } rounded-2xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all text-base hover:bg-white/10 flex items-center`}
                  placeholder="Enter your full name"
                  style={{ height: '64px', fontSize: '16px', paddingTop: '0', paddingBottom: '0' }}
                />
              </div>
              {errors.name && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 text-sm text-danger-red font-medium"
                >
                  {errors.name}
                </motion.p>
              )}
            </motion.div>

            {/* Email Field */}
            <motion.div 
              style={{ flexShrink: 0 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-14 pr-5 bg-white/8 border-2 ${
                    errors.email ? 'border-danger-red' : 'border-white/15'
                  } rounded-2xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all text-base hover:bg-white/10 flex items-center`}
                  placeholder="Enter your email"
                  style={{ height: '64px', fontSize: '16px', paddingTop: '0', paddingBottom: '0' }}
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
              transition={{ delay: 0.5 }}
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-14 pr-16 bg-white/8 border-2 ${
                    errors.password ? 'border-danger-red' : 'border-white/15'
                  } rounded-2xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all text-base hover:bg-white/10 flex items-center`}
                  placeholder="Create a password"
                  style={{ height: '64px', fontSize: '16px', paddingTop: '0', paddingBottom: '0' }}
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

            {/* Confirm Password Field */}
            <motion.div 
              style={{ flexShrink: 0 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="confirmPassword" className="block text-base font-medium text-white mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 flex items-center justify-center pointer-events-none z-10"
                  style={{ width: '56px' }}
                >
                  <Lock className="h-5 w-5 text-text-secondary" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-14 pr-16 bg-white/8 border-2 ${
                    errors.confirmPassword ? 'border-danger-red' : 'border-white/15'
                  } rounded-2xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-4 focus:ring-aqua-blue/30 transition-all text-base hover:bg-white/10 flex items-center`}
                  placeholder="Confirm your password"
                  style={{ height: '64px', fontSize: '16px', paddingTop: '0', paddingBottom: '0' }}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center z-10"
                  style={{ width: '56px' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-text-secondary hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-text-secondary hover:text-white transition-colors" />
                  )}
                </motion.button>
              </div>
              {errors.confirmPassword && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 text-sm text-danger-red font-medium"
                >
                  {errors.confirmPassword}
                </motion.p>
              )}
            </motion.div>

            {/* Terms and Conditions */}
            <div className="flex items-center" style={{ flexShrink: 0, marginTop: '-0.25rem' }}>
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 bg-white/5 border-white/10 rounded text-aqua-blue focus:ring-aqua-blue focus:ring-2"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-text-secondary cursor-pointer font-normal">
                I agree to the{' '}
                <button 
                  type="button" 
                  className="text-aqua-blue hover:text-aqua-light bg-transparent border-none cursor-pointer font-medium"
                >
                  Terms and Conditions
                </button>
              </label>
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
              transition={{ delay: 0.7 }}
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center" style={{ flexShrink: 0 }}>
            <p className="text-text-secondary text-sm font-normal">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate?.('login')}
                className="text-aqua-blue hover:text-aqua-light font-semibold transition-colors bg-transparent border-none cursor-pointer"
                style={{ marginLeft: '4px' }}
              >
                Sign in
              </button>
            </p>
          </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

