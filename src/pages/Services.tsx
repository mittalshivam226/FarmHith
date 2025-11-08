import { Check, Leaf, Users, Phone } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { SERVICE_PACKAGES } from '../utils/constants';

const Services = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-24">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold mb-6">Our Services | हमारी सेवाएं</h1>
            <p className="text-2xl text-green-100 leading-relaxed">
              Comprehensive soil health solutions for sustainable farming and increased productivity
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Soil Testing Packages</h2>
            <p className="text-2xl text-gray-600">मिट्टी परीक्षण पैकेज | Choose the right test for your farm</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {SERVICE_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                  pkg.popular
                    ? 'border-4 border-yellow-400 relative'
                    : 'border-2 border-gray-200'
                }`}
              >
                {pkg.popular && (
                  <div className="bg-yellow-400 text-gray-900 text-center py-2 font-bold text-sm">
                    ⭐ MOST POPULAR
                  </div>
                )}
                <div className="bg-gradient-to-br from-green-50 to-yellow-50 p-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <p className="text-xl text-gray-600 mb-4">{pkg.nameHindi}</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-6xl font-bold text-green-600">₹{pkg.price}</span>
                    <span className="text-lg text-gray-600">per test</span>
                  </div>
                  <p className="text-gray-700 mb-6 text-lg">{pkg.description}</p>
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Turnaround Time: <span className="text-green-600">{pkg.turnaroundDays} days</span>
                    </p>
                  </div>
                  <button
                    onClick={() => navigateTo('book-test')}
                    className={`w-full py-3 rounded-lg font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Book This Test
                  </button>
                </div>
                <div className="bg-white p-8">
                  <p className="font-semibold text-gray-900 mb-4">Parameters Tested:</p>
                  <ul className="space-y-3">
                    {pkg.parameters.map((param, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-lg">{param}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-yellow-100 px-4 py-2 rounded-full mb-6">
                <span className="text-yellow-800 font-semibold text-lg">Turn Waste into Wealth</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                <Leaf className="inline-block mb-2 text-green-600" size={40} />
                <br />
                Residue Sell Portal
              </h2>
              <p className="text-2xl text-gray-700 leading-relaxed mb-6">
                फसल अवशेष बेचें और कमाएं | Stop burning crop residue and start earning from it
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Connect directly with certified biopellet plants',
                  'Fair market prices for paddy stubble, cotton stalks, sugarcane trash',
                  'Free pickup arrangements for bulk quantities',
                  'Contribute to cleaner air and sustainable energy',
                  'Earn ₹2-5 per kg depending on residue type and quantity',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check size={28} className="text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-xl">{benefit}</p>
                  </div>
                ))}
              </div>
              <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-all shadow-lg">
                Register to Sell Residue
              </button>
            </div>
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-12 text-center shadow-2xl">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 mb-8">
                <h3 className="text-5xl font-bold text-white mb-2">₹12,000</h3>
                <p className="text-white text-xl">Average earnings per acre of paddy stubble</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8">
                <h3 className="text-5xl font-bold text-white mb-2">Zero</h3>
                <p className="text-white text-xl">Air pollution from burning when you sell residue</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-12 text-white shadow-2xl">
              <Users size={80} className="mb-6" />
              <h3 className="text-4xl font-bold mb-4">Expert Agronomist Support</h3>
              <p className="text-2xl text-green-100 mb-6">
                Get personalized advice from certified agricultural experts
              </p>
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold text-xl">📞 Phone Consultation</p>
                  <p className="text-green-100 text-lg">30-min call: ₹499</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold text-xl">🚜 Farm Visit</p>
                  <p className="text-green-100 text-lg">On-site inspection: ₹2,999</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="font-semibold text-xl">📋 Annual Plan</p>
                  <p className="text-green-100 text-lg">Full-season support: ₹9,999</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                <Users className="inline-block mb-2 text-green-600" size={40} />
                <br />
                Farm Advisory Services
              </h2>
              <p className="text-2xl text-gray-700 leading-relaxed mb-6">
                कृषि सलाहकार सेवाएं | Personalized guidance based on your soil report
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Customized fertilizer recommendations for your crop',
                  'Soil amendment strategies (lime, gypsum, organic matter)',
                  'Crop rotation planning for soil health',
                  'Irrigation scheduling based on soil moisture',
                  'Pest and disease management advice',
                  'Market linkage for quality inputs',
                ].map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check size={28} className="text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-xl">{service}</p>
                  </div>
                ))}
              </div>
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg flex items-center gap-2">
                <Phone size={24} />
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">Lab Registration Portal</h2>
            <p className="text-2xl text-green-100">Partner with us to serve farmers in your region</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">Benefits for Partner Labs</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Steady stream of soil samples',
                'Digital platform for report submission',
                'Timely payments and transparent pricing',
                'Quality certification support',
                'Training on latest testing methods',
                'Brand visibility on our platform',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check size={28} className="text-green-300 flex-shrink-0 mt-1" />
                  <p className="text-white text-lg">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-500 transition-all">
                Apply as Partner Lab
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-2xl p-12 text-center border-2 border-green-200">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Ready to Start Your Soil Health Journey?
            </h2>
            <p className="text-2xl text-gray-700 mb-8">
              Join thousands of farmers who trust Farmहित for accurate testing and expert advice
            </p>
            <button
              onClick={() => navigateTo('book-test')}
              className="bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Book Your Test Now →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
