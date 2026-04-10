import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Beaker, Leaf, ShoppingBag, User, Plus, X, ChevronRight, MapPin,
  Package, CheckCircle, Clock, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  listSoilRequests, createSoilRequest,
  type SoilRequest
} from '../../services/soil';
import {
  listListings, createListing, listMyOrders,
  type ResidueListing, type ResidueOrder
} from '../../services/marketplace';

type Tab = 'soil' | 'listings' | 'orders' | 'profile';

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-slate-100 text-slate-700', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-accent-100 text-accent-800', icon: RefreshCw },
  in_analysis: { label: 'In Analysis', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  report_ready: { label: 'Report Ready', color: 'bg-primary-100 text-primary-800', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-primary-200 text-primary-900', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: AlertCircle },
  active: { label: 'Active', color: 'bg-primary-100 text-primary-800', icon: CheckCircle },
  reserved: { label: 'Reserved', color: 'bg-accent-100 text-accent-800', icon: Clock },
  sold: { label: 'Sold', color: 'bg-slate-200 text-slate-700', icon: CheckCircle },
  created: { label: 'Created', color: 'bg-accent-100 text-accent-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-primary-100 text-primary-800', icon: CheckCircle },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, color: 'bg-slate-100 text-slate-700', icon: Clock };
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
      <Icon size={12} /> {meta.label}
    </span>
  );
}

