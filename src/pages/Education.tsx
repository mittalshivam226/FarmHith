import { BookOpen, Calendar, FileText, HelpCircle, PlayCircle, Video } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const Education = () => {
  const { navigateTo } = useNavigation();

  const articles = [
    { title: 'Complete Guide to Soil pH Management', desc: 'Understand pH and nutrient availability for better crop planning.', category: 'Soil Science', readTime: 8 },
    { title: 'NPK Explained for Farmers', desc: 'Learn how nitrogen, phosphorus, and potassium affect growth and yield.', category: 'Fertilizers', readTime: 6 },
    { title: 'Micronutrients That Matter', desc: 'A quick guide to zinc, iron, copper, manganese, and their field impact.', category: 'Soil Science', readTime: 5 },
    { title: 'Building Soil Carbon Organically', desc: 'Practical methods to improve organic matter and water retention.', category: 'Organic Farming', readTime: 7 },
  ];

  const videos = [
    { title: 'How to Collect Soil Samples Correctly', duration: '5:30' },
    { title: 'Reading Your Soil Test Report', duration: '8:15' },
    { title: 'Fertilizer Application Techniques', duration: '6:45' },
    { title: 'Crop Rotation for Soil Health', duration: '7:20' },
  ];

  const faqs = [
    { q: 'How often should I test my soil?', a: 'At least once a year before your main crop season. Test earlier if visible soil issues appear.' },
    { q: 'What pH range suits most crops?', a: 'Most crops perform well between pH 6.5 and 7.5.' },
    { q: 'Why is organic carbon important?', a: 'It improves soil structure, moisture retention, and nutrient cycling.' },
    { q: 'Can I use the same fertilizer every season?', a: 'No. Use your latest report and crop requirements to decide fertilizer dosage.' },
    { q: 'How quickly can soil health improve?', a: 'Initial changes can be visible in 1 to 2 seasons with consistent practices.' },
  ];

  const webinars = [
    { title: 'Precision Farming with Soil Data', date: 'Nov 15, 2025', time: '4:00 PM' },
    { title: 'Sustainable Fertilizer Practices', date: 'Nov 22, 2025', time: '3:30 PM' },
    { title: 'Soil Health and Climate Adaptation', date: 'Dec 1, 2025', time: '5:00 PM' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="ambient-orb top-[-8%] left-[-8%] h-72 w-72 bg-primary-300/60" />
          <div className="ambient-orb right-[-9%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-primary-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700">
            Farmer learning center
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 leading-tight max-w-4xl">
            Learn faster.
            <span className="text-primary-700"> Apply smarter.</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            Curated guides, videos, webinars, and FAQs to help farmers improve soil health with practical steps.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-primary-700 font-semibold">
            <BookOpen size={18} />
            Featured Articles
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {articles.map((article) => (
              <div key={article.title} className="card-hover surface-3d p-5">
                <span className="inline-flex rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
                  {article.category}
                </span>
                <h3 className="text-xl mt-3">{article.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{article.desc}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{article.readTime} min read</span>
                  <button onClick={() => navigateTo('blog')} className="text-primary-700 font-semibold hover:underline">
                    Read more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
          <div className="card-hover surface-3d p-6">
            <div className="flex items-center gap-2 text-primary-700 font-semibold">
              <FileText size={18} />
              Downloadable Resources
            </div>
            <div className="mt-4 space-y-3">
              {[
                { title: 'Soil Sampling Guide', format: 'PDF', size: '2.5 MB' },
                { title: 'Fertilizer Calculator Sheet', format: 'XLSX', size: '1.2 MB' },
                { title: 'Crop Nutrient Requirement Chart', format: 'PDF', size: '1.8 MB' },
              ].map((resource) => (
                <button
                  key={resource.title}
                  onClick={() => navigateTo('contact')}
                  className="w-full text-left rounded-xl border border-primary-100 bg-white px-4 py-3 hover:border-primary-300 transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{resource.title}</p>
                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-800">
                      {resource.format}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{resource.size}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card-hover surface-3d p-6">
            <div className="flex items-center gap-2 text-primary-700 font-semibold">
              <Video size={18} />
              Tutorial Videos
            </div>
            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {videos.map((video) => (
                <button
                  key={video.title}
                  onClick={() => navigateTo('blog')}
                  className="rounded-xl border border-primary-100 bg-[#f8fdf9] p-4 text-left hover:border-primary-300 transition-all duration-300"
                >
                  <PlayCircle size={18} className="text-primary-700" />
                  <p className="font-semibold text-slate-900 mt-2 text-sm">{video.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{video.duration}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-6 md:p-8">
            <div className="flex items-center gap-2 text-primary-700 font-semibold">
              <Calendar size={18} />
              Upcoming Webinars
            </div>
            <div className="mt-5 grid md:grid-cols-3 gap-4">
              {webinars.map((webinar) => (
                <div key={webinar.title} className="rounded-2xl border border-primary-100 bg-white p-4">
                  <h3 className="font-semibold text-slate-900">{webinar.title}</h3>
                  <p className="text-sm text-slate-600 mt-2">Date: {webinar.date}</p>
                  <p className="text-sm text-slate-600 mt-1">Time: {webinar.time}</p>
                  <button onClick={() => navigateTo('contact')} className="btn-primary mt-4 w-full">
                    Register Free
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-6 md:p-8">
            <div className="flex items-center gap-2 text-primary-700 font-semibold">
              <HelpCircle size={18} />
              Frequently Asked Questions
            </div>
            <div className="mt-5 space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="rounded-xl border border-primary-100 bg-white p-4">
                  <summary className="cursor-pointer font-semibold text-slate-900">{faq.q}</summary>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Education;
