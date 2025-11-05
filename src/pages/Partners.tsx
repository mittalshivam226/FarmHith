import { Building, Heart, GraduationCap, Zap, CheckCircle } from 'lucide-react';
import { PARTNERS } from '../utils/constants';

const Partners = () => {
  const partnerTypes = [
    {
      type: 'lab',
      icon: Building,
      title: 'Testing Laboratories',
      count: 45,
      desc: 'Certified labs across India ensuring accurate soil analysis',
    },
    {
      type: 'ngo',
      icon: Heart,
      title: 'NGO Partners',
      count: 12,
      desc: 'Organizations working for farmer welfare and sustainable agriculture',
    },
    {
      type: 'institution',
      icon: GraduationCap,
      title: 'Academic Institutions',
      count: 8,
      desc: 'Universities and research centers advancing soil science',
    },
    {
      type: 'energy',
      icon: Zap,
      title: 'Clean Energy Firms',
      count: 15,
      desc: 'Biopellet plants converting crop residue into renewable energy',
    },
  ];

  const benefits = [
    'Access to a growing network of 15,000+ farmers',
    'Digital platform for seamless operations',
    'Timely payments and transparent pricing',
    'Marketing and brand visibility support',
    'Training on latest technologies and standards',
    'Quality certification assistance',
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Our Partners | हमारे साझेदार</h1>
            <p className="text-xl text-green-100 leading-relaxed">
              Building a sustainable agriculture ecosystem together
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partner Network</h2>
            <p className="text-xl text-gray-600">
              80+ organizations across India working with Farmहित
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerTypes.map((partnerType, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-6 border-2 border-green-200 text-center hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <partnerType.icon size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">{partnerType.count}+</h3>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{partnerType.title}</h4>
                <p className="text-gray-600 text-sm">{partnerType.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Partners</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-all"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-yellow-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-3xl font-bold text-green-600">
                      {partner.name.charAt(0)}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">{partner.name}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {partner.type === 'lab' ? 'Lab' : partner.type === 'ngo' ? 'NGO' : partner.type === 'institution' ? 'Institution' : 'Energy'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Become a Partner
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Join India's fastest-growing soil health and sustainable agriculture platform
              </p>
              <div className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all shadow-lg">
                Apply for Partnership
              </button>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-6">Partnership Categories</h3>
              <div className="space-y-4">
                {[
                  { title: 'Soil Testing Labs', desc: 'NABL-certified or government-approved labs' },
                  { title: 'Agricultural NGOs', desc: 'Organizations working with farmer communities' },
                  { title: 'Biopellet Plants', desc: 'Facilities converting crop residue to energy' },
                  { title: 'Input Suppliers', desc: 'Fertilizer, seed, and equipment companies' },
                  { title: 'Financial Institutions', desc: 'Banks and NBFCs offering agri-loans' },
                ].map((category, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-1">{category.title}</h4>
                    <p className="text-green-100 text-sm">{category.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-yellow-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">How our partnerships are creating impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                partner: 'Green Lab Network',
                type: 'Testing Laboratory',
                impact: 'Increased sample volume by 300% in 6 months',
                quote: 'Farmहित brought us consistent business and helped us serve farmers better.',
              },
              {
                partner: 'Bio Energy Solutions',
                type: 'Biopellet Plant',
                impact: 'Collected 5,000 tons of crop residue in first year',
                quote: 'The platform made residue procurement seamless and farmer-friendly.',
              },
              {
                partner: 'Rural Development NGO',
                type: 'NGO Partner',
                impact: 'Reached 50+ villages with affordable soil testing',
                quote: 'This partnership transformed how we deliver agricultural services.',
              },
            ].map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                  <Building size={28} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{story.partner}</h3>
                <p className="text-sm text-green-600 font-semibold mb-4">{story.type}</p>
                <p className="text-gray-700 mb-4 font-semibold">{story.impact}</p>
                <p className="text-gray-600 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