function SoilTimeline({ status }: { status: string }) {
  const steps = ['pending', 'accepted', 'in_analysis', 'report_ready', 'completed'];
  const currentIdx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className={`w-2.5 h-2.5 rounded-full transition-all ${i <= currentIdx ? 'bg-primary-600' : 'bg-primary-100'}`} />
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-6 ${i < currentIdx ? 'bg-primary-400' : 'bg-primary-100'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function FarmerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('soil');

  // Soil state
  const [soilRequests, setSoilRequests] = useState<SoilRequest[]>([]);
  const [soilLoading, setSoilLoading] = useState(false);
  const [showSoilForm, setShowSoilForm] = useState(false);
  const [soilForm, setSoilForm] = useState({ crop_type: '', pickup_type: 'self', notes: '' });
  const [soilSubmitting, setSoilSubmitting] = useState(false);
  const [soilError, setSoilError] = useState('');

  // Listing state
  const [listings, setListings] = useState<ResidueListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [showListingForm, setShowListingForm] = useState(false);
  const [listingForm, setListingForm] = useState({ residue_type: '', quantity_tons: '', price_per_ton: '', location_text: '', description: '' });
  const [listingSubmitting, setListingSubmitting] = useState(false);
  const [listingError, setListingError] = useState('');

  // Orders state
  const [orders, setOrders] = useState<ResidueOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (tab === 'soil') fetchSoilRequests();
    else if (tab === 'listings') fetchListings();
    else if (tab === 'orders') fetchOrders();
  }, [tab]);

  const fetchSoilRequests = async () => {
    setSoilLoading(true);
    try {
      const data = await listSoilRequests();
      setSoilRequests(data);
    } catch { /* ignore */ }
    finally { setSoilLoading(false); }
  };

  const fetchListings = async () => {
    setListingsLoading(true);
    try {
      const all = await listListings('active');
      setListings(all.filter(l => l.farmer_id === user?.id));
    } catch { /* ignore */ }
    finally { setListingsLoading(false); }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await listMyOrders();
      setOrders(data);
    } catch { /* ignore */ }
    finally { setOrdersLoading(false); }
  };

  const handleCreateSoilRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!soilForm.crop_type.trim()) return;
    setSoilSubmitting(true);
    setSoilError('');
    try {
      const created = await createSoilRequest({
        crop_type: soilForm.crop_type,
        pickup_type: soilForm.pickup_type,
        notes: soilForm.notes || undefined,
      });
      setSoilRequests(prev => [created, ...prev]);
      setShowSoilForm(false);
      setSoilForm({ crop_type: '', pickup_type: 'self', notes: '' });
    } catch (err) {
      setSoilError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setSoilSubmitting(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setListingSubmitting(true);
    setListingError('');
    try {
      const created = await createListing({
        residue_type: listingForm.residue_type,
        quantity_tons: parseFloat(listingForm.quantity_tons),
        price_per_ton: parseFloat(listingForm.price_per_ton),
        location_text: listingForm.location_text,
        description: listingForm.description || undefined,
      });
      setListings(prev => [created, ...prev]);
      setShowListingForm(false);
      setListingForm({ residue_type: '', quantity_tons: '', price_per_ton: '', location_text: '', description: '' });
    } catch (err) {
      setListingError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setListingSubmitting(false);
    }
  };

  const TABS = [
    { id: 'soil' as Tab, label: 'Soil Tests', icon: Beaker },
    { id: 'listings' as Tab, label: 'My Listings', icon: Leaf },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingBag },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden py-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="ambient-orb top-0 left-[-8%] h-72 w-72 bg-primary-300/60" />
        <div className="ambient-orb right-[-7%] bottom-[-12%] h-80 w-80 bg-accent-200/70" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card-hover surface-3d p-5 mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="inline-flex items-center rounded-full bg-primary-50 border border-primary-200 px-3 py-1 text-xs font-semibold text-primary-700 mb-2">
              Farmer Dashboard
            </span>
            <h1 className="text-3xl font-display">Welcome, {user?.name}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/profile')} className="btn-secondary">
              <User size={16} /> Profile
            </button>
            <button onClick={logout} className="btn-secondary text-red-600">
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                tab === id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white/80 border border-primary-100 text-slate-700 hover:bg-primary-50'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Soil Tests Tab */}
        {tab === 'soil' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display">Soil Test Requests</h2>
              <button onClick={() => setShowSoilForm(!showSoilForm)} className="btn-primary">
                {showSoilForm ? <X size={16} /> : <Plus size={16} />}
                {showSoilForm ? 'Cancel' : 'New Request'}
              </button>
            </div>

            {showSoilForm && (
              <form onSubmit={handleCreateSoilRequest} className="card-hover surface-3d p-5 mb-5 space-y-4">
                <h3 className="font-semibold text-slate-900">Submit Soil Test Request</h3>
                {soilError && (
                  <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} /> {soilError}</p>
                )}
                <div>
                  <label className="form-label">Crop Type *</label>
                  <input
                    type="text"
                    required
                    value={soilForm.crop_type}
                    onChange={e => setSoilForm(p => ({ ...p, crop_type: e.target.value }))}
                    className="form-input"
                    placeholder="e.g., Rice, Wheat, Cotton"
                  />
                </div>
                <div>
                  <label className="form-label">Pickup Type</label>
                  <select
                    value={soilForm.pickup_type}
                    onChange={e => setSoilForm(p => ({ ...p, pickup_type: e.target.value }))}
                    className="form-input"
                  >
                    <option value="self">Self Drop</option>
                    <option value="pickup">Field Pickup</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Notes (optional)</label>
                  <textarea
                    rows={2}
                    value={soilForm.notes}
                    onChange={e => setSoilForm(p => ({ ...p, notes: e.target.value }))}
                    className="form-input resize-none"
                    placeholder="Any additional information about the field"
                  />
                </div>
                <button type="submit" disabled={soilSubmitting} className="btn-primary disabled:opacity-70">
                  {soilSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            )}

            {soilLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-700 rounded-full animate-spin" />
              </div>
            ) : soilRequests.length === 0 ? (
              <div className="card-hover surface-3d p-10 text-center">
                <Beaker size={40} className="text-primary-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No soil test requests yet</p>
                <p className="text-sm text-slate-500 mt-1">Create your first request to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {soilRequests.map(req => (
                  <div key={req.id} className="card-hover surface-3d p-5">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{req.crop_type}</p>
                        <p className="text-sm text-slate-500 mt-0.5">Tracking: <span className="font-mono font-semibold text-primary-700">{req.tracking_id}</span></p>
                        <p className="text-xs text-slate-400 mt-0.5">{req.pickup_type === 'pickup' ? 'Field pickup' : 'Self drop'} · {new Date(req.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>
                    <SoilTimeline status={req.status} />
                    {req.notes && (
                      <p className="text-sm text-slate-600 mt-3 bg-slate-50 rounded-lg px-3 py-2">{req.notes}</p>
                    )}
                    <button
                      onClick={() => navigate('/reports')}
                      className="mt-3 text-sm font-semibold text-primary-700 hover:underline inline-flex items-center gap-1"
                    >
                      View Report <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Listings Tab */}
        {tab === 'listings' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display">My Residue Listings</h2>
              <button onClick={() => setShowListingForm(!showListingForm)} className="btn-primary">
                {showListingForm ? <X size={16} /> : <Plus size={16} />}
                {showListingForm ? 'Cancel' : 'New Listing'}
              </button>
            </div>

            {showListingForm && (
              <form onSubmit={handleCreateListing} className="card-hover surface-3d p-5 mb-5 space-y-4">
                <h3 className="font-semibold text-slate-900">Create Residue Listing</h3>
                {listingError && (
                  <p className="text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} /> {listingError}</p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Residue Type *</label>
                    <input
                      type="text"
                      required
                      value={listingForm.residue_type}
                      onChange={e => setListingForm(p => ({ ...p, residue_type: e.target.value }))}
                      className="form-input"
                      placeholder="e.g., Rice Husk, Wheat Straw"
                    />
                  </div>
                  <div>
                    <label className="form-label">Location *</label>
                    <input
                      type="text"
                      required
                      value={listingForm.location_text}
                      onChange={e => setListingForm(p => ({ ...p, location_text: e.target.value }))}
                      className="form-input"
                      placeholder="Village, District"
                    />
                  </div>
                  <div>
                    <label className="form-label">Quantity (tons) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={listingForm.quantity_tons}
                      onChange={e => setListingForm(p => ({ ...p, quantity_tons: e.target.value }))}
                      className="form-input"
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <label className="form-label">Price per ton (₹) *</label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      required
                      value={listingForm.price_per_ton}
                      onChange={e => setListingForm(p => ({ ...p, price_per_ton: e.target.value }))}
                      className="form-input"
                      placeholder="e.g., 1500"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Description (optional)</label>
                  <textarea
                    rows={2}
                    value={listingForm.description}
                    onChange={e => setListingForm(p => ({ ...p, description: e.target.value }))}
                    className="form-input resize-none"
                    placeholder="Quality notes, availability window, etc."
                  />
                </div>
                <button type="submit" disabled={listingSubmitting} className="btn-primary disabled:opacity-70">
                  {listingSubmitting ? 'Posting...' : 'Post Listing'}
                </button>
              </form>
            )}

            {listingsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-700 rounded-full animate-spin" />
              </div>
            ) : listings.length === 0 ? (
              <div className="card-hover surface-3d p-10 text-center">
                <Leaf size={40} className="text-primary-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No listings yet</p>
                <p className="text-sm text-slate-500 mt-1">Post your first crop residue listing to attract buyers</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {listings.map(listing => (
                  <div key={listing.id} className="card-hover surface-3d p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">{listing.residue_type}</p>
                        <p className="text-sm text-slate-500 mt-1 inline-flex items-center gap-1">
                          <MapPin size={12} /> {listing.location_text}
                        </p>
                      </div>
                      <StatusBadge status={listing.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-lg bg-primary-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Quantity</p>
                        <p className="font-semibold text-slate-900">{listing.quantity_tons} tons</p>
                      </div>
                      <div className="rounded-lg bg-accent-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="font-semibold text-slate-900">₹{listing.price_per_ton}/ton</p>
                      </div>
                    </div>
                    {listing.description && (
                      <p className="text-sm text-slate-600 mt-3">{listing.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-2xl font-display mb-4">Order History</h2>
            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-700 rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="card-hover surface-3d p-10 text-center">
                <Package size={40} className="text-primary-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No orders yet</p>
                <p className="text-sm text-slate-500 mt-1">Orders from buyers will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="card-hover surface-3d p-5 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-slate-900">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-slate-500 mt-1">{order.ordered_quantity_tons} tons · ₹{order.total_amount_inr.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile tab — redirect */}
        {tab === 'profile' && (
          <div className="card-hover surface-3d p-10 text-center">
            <User size={40} className="text-primary-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">Profile & Settings</p>
            <button onClick={() => navigate('/profile')} className="btn-primary mt-4">
              Open Profile Page <ChevronRight size={14} className="inline" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
