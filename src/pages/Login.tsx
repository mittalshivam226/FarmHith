import { useState } from 'react';
import { AlertCircle, CheckCircle, Lock, Mail, MapPin, Phone, User } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { sendPhoneOTP, verifyPhoneOTP, createOrUpdateUserProfile } from '../services/auth';
import { logger } from '../utils/logger';
import type { UserProfileFormData } from '../types';

const Login = () => {
  const { navigateTo } = useNavigation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [profileData, setProfileData] = useState<UserProfileFormData>({
    name: '',
    email: '',
    village: '',
    district: '',
    state: '',
    address: '',
    farm_details: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');

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
      setStep('profile');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid OTP';
      setError(errorMessage);
      logger.error('OTP verification error', { error: errorMessage, phone });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createOrUpdateUserProfile(profileData);
      logger.info('Profile created successfully', { phone });
      setSuccess(true);
      setTimeout(() => {
        navigateTo('home');
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      logger.error('Profile creation error', { error: errorMessage, phone });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (field: keyof UserProfileFormData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="ambient-orb top-[-6%] left-[-8%] h-72 w-72 bg-primary-300/60" />
        <div className="ambient-orb right-[-8%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6 items-start">
        <div className="card-hover surface-3d p-6 md:p-8">
          <p className="inline-flex rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-semibold text-primary-700">
            Secure access
          </p>
          <h1 className="mt-4 text-4xl md:text-5xl font-display leading-tight">
            Sign in with phone and start managing your farm workflows.
          </h1>
          <p className="mt-3 text-slate-600">
            OTP verification keeps access simple for farmers while profile details help personalize recommendations.
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
            {[
              { label: 'Step 1', value: 'Phone number' },
              { label: 'Step 2', value: 'OTP verification' },
              { label: 'Step 3', value: 'Profile setup' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-primary-100 bg-[#f8fdf9] p-3">
                <p className="text-primary-700 font-semibold">{item.label}</p>
                <p className="text-slate-600 mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          <button onClick={() => navigateTo('home')} className="btn-secondary mt-6">
            Back to Home
          </button>
        </div>

        <div className="card-hover surface-3d p-6 md:p-8">
          <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
            <Lock size={20} />
          </div>
          <h2 className="text-2xl md:text-3xl mt-4">
            {step === 'phone' ? 'Login with Phone' : step === 'otp' ? 'Verify OTP' : 'Complete Profile'}
          </h2>
          <p className="text-slate-600 mt-2">
            {step === 'phone'
              ? 'Enter your number to receive OTP.'
              : step === 'otp'
              ? 'Check SMS and enter the 6-digit code.'
              : 'A few details help us tailor your experience.'}
          </p>

          <div className="mt-5">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={`h-1.5 flex-1 rounded-full ${step === 'phone' ? 'bg-primary-600' : 'bg-primary-300'}`} />
              <span className={`h-1.5 flex-1 rounded-full ${step === 'otp' ? 'bg-primary-600' : step === 'profile' ? 'bg-primary-300' : 'bg-primary-100'}`} />
              <span className={`h-1.5 flex-1 rounded-full ${step === 'profile' ? 'bg-primary-600' : 'bg-primary-100'}`} />
            </div>
          </div>

          {success && (
            <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-800 text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Login successful. Redirecting to home...
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handleSendOTP} className="mt-6 space-y-4">
              <div>
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-input pl-10"
                    placeholder="+91 9876543210"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-70">
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="mt-6 space-y-4">
              <div>
                <label htmlFor="otp" className="form-label">OTP Code</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="form-input pl-10"
                    placeholder="Enter 6-digit OTP"
                    disabled={isLoading}
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setStep('phone')} className="btn-secondary" disabled={isLoading}>
                  Back
                </button>
                <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-70">
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </form>
          )}

          {step === 'profile' && (
            <form onSubmit={handleCreateProfile} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="form-label">Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="form-input pl-10"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="form-input pl-10"
                    placeholder="Optional email"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="village" className="form-label">Village</label>
                  <input
                    id="village"
                    name="village"
                    type="text"
                    value={profileData.village}
                    onChange={(e) => handleProfileChange('village', e.target.value)}
                    className="form-input"
                    placeholder="Village"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label htmlFor="district" className="form-label">District</label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    value={profileData.district}
                    onChange={(e) => handleProfileChange('district', e.target.value)}
                    className="form-input"
                    placeholder="District"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="state" className="form-label">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={profileData.state}
                  onChange={(e) => handleProfileChange('state', e.target.value)}
                  className="form-input"
                  placeholder="State"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="address" className="form-label">Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={profileData.address}
                    onChange={(e) => handleProfileChange('address', e.target.value)}
                    className="form-input pl-10"
                    placeholder="Optional full address"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="farm_details" className="form-label">Farm Details</label>
                <textarea
                  id="farm_details"
                  name="farm_details"
                  rows={2}
                  value={profileData.farm_details}
                  onChange={(e) => handleProfileChange('farm_details', e.target.value)}
                  className="form-input"
                  placeholder="Optional farm details"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setStep('otp')} className="btn-secondary" disabled={isLoading}>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !profileData.name.trim()}
                  className="btn-primary disabled:opacity-70"
                >
                  {isLoading ? 'Saving...' : 'Complete Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
