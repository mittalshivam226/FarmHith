import { BookOpen, Video, FileText, HelpCircle, Calendar } from 'lucide-react';

const Education = () => {
  const articles = [
    {
      title: 'Complete Guide to Soil pH Management',
      desc: 'Understanding pH levels and their impact on nutrient availability',
      category: 'Soil Science',
      readTime: 8,
    },
    {
      title: 'NPK: The Big Three Nutrients Explained',
      desc: 'Everything you need to know about Nitrogen, Phosphorus, and Potassium',
      category: 'Fertilizers',
      readTime: 6,
    },
    {
      title: 'Micronutrients: Small but Mighty',
      desc: 'Zinc, Iron, Copper, and Manganese for healthy crops',
      category: 'Soil Science',
      readTime: 5,
    },
    {
      title: 'Organic Farming: Building Soil Carbon',
      desc: 'Natural methods to increase organic matter in your soil',
      category: 'Organic Farming',
      readTime: 7,
    },
  ];

  const videos = [
    { title: 'How to Collect Soil Samples Correctly', duration: '5:30' },
    { title: 'Reading Your Soil Test Report', duration: '8:15' },
    { title: 'Fertilizer Application Techniques', duration: '6:45' },
    { title: 'Crop Rotation for Soil Health', duration: '7:20' },
  ];

  const faqs = [
    {
      q: 'How often should I test my soil?',
      a: 'We recommend testing soil once a year, preferably before the main cropping season. For intensive farming or when problems occur, test more frequently.',
    },
    {
      q: 'What is the ideal pH for my crops?',
      a: 'Most crops prefer pH 6.5-7.5. Rice and tea prefer acidic soil (5.5-6.5), while wheat and vegetables thrive in neutral to slightly alkaline soil (6.5-7.5).',
    },
    {
      q: 'Why is organic carbon important?',
      a: 'Organic carbon improves soil structure, water retention, nutrient availability, and beneficial microbial activity. Aim for at least 0.5% organic carbon.',
    },
    {
      q: 'Can I use the same fertilizer every season?',
      a: 'No. Fertilizer needs vary by crop and current soil status. Always base applications on recent soil test results to avoid waste and environmental harm.',
    },
    {
      q: 'How long does it take to improve poor soil?',
      a: 'With proper management (organic matter addition, balanced fertilization, crop rotation), noticeable improvements occur in 1-2 years. Full recovery may take 3-5 years.',
    },
  ];

  const webinars = [
    { title: 'Precision Farming with Soil Data', date: 'Nov 15, 2025', time: '4:00 PM' },
    { title: 'Sustainable Fertilizer Practices', date: 'Nov 22, 2025', time: '3:30 PM' },
    { title: 'Soil Health and Climate Change', date: 'Dec 1, 2025', time: '5:00 PM' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Educational Hub | शिक्षा केंद्र
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Learn about soil health, sustainable farming, and precision agriculture
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={36} className="text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-700 mb-4">{article.desc}</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{article.readTime} min read</span>
                  <button className="text-green-600 font-semibold hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <FileText size={36} className="text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Downloadable Resources | डाउनलोड संसाधन
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Soil Sampling Guide', format: 'PDF', size: '2.5 MB' },
              { title: 'Fertilizer Calculator Spreadsheet', format: 'XLSX', size: '1.2 MB' },
              { title: 'Crop-wise Nutrient Requirements Chart', format: 'PDF', size: '1.8 MB' },
              { title: 'Organic Manure Application Guide', format: 'PDF', size: '3.1 MB' },
              { title: 'Soil Amendment Handbook', format: 'PDF', size: '4.2 MB' },
              { title: 'pH Correction Methods', format: 'PDF', size: '1.5 MB' },
            ].map((resource, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-600 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText size={32} className="text-green-600" />
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                    {resource.format}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.size}</p>
                <button className="text-green-600 font-semibold hover:underline text-sm">
                  Download →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Video size={36} className="text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">Tutorial Videos | वीडियो ट्यूटोरियल</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="aspect-video flex items-center justify-center relative">
                  <Video size={64} className="text-white opacity-50" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-green-600 border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Calendar size={36} className="text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Upcoming Webinars & Workshops
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {webinars.map((webinar, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-all"
              >
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={28} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{webinar.title}</h3>
                <div className="space-y-2 text-gray-700 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Date:</span> {webinar.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="font-semibold">Time:</span> {webinar.time}
                  </p>
                </div>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all">
                  Register Free
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle size={36} className="text-green-600" />
            <h2 className="text-3xl font-bold text-gray-900">
              Frequently Asked Questions | सामान्य प्रश्न
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-green-600 transition-all cursor-pointer"
              >
                <summary className="font-bold text-gray-900 text-lg cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-4 text-gray-700 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
