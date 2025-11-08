import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { sendPhoneOTP, verifyPhoneOTP } from '../services/auth';
import { logger } from '../utils/logger';
import { Lock, Phone, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const { navigateTo } = useNavigation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await sendPhoneOTP({ phone });
      logger.info('OTP sent successfully', { phone });
      setStep('otp');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send OTP';
      setError(errorMessage);
      logger.error('OTP send error', { error: errorMessage, phone });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await verifyPhoneOTP({ phone, otp });
      logger.info('OTP verification successful', { phone });
      setSuccess(true);
      setTimeout(() => {
        navigateTo('home');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';
      setError(errorMessage);
      logger.error('OTP verification error', { error: errorMessage, phone });
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
            <Lock size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'otp' ? 'Verify OTP' : 'User Login'}
          </h2>
          <p className="text-gray-600">
            {step === 'otp' ? 'Enter the OTP sent to your phone' : 'Sign in to your account'}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle size={20} className="text-green-600" />
              <span className="text-green-800 font-medium">Login successful! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="+91 9876543210"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <div className="relative">
                  <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                    placeholder="Enter 6-digit OTP"
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            </form>
          )}



          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => navigateTo('home')}
              className="block text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
