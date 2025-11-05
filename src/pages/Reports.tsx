import { useState } from 'react';
import { Search, Download, Send, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const Reports = () => {
  const [trackingId, setTrackingId] = useState('');
  const [mobile, setMobile] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const mockReports = [
    {
      id: '1',
      trackingId: 'FH12345678',
      farmerName: 'Rajesh Kumar',
      status: 'completed' as const,
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
      status: 'in_process' as const,
      submittedDate: '2025-11-02',
      packageName: 'Basic Soil Test',
    },
  ];

  const handleLogin = () => {
    if (trackingId && mobile) {
      setAuthenticated(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            <CheckCircle size={16} />
            Completed
          </span>
        );
      case 'in_process':
        return (
          <span className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
            <Clock size={16} />
            In Process
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
            <AlertCircle size={16} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              My Reports | मेरी रिपोर्ट
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Access your soil test reports and track analysis progress
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!authenticated ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Your Reports</h2>
                <p className="text-gray-600">
                  Enter your tracking ID and mobile number
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tracking ID | ट्रैकिंग आईडी
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="e.g., FH12345678"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mobile Number | मोबाइल नंबर
                  </label>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleLogin}
                  disabled={!trackingId || !mobile}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  View Reports
                </button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 text-center">
                  Don't have a tracking ID?{' '}
                  <button className="text-green-600 font-semibold hover:underline">
                    Book a test now
                  </button>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    Welcome back, {mockReports[0].farmerName}!
                  </h2>
                  <p className="text-gray-600">You have {mockReports.length} soil test reports</p>
                </div>
                <button
                  onClick={() => setAuthenticated(false)}
                  className="text-gray-600 hover:text-gray-900 font-semibold"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {mockReports.map((report) => (
                <div key={report.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {report.packageName}
                          </h3>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-gray-600">
                          Tracking ID: <span className="font-semibold">{report.trackingId}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Submitted</p>
                        <p className="font-semibold text-gray-900">{report.submittedDate}</p>
                        {report.completedDate && (
                          <>
                            <p className="text-sm text-gray-600 mt-2">Completed</p>
                            <p className="font-semibold text-green-600">{report.completedDate}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {report.status === 'completed' && report.results && (
                      <>
                        <div className="bg-gray-50 rounded-lg p-6 mb-4">
                          <h4 className="font-bold text-gray-900 mb-4">Test Results Summary</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {[
                              { label: 'pH Level', value: report.results.pH, unit: '', ideal: '6.5-7.5' },
                              { label: 'Nitrogen (N)', value: report.results.nitrogen, unit: 'kg/ha', ideal: '200-250' },
                              { label: 'Phosphorus (P)', value: report.results.phosphorus, unit: 'kg/ha', ideal: '15-25' },
                              { label: 'Potassium (K)', value: report.results.potassium, unit: 'kg/ha', ideal: '150-250' },
                              { label: 'Organic Carbon', value: report.results.organicCarbon, unit: '%', ideal: '0.5-0.75' },
                            ].map((param, index) => (
                              <div key={index} className="text-center">
                                <p className="text-sm text-gray-600 mb-1">{param.label}</p>
                                <p className="text-2xl font-bold text-green-600 mb-1">
                                  {param.value}{param.unit}
                                </p>
                                <p className="text-xs text-gray-500">Ideal: {param.ideal}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
                            <Download size={20} />
                            Download PDF Report
                          </button>
                          <button className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-all">
                            <Send size={20} />
                            Send to Agronomist
                          </button>
                        </div>
                      </>
                    )}

                    {report.status === 'in_process' && (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800">
                          <strong>Analysis in Progress:</strong> Your soil sample is being analyzed at our partner lab. Report will be available soon.
                        </p>
                      </div>
                    )}
                  </div>

                  {report.status === 'completed' && (
                    <div className="bg-green-50 border-t-2 border-green-100 p-6">
                      <div className="flex items-start gap-3">
                        <TrendingUp size={24} className="text-green-600 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Key Recommendations</h4>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li>• Your soil pH is optimal for most crops</li>
                            <li>• Nitrogen levels are good, maintain with organic manure</li>
                            <li>• Phosphorus is slightly low - consider DAP application @ 50 kg/acre</li>
                            <li>• Add 20 kg/acre potash for better fruit/grain quality</li>
                            <li>• Organic carbon is healthy - continue composting practices</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all">
                Book New Soil Test
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
