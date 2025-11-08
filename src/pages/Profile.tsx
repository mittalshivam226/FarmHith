import { User, Phone, Calendar, MapPin, FileText, Settings, Mail } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { useEffect, useState } from 'react';
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

    // TODO: Fetch user's recent bookings from API
    // For now, showing placeholder data
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_process':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        {/* Profile Header */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
              <User size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile?.name || 'User'}!
              </h1>
              <p className="text-lg text-gray-600">
                Manage your account and view your soil testing history
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User size={24} className="text-primary-600" />
                Profile Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <User size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">
                      {profile?.name || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Phone size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-900">
                      {profile?.phone || user.phone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {profile?.email && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Mail size={20} className="text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-semibold text-gray-900">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                )}

                {(profile?.village || profile?.district || profile?.state) && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin size={20} className="text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">
                        {[profile.village, profile.district, profile.state].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(user.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin size={20} className="text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="font-semibold text-green-600">Active</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-2 hover-lift">
                <Settings size={20} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={24} className="text-primary-600" />
                Recent Bookings
              </h2>

              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking: BookingItem) => (
                    <div
                      key={booking.id}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 hover-lift"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {booking.packageName}
                          </h3>
                          <p className="text-gray-600">Tracking ID: {booking.trackingId}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {getStatusText(booking.status)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-gray-600">
                          Booked on: {new Date(booking.date).toLocaleDateString('en-IN')}
                        </p>
                        <button
                          onClick={() => navigateTo('reports')}
                          className="text-primary-600 hover:text-primary-700 font-medium hover-lift"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No bookings yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start your first soil test to see your booking history here.
                  </p>
                  <button
                    onClick={() => navigateTo('book-test')}
                    className="bg-primary-600 text-white py-3 px-6 rounded-xl hover:bg-primary-700 transition-all duration-300 hover-lift"
                  >
                    Book Your First Test
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
