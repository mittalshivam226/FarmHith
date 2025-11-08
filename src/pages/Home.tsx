import { Sprout, Beaker, TrendingUp, Users, Leaf, Award, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { TESTIMONIALS, PARTNERS, STATS } from '../utils/constants';
import { useEffect, useState } from 'react';

const Home = () => {
  const { navigateTo } = useNavigation();
  const [counters, setCounters] = useState(STATS.map(() => 0));

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timers = STATS.map((stat, index) => {
      const increment = stat.value / steps;
      let current = 0;
      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = stat.value;
            return newCounters;
          });
          clearInterval(timers[index]);
        } else {
          setCounters((prev) => {
            const newCounters = [...prev];
            newCounters[index] = Math.floor(current);
            return newCounters;
          });
        }
      }, interval);
    });

    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-green-50 via-yellow-50 to-green-100 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  🌱 Trusted by 15,000+ Farmers
                </span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Farm<span className="text-green-600">हित</span>
                <br />
                <span className="text-4xl lg:text-5xl text-gray-700">
                  For the Welfare of Farmers
                </span>
              </h1>
              <p className="text-2xl text-gray-600 leading-relaxed">
                किसानों के कल्याण के लिए | Accurate soil testing, expert advisory, and sustainable farming solutions at your fingertips
              </p>
              <div className="flex flex-wrap gap-6">
                <button
                  onClick={() => navigateTo('book-test')}
                  className="btn-primary animate-bounce-subtle"
                >
                  Book Soil Test Now
                </button>
                <button
                  onClick={() => navigateTo('services')}
                  className="btn-secondary"
                >
                  Explore Services
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <span>₹299 onwards</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <span>5-7 day reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <span>Free pickup</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 rounded-3xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sprout size={200} className="text-white opacity-20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center p-8">
                  <p className="text-white text-center text-xl font-semibold">
                    Empowering 500+ Villages Across India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-green-600 mb-2">
                  {counters[index].toLocaleString()}{stat.suffix}
                </div>
                <div className="text-lg font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              How It Works | <span className="text-green-600">कैसे काम करता है</span>
            </h2>
            <p className="text-2xl text-gray-600">
              Three simple steps to better soil health and higher yields
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-10 shadow-lg card-hover hover-glow">
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mb-8 hover-lift">
                <Beaker size={40} className="text-primary-600" />
              </div>
              <div className="text-5xl font-bold text-primary-600 mb-6 animate-pulse-slow">01</div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Book Your Test</h3>
              <p className="text-gray-600 leading-relaxed text-xl">
                Choose a soil testing package online. We offer free sample pickup from your farm or nearest collection center.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-lg card-hover hover-glow">
              <div className="w-20 h-20 bg-accent-100 rounded-2xl flex items-center justify-center mb-8 hover-lift">
                <TrendingUp size={40} className="text-accent-600" />
              </div>
              <div className="text-5xl font-bold text-accent-600 mb-6 animate-pulse-slow">02</div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Get Accurate Results</h3>
              <p className="text-gray-600 leading-relaxed text-xl">
                Our certified labs analyze your soil sample for pH, NPK, micronutrients, and organic content within 5-7 days.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-lg card-hover hover-glow">
              <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mb-8 hover-lift">
                <Leaf size={40} className="text-primary-600" />
              </div>
              <div className="text-5xl font-bold text-primary-600 mb-6 animate-pulse-slow">03</div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Apply Recommendations</h3>
              <p className="text-gray-600 leading-relaxed text-xl">
                Receive detailed fertilizer recommendations and crop-specific advice to maximize yield and soil health.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Our Services | <span className="text-green-600">हमारी सेवाएं</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-10 border-2 border-primary-200 card-hover">
              <Beaker size={56} className="text-primary-600 mb-6 hover-lift" />
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Soil Testing</h3>
              <p className="text-gray-700 mb-8 text-xl leading-relaxed">
                Comprehensive soil analysis with NPK, pH, micronutrients, and organic carbon testing from certified labs.
              </p>
              <button
                onClick={() => navigateTo('services')}
                className="text-primary-600 font-bold flex items-center gap-3 hover:gap-4 transition-all duration-300 text-lg hover-lift"
              >
                Learn More <ArrowRight size={24} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-3xl p-10 border-2 border-accent-200 card-hover">
              <Leaf size={56} className="text-accent-600 mb-6 hover-lift" />
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Residue Sell Portal</h3>
              <p className="text-gray-700 mb-8 text-xl leading-relaxed">
                Turn crop waste into income. Connect with biopellet plants and earn from paddy stubble, cotton stalks, and more.
              </p>
              <button
                onClick={() => navigateTo('services')}
                className="text-accent-600 font-bold flex items-center gap-3 hover:gap-4 transition-all duration-300 text-lg hover-lift"
              >
                Learn More <ArrowRight size={24} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-3xl p-10 border-2 border-primary-200 card-hover">
              <Users size={56} className="text-primary-600 mb-6 hover-lift" />
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Farm Advisory</h3>
              <p className="text-gray-700 mb-8 text-xl leading-relaxed">
                Expert agronomist consultations, fertilizer planning, and crop-specific recommendations based on your soil report.
              </p>
              <button
                onClick={() => navigateTo('services')}
                className="text-primary-600 font-bold flex items-center gap-3 hover:gap-4 transition-all duration-300 text-lg hover-lift"
              >
                Learn More <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">
              Why Choose Farmहित?
            </h2>
            <p className="text-2xl text-green-100">
              The complete soil health and sustainability platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Certified Labs', desc: '45+ partner labs across India' },
              { icon: CheckCircle, title: 'Affordable', desc: 'Starting at just ₹299' },
              { icon: TrendingUp, title: 'Fast Reports', desc: '5-7 day turnaround time' },
              { icon: Leaf, title: 'Sustainable', desc: 'Promoting eco-friendly farming' },
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all">
                <item.icon size={40} className="mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-xl text-green-100">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Farmer Success Stories | <span className="text-green-600">किसान सफलता की कहानियां</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-lg card-hover hover-glow">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-accent-400 text-2xl hover-lift">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-xl">"{testimonial.text}"</p>
                <div className="border-t border-gray-100 pt-6">
                  <p className="font-bold text-gray-900 text-xl">{testimonial.name}</p>
                  <p className="text-lg text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-2xl text-gray-600">Trusted by leading institutions and organizations</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {PARTNERS.map((partner) => (
              <div key={partner.id} className="bg-gray-50 rounded-xl p-6 flex items-center justify-center hover:bg-gray-100 transition-all">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">{partner.name.charAt(0)}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-lg">{partner.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-r from-green-600 to-yellow-500">
        <div className="w-full px-6 sm:px-8 lg:px-12 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Improve Your Soil Health?
          </h2>
          <p className="text-2xl text-white mb-8">
            Join 15,000+ farmers who trust Farmहित for accurate soil testing and sustainable farming
          </p>
          <button
            onClick={() => navigateTo('book-test')}
            className="btn-primary animate-bounce-subtle"
          >
            Book Your Soil Test Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
