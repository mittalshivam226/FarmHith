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
    { id: 'policy', label: 'Policy & Schemes', count: 1 },
  ];

  const visiblePosts = useMemo(
    () => BLOG_POSTS.filter((post) => activeCategory === 'all' || post.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Blog</h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Latest insights on sustainable agriculture, soil health, and farming innovations
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-2 rounded-full border-2 transition-all font-semibold ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white border-green-600'
                    : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                onClick={() => navigateTo('education')}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className="aspect-video bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all"></div>
                  <span className="text-white text-6xl font-bold opacity-30">
                    {post.category === 'smart_farming'
                      ? 'SF'
                      : post.category === 'sustainability'
                      ? 'SU'
                      : post.category === 'policy'
                      ? 'PO'
                      : 'EN'}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={16} />
                        {new Date(post.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />
                        {post.readTime} min read
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigateTo('education')}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Read Full Article -
                  </button>
                </div>
              </article>
            ))}
          </div>

          {actionMessage && (
            <div className="mt-8 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-center text-green-800">
              {actionMessage}
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() =>
                setActionMessage('You are viewing all currently published articles. More posts will be added soon.')
              }
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest articles and farming tips delivered to your inbox
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
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
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              Subscribe
            </button>
          </div>
          {newsletterMessage && <p className="mt-4 text-sm text-green-700">{newsletterMessage}</p>}
        </div>
      </section>
    </div>
  );
};

export default Blog;
