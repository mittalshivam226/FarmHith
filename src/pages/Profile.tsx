import { Calendar, FileText, Mail, MapPin, Phone, Settings, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { getCurrentUserProfile } from '../services/auth';
import type { UserProfile } from '../types';

interface BookingItem {
  id: string;
  trackingId: string;
  packageName: string;
  status: string;
  date: string;
}

const Profile = () => {
  const { user, isAuthenticated, navigateTo } = useNavigation();
  const [recentBookings, setRecentBookings] = useState<BookingItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo('login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    setRecentBookings([
      {
        id: '1',
        trackingId: 'FH2024001',
        packageName: 'Basic Soil Test',
        status: 'completed',
        date: '2024-01-15',
      },
      {
        id: '2',
        trackingId: 'FH2024002',
        packageName: 'Advanced Soil Test',
        status: 'in_process',
        date: '2024-01-20',
      },
    ]);
  }, [isAuthenticated, navigateTo]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-700 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary-100 text-primary-800';
      case 'in_process':
        return 'bg-accent-100 text-accent-800';
      case 'pending':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_process':
        return 'In Process';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="ambient-orb top-[-8%] left-[-8%] h-72 w-72 bg-primary-300/60" />
        <div className="ambient-orb right-[-9%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-hover surface-3d p-6 md:p-8 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl">Welcome, {profile?.name || 'User'}</h1>
              <p className="text-slate-600 mt-1">Manage your account and review recent activity.</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card-hover surface-3d p-5">
              <h2 className="text-2xl">Profile Information</h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-primary-100 bg-white p-3 flex items-start gap-3">
                  <User size={16} className="text-primary-700 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="text-sm font-semibold text-slate-900">{profile?.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-primary-100 bg-white p-3 flex items-start gap-3">
                  <Phone size={16} className="text-primary-700 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Phone Number</p>
                    <p className="text-sm font-semibold text-slate-900">{profile?.phone || user.phone || 'Not provided'}</p>
                  </div>
                </div>

                {profile?.email && (
                  <div className="rounded-xl border border-primary-100 bg-white p-3 flex items-start gap-3">
                    <Mail size={16} className="text-primary-700 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-semibold text-slate-900">{profile.email}</p>
                    </div>
                  </div>
                )}

                {(profile?.village || profile?.district || profile?.state) && (
                  <div className="rounded-xl border border-primary-100 bg-white p-3 flex items-start gap-3">
                    <MapPin size={16} className="text-primary-700 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {[profile.village, profile.district, profile.state].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="rounded-xl border border-primary-100 bg-white p-3 flex items-start gap-3">
                  <Calendar size={16} className="text-primary-700 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Member Since</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(user.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <button onClick={() => navigateTo('login')} className="btn-primary w-full mt-5">
                <Settings size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card-hover surface-3d p-5">
              <h2 className="text-2xl inline-flex items-center gap-2">
                <FileText size={20} className="text-primary-700" />
                Recent Bookings
              </h2>

              {recentBookings.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => navigateTo('reports')}
                      className="rounded-xl border border-primary-100 bg-white p-4 cursor-pointer hover:border-primary-300 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-slate-900">{booking.packageName}</h3>
                          <p className="text-sm text-slate-600 mt-1">Tracking ID: {booking.trackingId}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-slate-500">
                          Booked on {new Date(booking.date).toLocaleDateString('en-IN')}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateTo('reports');
                          }}
                          className="text-sm font-semibold text-primary-700 hover:underline"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-primary-100 bg-white p-5 text-center">
                  <p className="text-slate-700 font-semibold">No bookings yet</p>
                  <p className="text-sm text-slate-600 mt-1">Start your first soil test to see booking history here.</p>
                  <button onClick={() => navigateTo('book-test')} className="btn-primary mt-4">
                    Book First Test
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
