import { useState } from 'react';
import { ArrowRight, Clock3, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { submitContactMessage } from '../services/contact';
import { useNavigation } from '../context/NavigationContext';

const Contact = () => {
  const { navigateTo } = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await submitContactMessage(formData);
      setSuccessMessage('Thank you for reaching out. Our team will contact you within 24 hours.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to submit your message right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="ambient-orb top-[-5%] left-[-6%] h-72 w-72 bg-primary-300/60" />
          <div className="ambient-orb right-[-7%] bottom-[-18%] h-80 w-80 bg-accent-200/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-primary-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700">
              We are here to help your farming journey
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 leading-tight">
              Reach the FarmHith
              <span className="text-primary-700"> support team</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl">
              Questions about soil tests, residue selling, partner onboarding, or payment issues. We respond fast and keep guidance practical.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="tel:+911234567890" className="btn-primary">
                Call Support
              </a>
              <a
                href="https://wa.me/911234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                WhatsApp Chat
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[
                {
                  icon: Phone,
                  title: 'Phone',
                  value: '+91 1234567890',
                  hint: 'Mon-Sat, 9:00 AM to 6:00 PM',
                  href: 'tel:+911234567890',
                },
                {
                  icon: Mail,
                  title: 'Email',
                  value: 'support@farmhith.in',
                  hint: 'Usually replies within 24 hours',
                  href: 'mailto:support@farmhith.in',
                },
                {
                  icon: MapPin,
                  title: 'Office',
                  value: 'Panipat, Haryana, India',
                  hint: 'Remote and in-person support available',
                  href: '#',
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href === '#') {
                      e.preventDefault();
                    }
                  }}
                  className="card-hover surface-3d p-5 block"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                    <item.icon size={18} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">{item.title}</p>
                  <p className="text-lg font-semibold text-slate-900">{item.value}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.hint}</p>
                </a>
              ))}

              <div className="card-hover surface-3d p-5">
                <p className="inline-flex items-center gap-2 text-primary-700 font-semibold">
                  <Clock3 size={18} />
                  Operating Hours
                </p>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-primary-100 pb-2">
                    <span className="text-slate-700">Monday to Friday</span>
                    <span className="font-semibold text-slate-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-primary-100 pb-2">
                    <span className="text-slate-700">Saturday</span>
                    <span className="font-semibold text-slate-900">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700">Sunday</span>
                    <span className="font-semibold text-slate-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 card-hover surface-3d p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-display flex items-center gap-2">
                <MessageSquare size={24} className="text-primary-700" />
                Send a Message
              </h2>
              <p className="text-slate-600 mt-2">
                Share your question and we will route it to the right team.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {successMessage && (
                  <div className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-800 text-sm">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="form-input"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Subject</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select a subject</option>
                    <option value="soil_test">Soil testing query</option>
                    <option value="residue">Residue selling support</option>
                    <option value="partnership">Partnership inquiry</option>
                    <option value="technical">Technical issue</option>
                    <option value="payment">Payment issue</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input"
                    placeholder="Write your message"
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-70">
                  <Send size={18} />
                  {isSubmitting ? 'Sending message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          <div className="mt-8 card-hover surface-3d p-6">
            <h3 className="text-xl font-display">Quick Actions</h3>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {[
                { label: 'Book Soil Test', page: 'book-test' },
                { label: 'Track Reports', page: 'reports' },
                { label: 'Sell Residue', page: 'services' },
                { label: 'Partner With Us', page: 'partners' },
                { label: 'Learn & Guides', page: 'education' },
              ].map((link) => (
                <button
                  key={link.page}
                  onClick={() => navigateTo(link.page)}
                  className="rounded-xl border border-primary-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:border-primary-400 hover:text-primary-700 transition-all duration-300 flex items-center justify-between"
                >
                  {link.label}
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
