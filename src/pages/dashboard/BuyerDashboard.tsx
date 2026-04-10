import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Leaf, ShoppingBag, MapPin, User, Plus, CheckCircle, Clock,
  AlertCircle, Search, Package, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  listListings, createOrder, listMyOrders,
  type ResidueListing, type ResidueOrder
} from '../../services/marketplace';

type Tab = 'browse' | 'orders';

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  active: { label: 'Active', color: 'bg-primary-100 text-primary-800', icon: CheckCircle },
  reserved: { label: 'Reserved', color: 'bg-accent-100 text-accent-800', icon: Clock },
  sold: { label: 'Sold', color: 'bg-slate-200 text-slate-700', icon: CheckCircle },
  created: { label: 'Order Placed', color: 'bg-accent-100 text-accent-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-primary-100 text-primary-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: AlertCircle },
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

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('browse');
  const [listings, setListings] = useState<ResidueListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<ResidueListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<ResidueOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Order form state
  const [orderingListingId, setOrderingListingId] = useState<string | null>(null);
  const [orderQty, setOrderQty] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');

  useEffect(() => {
    if (tab === 'browse') fetchListings();
    else fetchOrders();
  }, [tab]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredListings(
      listings.filter(l =>
        l.residue_type.toLowerCase().includes(q) ||
        l.location_text.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, listings]);

  const fetchListings = async () => {
    setListingsLoading(true);
    try {
      const data = await listListings('active');
      setListings(data);
      setFilteredListings(data);
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

  const handlePlaceOrder = async (listing: ResidueListing) => {
    const qty = parseFloat(orderQty);
    if (!qty || qty <= 0) {
      setOrderError('Please enter a valid quantity');
      return;
    }
    if (qty > listing.quantity_tons) {
      setOrderError(`Maximum available: ${listing.quantity_tons} tons`);
      return;
    }
    setOrderSubmitting(true);
    setOrderError('');
    try {
      await createOrder({ listing_id: listing.id, ordered_quantity_tons: qty });
      setOrderSuccess(`Order placed! Total: ₹${(qty * listing.price_per_ton).toLocaleString('en-IN')}`);
      setOrderingListingId(null);
      setOrderQty('');
      fetchListings();
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : 'Failed to place order');
    } finally {
      setOrderSubmitting(false);
    }
  };

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
            <span className="inline-flex items-center rounded-full bg-accent-50 border border-accent-200 px-3 py-1 text-xs font-semibold text-accent-700 mb-2">
              Buyer Dashboard
            </span>
            <h1 className="text-3xl font-display">Welcome, {user?.name}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/profile')} className="btn-secondary"><User size={16} /> Profile</button>
            <button onClick={logout} className="btn-secondary text-red-600">Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'browse' as Tab, label: 'Browse Listings', icon: Leaf },
            { id: 'orders' as Tab, label: 'My Orders', icon: ShoppingBag },
          ].map(({ id, label, icon: Icon }) => (
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

        {orderSuccess && (
          <div className="mb-4 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-800 text-sm flex items-center gap-2">
            <CheckCircle size={16} /> {orderSuccess}
          </div>
        )}

        {/* Browse Tab */}
        {tab === 'browse' && (
          <div>
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <h2 className="text-2xl font-display">Active Residue Listings</h2>
              <button onClick={fetchListings} className="btn-secondary text-sm">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-5">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input pl-10"
                placeholder="Search by residue type or location..."
              />
            </div>

            {listingsLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-700 rounded-full animate-spin" />
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="card-hover surface-3d p-10 text-center">
                <Leaf size={40} className="text-primary-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No active listings found</p>
                <p className="text-sm text-slate-500 mt-1">Check back later or try a different search</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredListings.map(listing => (
                  <div key={listing.id} className="card-hover surface-3d p-5 flex flex-col">
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
                        <p className="text-xs text-slate-500">Available</p>
                        <p className="font-semibold text-slate-900">{listing.quantity_tons} tons</p>
                      </div>
                      <div className="rounded-lg bg-accent-50 px-3 py-2">
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="font-semibold text-slate-900">₹{listing.price_per_ton}/ton</p>
                      </div>
                    </div>

                    {listing.description && (
                      <p className="text-sm text-slate-600 mt-2">{listing.description}</p>
                    )}

                    <div className="mt-auto pt-4">
                      {orderingListingId === listing.id ? (
                        <div className="space-y-2">
                          {orderError && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <AlertCircle size={12} /> {orderError}
                            </p>
                          )}
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            max={listing.quantity_tons}
                            value={orderQty}
                            onChange={e => { setOrderQty(e.target.value); setOrderError(''); }}
                            className="form-input text-sm"
                            placeholder={`Qty in tons (max ${listing.quantity_tons})`}
                            autoFocus
                          />
                          {orderQty && parseFloat(orderQty) > 0 && (
                            <p className="text-xs text-primary-700 font-semibold">
                              Total: ₹{(parseFloat(orderQty) * listing.price_per_ton).toLocaleString('en-IN')}
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => { setOrderingListingId(null); setOrderQty(''); setOrderError(''); }} className="btn-secondary text-sm">
                              Cancel
                            </button>
                            <button
                              onClick={() => handlePlaceOrder(listing)}
                              disabled={orderSubmitting}
                              className="btn-primary text-sm disabled:opacity-70"
                            >
                              {orderSubmitting ? 'Placing...' : 'Place Order'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setOrderingListingId(listing.id); setOrderQty(''); setOrderError(''); setOrderSuccess(''); }}
                          className="btn-primary w-full text-sm"
                        >
                          <Plus size={14} /> Place Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-2xl font-display mb-4">My Orders</h2>
            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-700 rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="card-hover surface-3d p-10 text-center">
                <Package size={40} className="text-primary-300 mx-auto mb-3" />
                <p className="font-semibold text-slate-700">No orders yet</p>
                <p className="text-sm text-slate-500 mt-1">Browse listings and place your first order</p>
                <button onClick={() => setTab('browse')} className="btn-primary mt-4">
                  Browse Listings
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => (
                  <div key={order.id} className="card-hover surface-3d p-5 flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold text-slate-900">Order #{order.id.slice(-8)}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {order.ordered_quantity_tons} tons · ₹{order.total_amount_inr.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
