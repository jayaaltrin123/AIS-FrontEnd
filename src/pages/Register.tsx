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
                <p className="text-text-secondary text-sm font-normal">Create a new account</p>
              </div>
            </div>
          </div>

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
            <div style={{ flexShrink: 0 }}>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-text-secondary" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border ${
                    errors.name ? 'border-danger-red' : 'border-white/10'
                  } rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-2 focus:ring-aqua-blue/20 transition-all text-sm`}
                  placeholder="Enter your full name"
                  style={{ height: '48px' }}
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs text-danger-red font-medium">{errors.name}</p>
              )}
            </div>

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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${
                    errors.password ? 'border-danger-red' : 'border-white/10'
                  } rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-2 focus:ring-aqua-blue/20 transition-all text-sm`}
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div style={{ flexShrink: 0 }}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-secondary" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border ${
                    errors.confirmPassword ? 'border-danger-red' : 'border-white/10'
                  } rounded-xl text-white placeholder-text-secondary focus:outline-none focus:border-aqua-blue focus:ring-2 focus:ring-aqua-blue/20 transition-all text-sm`}
                  placeholder="Confirm your password"
                  style={{ height: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-text-secondary hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-4 w-4 text-text-secondary hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-danger-red font-medium">{errors.confirmPassword}</p>
              )}
            </div>

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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
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

