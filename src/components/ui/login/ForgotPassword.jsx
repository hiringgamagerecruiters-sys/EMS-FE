/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, ShieldCheck, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return setMessage({ text: 'Enter a valid email address', type: 'error' });
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/forgot-password/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setStep(2);
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error', type: 'error' });
      console.error(err);
    }
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return setMessage({ text: 'Enter a valid 6-digit OTP', type: 'error' });

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setStep(3);
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error', type: 'error' });
      console.error(err);
    }
    setLoading(false);
  };

  // Step 3: Reset password
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setMessage({ text: 'Passwords do not match', type: 'error' });
    if (newPassword.length < 6) return setMessage({ text: 'Password must be at least 6 characters', type: 'error' });

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        setMessage({ text: data.message, type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error', type: 'error' });
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0097f9] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#161f2b] to-[#0d1218] p-8 rounded-2xl border border-white/10 shadow-xl w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="bg-[#0097A7]/10 p-3 rounded-full">
            <ShieldCheck className="h-8 w-8 text-[#0097A7]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {step === 1 ? 'Reset Your Password' : step === 2 ? 'Verify OTP' : 'Create New Password'}
        </h2>
        <p className="text-gray-400 text-center mb-6">
          {step === 1 ? 'Enter your email to receive a verification code' : step === 2 ? 'Enter the 6-digit code sent to your registered phone' : 'Enter your new password'}
        </p>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 text-center ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-500" /></div>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="you@example.com" 
                  className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent block w-full pl-10 p-2.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MessageCircle className="h-3 w-3"/> A verification code will be sent to your Email</p>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#0097A7] text-white font-medium rounded-lg px-5 py-2.5 hover:bg-[#008697] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Verification Code'}
            </button>
            <div className="text-center">
              <a href="/login" className="text-[#0097A7] hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="h-4 w-4"/> Back to Login
              </a>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-300 mb-1">Verification Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MessageCircle className="h-5 w-5 text-gray-500"/></div>
                <input 
                  type="text" 
                  id="otp" 
                  placeholder="Enter 6-digit code" 
                  className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent block w-full pl-10 p-2.5 text-center tracking-widest"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                  required 
                  maxLength={6} 
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Sent to  {email}</p>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#0097A7] text-white font-medium rounded-lg px-5 py-2.5 hover:bg-[#008697] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="text-center">
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-[#0097A7] hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="h-4 w-4"/> Change email
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-500"/></div>
                <input 
                  type="password" 
                  id="newPassword" 
                  placeholder="Enter new password" 
                  className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent block w-full pl-10 p-2.5"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                  minLength={6}
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-500"/></div>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  placeholder="Confirm new password" 
                  className="bg-white/5 border border-white/10 text-white rounded-lg focus:ring-2 focus:ring-[#0097A7] focus:border-transparent block w-full pl-10 p-2.5"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  minLength={6}
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-[#0097A7] text-white font-medium rounded-lg px-5 py-2.5 hover:bg-[#008697] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
