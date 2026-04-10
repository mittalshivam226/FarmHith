import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Beaker, CheckCircle, Clock, AlertCircle, FileText, ChevronDown, User, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  listSoilRequests, upsertSoilReport, updateSoilRequestStatus,
  type SoilRequest
} from '../../services/soil';

type Tab = 'pending' | 'in_progress' | 'completed';

const STATUS_META: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-slate-100 text-slate-700', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-accent-100 text-accent-800', icon: RefreshCw },
  in_analysis: { label: 'In Analysis', color: 'bg-blue-100 text-blue-800', icon: RefreshCw },
  report_ready: { label: 'Report Ready', color: 'bg-primary-100 text-primary-800', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-primary-200 text-primary-900', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: AlertCircle },
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

interface ReportForm {
  ph_level: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  moisture: string;
  recommendations: string;
  report_pdf_url: string;
}

const emptyForm = (): ReportForm => ({
  ph_level: '', nitrogen: '', phosphorus: '', potassium: '',
  moisture: '', recommendations: '', report_pdf_url: '',
});

export default function LabDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('pending');
  const [requests, setRequests] = useState<SoilRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState<ReportForm>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchRequests(); }, [tab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const statusMap: Record<Tab, string | undefined> = {
        pending: 'accepted',
        in_progress: 'in_analysis',
        completed: 'completed',
      };
      const data = await listSoilRequests(statusMap[tab]);
      setRequests(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (req: SoilRequest, newStatus: string) => {
    try {
      await updateSoilRequestStatus(req.id, newStatus);
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Status update failed');
    }
  };

  const handleSubmitReport = async (req: SoilRequest) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await upsertSoilReport({
        soil_request_id: req.id,
        ph_level: reportForm.ph_level ? parseFloat(reportForm.ph_level) : undefined,
        nitrogen: reportForm.nitrogen ? parseFloat(reportForm.nitrogen) : undefined,
        phosphorus: reportForm.phosphorus ? parseFloat(reportForm.phosphorus) : undefined,
        potassium: reportForm.potassium ? parseFloat(reportForm.potassium) : undefined,
        moisture: reportForm.moisture ? parseFloat(reportForm.moisture) : undefined,
        recommendations: reportForm.recommendations || undefined,
        report_pdf_url: reportForm.report_pdf_url || undefined,
      });
      setSuccess('Report uploaded successfully!');
      setActiveReportId(null);
      setReportForm(emptyForm());
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Report upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'pending', label: 'Pending / Accepted' },
    { id: 'in_progress', label: 'In Analysis' },
    { id: 'completed', label: 'Completed' },
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
            <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
              Lab Dashboard
            </span>
            <h1 className="text-3xl font-display">Welcome, {user?.name}</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/profile')} className="btn-secondary"><User size={16} /> Profile</button>
            <button onClick={logout} className="btn-secondary text-red-600">Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                tab === id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white/80 border border-primary-100 text-slate-700 hover:bg-primary-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {success && (
          <div className="mb-4 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-800 text-sm flex items-center gap-2">
            <CheckCircle size={16} /> {success}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-700 rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="card-hover surface-3d p-10 text-center">
            <Beaker size={40} className="text-primary-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No requests in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="card-hover surface-3d p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{req.crop_type}</p>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Tracking: <span className="font-mono font-semibold text-primary-700">{req.tracking_id}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{req.pickup_type === 'pickup' ? 'Field pickup' : 'Self drop'} · {new Date(req.created_at).toLocaleDateString('en-IN')}</p>
                    {req.notes && <p className="text-sm text-slate-600 mt-2 bg-slate-50 rounded-lg px-3 py-1">{req.notes}</p>}
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusChange(req, 'in_analysis')}
                      className="btn-secondary text-sm"
                    >
                      <RefreshCw size={14} /> Start Analysis
                    </button>
                  )}
                  {(req.status === 'in_analysis' || req.status === 'accepted') && (
                    <button
                      onClick={() => {
                        setActiveReportId(activeReportId === req.id ? null : req.id);
                        setReportForm(emptyForm());
                        setError('');
                        setSuccess('');
                      }}
                      className="btn-primary text-sm"
                    >
                      <FileText size={14} />
                      {activeReportId === req.id ? 'Cancel Report' : 'Upload Report'}
                    </button>
                  )}
                </div>

                {activeReportId === req.id && (
                  <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50/40 p-4 space-y-3">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                      <ChevronDown size={16} /> Soil Parameters
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {(['ph_level', 'nitrogen', 'phosphorus', 'potassium', 'moisture'] as const).map(field => (
                        <div key={field}>
                          <label className="form-label capitalize">{field.replace('_', ' ')}</label>
                          <input
                            type="number"
                            step="0.01"
                            value={reportForm[field]}
                            onChange={e => setReportForm(p => ({ ...p, [field]: e.target.value }))}
                            className="form-input"
                            placeholder={field === 'ph_level' ? '6.5' : 'mg/kg'}
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="form-label">Recommendations</label>
                      <textarea
                        rows={3}
                        value={reportForm.recommendations}
                        onChange={e => setReportForm(p => ({ ...p, recommendations: e.target.value }))}
                        className="form-input resize-none"
                        placeholder="Fertilizer and treatment recommendations for the farmer"
                      />
                    </div>
                    <div>
                      <label className="form-label">Report PDF URL (optional)</label>
                      <input
                        type="url"
                        value={reportForm.report_pdf_url}
                        onChange={e => setReportForm(p => ({ ...p, report_pdf_url: e.target.value }))}
                        className="form-input"
                        placeholder="https://..."
                      />
                    </div>
                    <button
                      onClick={() => handleSubmitReport(req)}
                      disabled={submitting}
                      className="btn-primary disabled:opacity-70"
                    >
                      {submitting ? 'Uploading...' : 'Submit Report'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
