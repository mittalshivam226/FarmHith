import { BookOpen, Video, FileText, HelpCircle, Calendar } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const Education = () => {
  const { navigateTo } = useNavigation();

  const articles = [
    { title: 'Complete Guide to Soil pH Management', desc: 'Understanding pH levels and nutrient availability', category: 'Soil Science', readTime: 8 },
    { title: 'NPK: The Big Three Nutrients Explained', desc: 'Nitrogen, Phosphorus, and Potassium explained simply', category: 'Fertilizers', readTime: 6 },
    { title: 'Micronutrients: Small but Mighty', desc: 'Why zinc, iron, copper, and manganese matter', category: 'Soil Science', readTime: 5 },
    { title: 'Organic Farming: Building Soil Carbon', desc: 'Natural methods to improve organic matter', category: 'Organic Farming', readTime: 7 },
  ];

  const videos = [
    { title: 'How to Collect Soil Samples Correctly', duration: '5:30' },
    { title: 'Reading Your Soil Test Report', duration: '8:15' },
    { title: 'Fertilizer Application Techniques', duration: '6:45' },
    { title: 'Crop Rotation for Soil Health', duration: '7:20' },
  ];

  const faqs = [
    { q: 'How often should I test my soil?', a: 'Test once a year before the main crop season. Test sooner if issues are visible.' },
    { q: 'What is ideal pH for most crops?', a: 'Most crops perform well around pH 6.5 to 7.5.' },
    { q: 'Why is organic carbon important?', a: 'It helps water retention, soil structure, and nutrient availability.' },
    { q: 'Can I use same fertilizer every season?', a: 'No. Use fertilizer plan based on the latest soil report and crop type.' },
    { q: 'How quickly can soil improve?', a: 'Visible improvements usually begin in 1 to 2 years with consistent practices.' },
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
            <h1 className="text-5xl font-bold mb-6">Educational Hub</h1>
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
              <div key={index} className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-all">
                <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                  {article.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                <p className="text-gray-700 mb-4">{article.desc}</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{article.readTime} min read</span>
                  <button onClick={() => navigateTo('blog')} className="text-green-600 font-semibold hover:underline">
                    Read More
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
            <h2 className="text-3xl font-bold text-gray-900">Downloadable Resources</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Soil Sampling Guide', format: 'PDF', size: '2.5 MB' },
              { title: 'Fertilizer Calculator Spreadsheet', format: 'XLSX', size: '1.2 MB' },
              { title: 'Crop-wise Nutrient Requirements Chart', format: 'PDF', size: '1.8 MB' },
            ].map((resource, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-600 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <FileText size={32} className="text-green-600" />
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">{resource.format}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.size}</p>
                <button onClick={() => navigateTo('contact')} className="text-green-600 font-semibold hover:underline text-sm">
                  Request Download
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
            <h2 className="text-3xl font-bold text-gray-900">Tutorial Videos</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div key={index} className="bg-gradient-to-br from-green-400 to-green-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="aspect-video flex items-center justify-center relative">
                  <Video size={64} className="text-white opacity-50" />
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
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Webinars and Workshops</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {webinars.map((webinar, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-all">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Calendar size={28} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{webinar.title}</h3>
                <div className="space-y-2 text-gray-700 mb-4">
                  <p><span className="font-semibold">Date:</span> {webinar.date}</p>
                  <p><span className="font-semibold">Time:</span> {webinar.time}</p>
                </div>
                <button onClick={() => navigateTo('contact')} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-all">
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
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-green-600 transition-all">
                <summary className="font-bold text-gray-900 text-lg cursor-pointer">{faq.q}</summary>
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

