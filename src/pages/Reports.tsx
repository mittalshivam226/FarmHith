import { useState } from 'react';
import { CheckCircle, Clock, Download, Search, Send, TrendingUp } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

type ReportStatus = 'completed' | 'in_process' | 'pending';

const Reports = () => {
  const { navigateTo } = useNavigation();
  const [trackingId, setTrackingId] = useState('');
  const [mobile, setMobile] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const mockReports = [
    {
      id: '1',
      trackingId: 'FH12345678',
      farmerName: 'Rajesh Kumar',
      status: 'completed' as ReportStatus,
      submittedDate: '2025-10-25',
      completedDate: '2025-11-01',
      packageName: 'Advanced Soil Test',
      pdfUrl: '#',
      results: {
        pH: 7.2,
        nitrogen: 245,
        phosphorus: 18,
        potassium: 210,
        organicCarbon: 0.65,
      },
    },
    {
      id: '2',
      trackingId: 'FH12345679',
      farmerName: 'Rajesh Kumar',
      status: 'in_process' as ReportStatus,
      submittedDate: '2025-11-02',
      packageName: 'Basic Soil Test',
    },
  ];

  const handleLogin = () => {
    if (trackingId && mobile) {
      setAuthenticated(true);
    }
  };

  const getStatusBadgeClasses = (status: ReportStatus) => {
    if (status === 'completed') {
      return 'bg-primary-100 text-primary-800';
    }
    if (status === 'in_process') {
      return 'bg-accent-100 text-accent-800';
    }
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="ambient-orb top-[-8%] left-[-7%] h-72 w-72 bg-primary-300/60" />
          <div className="ambient-orb right-[-8%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-primary-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700">
            Report tracking portal
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 leading-tight">
            Soil report access,
            <span className="text-primary-700"> simplified</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            Track test progress, review parameter summaries, and download completed reports from one place.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {!authenticated ? (
            <div className="max-w-xl mx-auto card-hover surface-3d p-6 md:p-8">
              <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <Search size={20} />
              </div>
              <h2 className="text-2xl md:text-3xl mt-4">Access your reports</h2>
              <p className="text-slate-600 mt-2">Use your tracking ID and mobile number to view your report timeline.</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="form-label">Tracking ID</label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="For example FH12345678"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 9876543210"
                    className="form-input"
                  />
                </div>
                <button
                  onClick={handleLogin}
                  disabled={!trackingId || !mobile}
                  className="btn-primary w-full disabled:opacity-60"
                >
                  View Reports
                </button>
              </div>

              <p className="mt-5 text-sm text-slate-600">
                Do not have a tracking ID yet?{' '}
                <button onClick={() => navigateTo('book-test')} className="text-primary-700 font-semibold hover:underline">
                  Book a soil test
                </button>
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="card-hover surface-3d p-5 md:p-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl">Welcome back, {mockReports[0].farmerName}</h2>
                  <p className="text-slate-600 mt-1">{mockReports.length} report entries available in your dashboard.</p>
                </div>
                <button
                  onClick={() => {
                    setAuthenticated(false);
                    setActionMessage('');
                  }}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </div>

              {actionMessage && (
                <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-800 text-sm">
                  {actionMessage}
                </div>
              )}

              {mockReports.map((report) => (
                <div key={report.id} className="card-hover surface-3d overflow-hidden">
                  <div className="p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-semibold text-slate-900">{report.packageName}</h3>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(report.status)}`}>
                            {report.status === 'completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {report.status === 'completed' ? 'Completed' : report.status === 'in_process' ? 'In process' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-2">
                          Tracking ID: <span className="font-semibold text-slate-800">{report.trackingId}</span>
                        </p>
                      </div>

                      <div className="text-sm text-right text-slate-600">
                        <p>Submitted: <span className="font-semibold text-slate-800">{report.submittedDate}</span></p>
                        {report.completedDate && (
                          <p className="mt-1">Completed: <span className="font-semibold text-primary-700">{report.completedDate}</span></p>
                        )}
                      </div>
                    </div>

                    {report.status === 'completed' && report.results && (
                      <>
                        <div className="mt-5 rounded-2xl border border-primary-100 bg-[#f8fdf9] p-5">
                          <h4 className="font-semibold text-slate-900">Test Results Summary</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                            {[
                              { label: 'pH', value: report.results.pH, ideal: '6.5-7.5' },
                              { label: 'Nitrogen', value: `${report.results.nitrogen} kg/ha`, ideal: '200-250' },
                              { label: 'Phosphorus', value: `${report.results.phosphorus} kg/ha`, ideal: '15-25' },
                              { label: 'Potassium', value: `${report.results.potassium} kg/ha`, ideal: '150-250' },
                              { label: 'Organic Carbon', value: `${report.results.organicCarbon}%`, ideal: '0.5-0.75' },
                            ].map((item) => (
                              <div key={item.label} className="rounded-xl border border-primary-100 bg-white p-3 text-center">
                                <p className="text-xs text-slate-500">{item.label}</p>
                                <p className="text-lg font-semibold text-primary-700 mt-1">{item.value}</p>
                                <p className="text-xs text-slate-500 mt-1">Ideal: {item.ideal}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            onClick={() => {
                              if (report.pdfUrl && report.pdfUrl !== '#') {
                                window.open(report.pdfUrl, '_blank', 'noopener,noreferrer');
                              } else {
                                setActionMessage('PDF download will be available once the final report file is uploaded.');
                              }
                            }}
                            className="btn-primary"
                          >
                            <Download size={16} />
                            Download PDF
                          </button>
                          <button onClick={() => navigateTo('contact')} className="btn-secondary">
                            <Send size={16} />
                            Send to Agronomist
                          </button>
                        </div>
                      </>
                    )}

                    {report.status === 'in_process' && (
                      <div className="mt-5 rounded-2xl border border-accent-200 bg-accent-50 px-4 py-3 text-accent-800 text-sm">
                        Your sample is currently being analyzed at a partner lab. The report will appear here once processing is complete.
                      </div>
                    )}
                  </div>

                  {report.status === 'completed' && (
                    <div className="border-t border-primary-100 bg-[#f5fbf6] p-5 md:p-6">
                      <p className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm">
                        <TrendingUp size={16} />
                        Key Recommendations
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700">
                        <li>- Soil pH is in a suitable range for most crops.</li>
                        <li>- Nitrogen levels are adequate; maintain with compost and manure.</li>
                        <li>- Phosphorus is slightly lower; consider DAP around 50 kg/acre.</li>
                        <li>- Add potash for improved grain and fruit quality.</li>
                        <li>- Organic carbon is healthy; continue residue composting where possible.</li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <div className="text-center pt-2">
                <button onClick={() => navigateTo('book-test')} className="btn-primary">
                  Book New Soil Test
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reports;
