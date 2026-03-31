import { Calendar, Clock, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { BLOG_POSTS } from '../utils/constants';

const Blog = () => {
  const { navigateTo } = useNavigation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const categories = [
    { id: 'all', label: 'All Posts', count: BLOG_POSTS.length },
    { id: 'smart_farming', label: 'Smart Farming', count: 2 },
    { id: 'sustainability', label: 'Sustainability', count: 1 },
    { id: 'energy', label: 'Clean Energy', count: 0 },
    { id: 'policy', label: 'Policy and Schemes', count: 1 },
  ];

  const visiblePosts = useMemo(
    () => BLOG_POSTS.filter((post) => activeCategory === 'all' || post.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="ambient-orb top-[-8%] left-[-8%] h-72 w-72 bg-primary-300/60" />
          <div className="ambient-orb right-[-9%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex rounded-full border border-primary-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700">
            Knowledge and field insights
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display text-slate-900">FarmHith Blog</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Practical content on soil health, sustainable agriculture, and farmer-focused innovation.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'border-primary-600 bg-primary-600 text-white'
                    : 'border-primary-200 bg-white text-primary-700 hover:border-primary-400'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-5">
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigateTo('education')}
                className="card-hover surface-3d cursor-pointer overflow-hidden"
              >
                <div className="h-44 bg-gradient-to-br from-primary-500 to-primary-700 px-6 py-5 flex items-end">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                    {post.category.split('_').join(' ')}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="text-2xl font-semibold text-slate-900">{post.title}</h2>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(post.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={14} />
                      {post.readTime} min read
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs text-primary-700"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('education');
                    }}
                    className="mt-5 text-primary-700 font-semibold hover:underline"
                  >
                    Read full article
                  </button>
                </div>
              </article>
            ))}
          </div>

          {actionMessage && (
            <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-center text-primary-800">
              {actionMessage}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => setActionMessage('You are viewing all currently published articles. More posts are coming soon.')}
              className="btn-primary"
            >
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-6 md:p-8 text-center">
            <h3 className="text-2xl md:text-3xl">Subscribe to Newsletter</h3>
            <p className="text-slate-600 mt-2">
              Receive new farming insights and practical soil health updates.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="form-input flex-1"
              />
              <button
                onClick={() => {
                  if (!newsletterEmail.trim()) {
                    setNewsletterMessage('Please enter your email before subscribing.');
                    return;
                  }
                  setNewsletterMessage('Thanks for subscribing. We will share updates with you soon.');
                  setNewsletterEmail('');
                }}
                className="btn-primary"
              >
                Subscribe
              </button>
            </div>
            {newsletterMessage && <p className="text-sm text-primary-700 mt-4">{newsletterMessage}</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
