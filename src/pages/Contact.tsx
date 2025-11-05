import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Contact Us | संपर्क करें</h1>
            <p className="text-xl text-green-100 leading-relaxed">
              We're here to help. Reach out with any questions or feedback
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">कॉल करें</p>
              <a href="tel:+911234567890" className="text-green-600 font-semibold text-lg hover:underline">
                +91 1234567890
              </a>
              <p className="text-sm text-gray-500 mt-2">Mon-Sat, 9:00 AM - 6:00 PM</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">ईमेल करें</p>
              <a href="mailto:support@farmhith.in" className="text-green-600 font-semibold text-lg hover:underline">
                support@farmhith.in
              </a>
              <p className="text-sm text-gray-500 mt-2">24-hour response time</p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">हमसे मिलें</p>
              <p className="text-gray-700 font-semibold">
                Panipat, Haryana
                <br />
                India - 132103
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MessageSquare size={32} className="text-green-600" />
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name | पूरा नाम *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email | ईमेल *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone | फोन *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                      placeholder="+91"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject | विषय *
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="soil_test">Soil Testing Query</option>
                    <option value="residue">Residue Selling</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message | संदेश *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none"
                    placeholder="Tell us how we can help you"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Clock size={28} className="text-green-600" />
                  Operating Hours
                </h3>
                <div className="space-y-4">
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM - 4:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                      <span className="font-semibold text-gray-900">{schedule.day}</span>
                      <span className="text-gray-600">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
                <div className="space-y-3">
                  {[
                    'Book a Soil Test',
                    'Check Report Status',
                    'Sell Crop Residue',
                    'Partner with Us',
                    'Educational Resources',
                  ].map((link, index) => (
                    <button
                      key={index}
                      className="block w-full text-left py-2 hover:pl-2 transition-all text-white hover:text-yellow-300"
                    >
                      → {link}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Us on the Map</h2>
          <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-lg" style={{ height: '400px' }}>
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100">
              <div className="text-center">
                <MapPin size={64} className="text-green-600 mx-auto mb-4" />
                <p className="text-xl font-semibold text-gray-900">Panipat, Haryana, India</p>
                <p className="text-gray-600 mt-2">Google Maps integration placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Have Questions About Soil Testing?
          </h2>
          <p className="text-xl text-white mb-8">
            Our expert team is ready to guide you through the process
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/911234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              WhatsApp Us
            </a>
            <a
              href="tel:+911234567890"
              className="bg-green-900 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-800 transition-all shadow-lg"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
