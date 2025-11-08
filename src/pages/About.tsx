import { Target, Heart, Award, Users, TrendingUp, Leaf } from 'lucide-react';

const About = () => {
  const timeline = [
    { year: '2022', event: 'Farmहित Founded', desc: 'Started with a vision to make soil testing accessible to every farmer' },
    { year: '2023', event: '10,000 Tests Milestone', desc: 'Reached 10,000 successful soil tests across 5 states' },
    { year: '2024', event: 'Residue Portal Launch', desc: 'Introduced crop residue trading platform connecting farmers with biopellet plants' },
    { year: '2025', event: '500+ Villages', desc: 'Expanded to 500+ villages with 45+ partner labs nationwide' },
  ];

  const team = [
    { name: 'Dr. Rajesh Kumar', role: 'Founder & Chief Agronomist', expertise: 'Soil Science, 20+ years' },
    { name: 'Priya Sharma', role: 'Head of Operations', expertise: 'Agricultural Technology' },
    { name: 'Amandeep Singh', role: 'Technical Director', expertise: 'Lab Management & Quality' },
    { name: 'Neha Patel', role: 'Farmer Relations', expertise: 'Community Outreach' },
  ];

  const sdgs = [
    { number: 2, title: 'Zero Hunger', desc: 'Improving crop yields through better soil management' },
    { number: 12, title: 'Responsible Consumption', desc: 'Reducing fertilizer waste and promoting precision farming' },
    { number: 13, title: 'Climate Action', desc: 'Converting crop residue to clean energy instead of burning' },
    { number: 15, title: 'Life on Land', desc: 'Restoring soil health and promoting sustainable agriculture' },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-6xl font-bold mb-6">
              About Farm<span className="text-yellow-400">हित</span>
            </h1>
            <p className="text-2xl text-green-100 leading-relaxed">
              हमारे बारे में | Empowering farmers through accurate soil testing and sustainable agricultural practices since 2022
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Farmहित was born from a simple observation: Indian farmers needed affordable, accurate soil testing but faced significant barriers—expensive labs, complicated processes, and lack of actionable advice.
                </p>
                <p>
                  Founded in 2022 by agricultural scientists and technology enthusiasts, we set out to democratize soil health testing. Starting in Panipat, Haryana, we partnered with local labs to create a streamlined, farmer-friendly testing process.
                </p>
                <p>
                  Today, we've grown to serve 15,000+ farmers across multiple states, partnering with 45+ certified laboratories and educational institutions. Our platform has analyzed over 25,000 soil samples, helping farmers save on fertilizer costs while improving yields.
                </p>
                <p>
                  Beyond testing, we've pioneered a crop residue trading platform that converts agricultural waste into income, addressing both environmental concerns and farmer economics.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {timeline.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 border-l-4 border-green-600">
                  <div className="flex items-start gap-4">
                    <div className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-lg flex-shrink-0">
                      {item.year}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-2xl mb-2">{item.event}</h3>
                      <p className="text-gray-600 text-lg">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Target size={32} className="text-green-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-xl">
                To make accurate, affordable soil testing accessible to every Indian farmer, empowering them with data-driven insights for sustainable farming and improved livelihoods.
              </p>
              <p className="text-gray-700 leading-relaxed text-xl mt-4">
                <span className="font-semibold text-green-600">हमारा मिशन:</span> हर भारतीय किसान को सटीक और किफायती मिट्टी परीक्षण उपलब्ध कराना।
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Heart size={32} className="text-yellow-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed text-xl">
                A future where every farmer has the knowledge and tools to nurture healthy soil, grow abundant crops sustainably, and contribute to environmental conservation while earning better.
              </p>
              <p className="text-gray-700 leading-relaxed text-xl mt-4">
                <span className="font-semibold text-yellow-600">हमारा विजन:</span> स्वस्थ मिट्टी, टिकाऊ खेती, और बेहतर आजीविका।
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-2xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'Accuracy', desc: 'Certified labs, precise results, no compromise on quality' },
              { icon: Leaf, title: 'Sustainability', desc: 'Promoting eco-friendly farming and circular economy' },
              { icon: Users, title: 'Accessibility', desc: 'Affordable pricing, simple process, farmer-first approach' },
              { icon: TrendingUp, title: 'Trust', desc: 'Transparent pricing, reliable service, proven results' },
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-lg">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-2xl text-gray-600">Experts dedicated to farmer welfare</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Users size={80} className="text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-gray-900 text-xl mb-1">{member.name}</h3>
                  <p className="text-green-600 font-semibold text-base mb-2">{member.role}</p>
                  <p className="text-gray-600 text-base">{member.expertise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Contributing to UN Sustainable Development Goals
            </h2>
            <p className="text-2xl text-gray-600">Our commitment to global sustainability</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {sdgs.map((sdg, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-8 border-2 border-green-200">
                <div className="flex items-start gap-4">
                  <div className="bg-green-600 text-white font-bold text-2xl w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                    {sdg.number}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{sdg.title}</h3>
                    <p className="text-gray-700 text-lg">{sdg.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">Awards & Recognition</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { award: 'Best AgriTech Startup 2023', org: 'National Farmers Association' },
              { award: 'Sustainability Excellence Award', org: 'Green India Initiative' },
              { award: 'Top 10 Rural Innovation', org: 'Ministry of Agriculture' },
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <Award size={48} className="mx-auto mb-4 text-yellow-400" />
                <h3 className="text-2xl font-bold mb-2">{item.award}</h3>
                <p className="text-green-100 text-lg">{item.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
