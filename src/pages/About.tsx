import { Award, Heart, Leaf, Sprout, Target, TrendingUp, Users } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const About = () => {
  const { navigateTo } = useNavigation();

  const milestones = [
    {
      year: '2022',
      title: 'FarmHith founded',
      description: 'Started with one goal: make soil testing practical and accessible for every farmer.',
    },
    {
      year: '2023',
      title: '10,000 tests completed',
      description: 'Built trust through accurate reports and field-friendly recommendations.',
    },
    {
      year: '2024',
      title: 'Residue marketplace launched',
      description: 'Enabled farmers to monetize crop residue instead of burning it.',
    },
    {
      year: '2025',
      title: '500+ villages reached',
      description: 'Expanded partner network of labs and buyers across multiple regions.',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Farmer First',
      description: 'Every workflow is designed to save time, reduce confusion, and improve outcomes in the field.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We focus on long-term soil health and climate-positive residue management.',
    },
    {
      icon: TrendingUp,
      title: 'Actionable Data',
      description: 'Reports are translated into clear next steps, not just lab numbers.',
    },
    {
      icon: Heart,
      title: 'Trust & Care',
      description: 'Transparent pricing, reliable support, and accountable partnerships.',
    },
  ];

  const team = [
    { name: 'Dr. Rajesh Kumar', role: 'Founder & Chief Agronomist', focus: 'Soil science and advisory models' },
    { name: 'Priya Sharma', role: 'Head of Operations', focus: 'Lab network and service quality' },
    { name: 'Amandeep Singh', role: 'Technology Director', focus: 'Platform and data systems' },
    { name: 'Neha Patel', role: 'Farmer Relations', focus: 'Field onboarding and support' },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="ambient-orb top-[-10%] left-[-6%] h-72 w-72 bg-primary-300/60" />
          <div className="ambient-orb right-[-8%] bottom-[-18%] h-80 w-80 bg-accent-200/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-primary-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700">
            Why FarmHith exists
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 leading-tight max-w-4xl">
            Building a cleaner, smarter
            <span className="text-primary-700"> agri ecosystem</span>
            for farmers and partners.
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            FarmHith bridges farmers, soil labs, and biomass buyers to improve farm decisions, unlock new income, and reduce stubble burning.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => navigateTo('services')} className="btn-primary">
              Explore Services
            </button>
            <button onClick={() => navigateTo('contact')} className="btn-secondary">
              Talk to Team
            </button>
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-4">
          {[
            { value: '25,000+', label: 'Soil reports delivered' },
            { value: '45+', label: 'Partner labs' },
            { value: '15,000+', label: 'Farmers served' },
          ].map((stat) => (
            <div key={stat.label} className="card-hover surface-3d p-6 text-center">
              <p className="text-4xl font-display text-primary-700">{stat.value}</p>
              <p className="text-slate-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
          <div className="card-hover surface-3d p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl">Our Story</h2>
            <div className="mt-4 space-y-4 text-slate-600 leading-relaxed">
              <p>
                FarmHith started after seeing a repeated pattern. Farmers wanted better yields, but reliable soil insights were difficult to access and often too hard to act on.
              </p>
              <p>
                We built a platform where test booking, lab processing, and recommendations happen in one simple flow. Then we extended that flow to residue commerce, turning waste into income.
              </p>
              <p>
                Today, we continue to focus on practical outcomes: lower input waste, healthier soil, cleaner air, and stronger farm economics.
              </p>
            </div>
          </div>

          <div className="card-hover surface-3d p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl">Milestones</h2>
            <div className="mt-5 space-y-4">
              {milestones.map((item) => (
                <div key={item.year} className="rounded-2xl border border-primary-100 bg-[#f8fdf9] p-4">
                  <p className="text-sm font-semibold text-primary-700">{item.year}</p>
                  <p className="text-lg font-semibold text-slate-900 mt-0.5">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl">What We Stand For</h2>
            <p className="text-slate-600 mt-2">The values guiding product, support, and field execution.</p>
          </div>
          <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {values.map((value) => (
              <div key={value.title} className="card-hover surface-3d p-5">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <value.icon size={18} />
                </div>
                <h3 className="text-xl mt-4">{value.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-6 md:p-8">
            <div className="flex items-center gap-2 text-primary-700 font-semibold">
              <Users size={18} />
              Team
            </div>
            <h2 className="text-3xl md:text-4xl mt-2">People behind FarmHith</h2>
            <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              {team.map((member) => (
                <button
                  key={member.name}
                  onClick={() => navigateTo('contact')}
                  className="text-left rounded-2xl border border-primary-100 bg-white p-4 hover:border-primary-300 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                    <Sprout size={18} />
                  </div>
                  <p className="mt-3 font-semibold text-slate-900">{member.name}</p>
                  <p className="text-sm text-primary-700 mt-0.5">{member.role}</p>
                  <p className="text-xs text-slate-600 mt-2">{member.focus}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-8 md:p-10 text-center">
            <p className="inline-flex items-center gap-2 text-primary-700 font-semibold">
              <Award size={18} />
              Ready to collaborate
            </p>
            <h2 className="text-3xl md:text-4xl mt-3">Let us improve outcomes together</h2>
            <p className="mt-3 text-slate-600">
              Whether you are a farmer, a lab, or a biomass buyer, FarmHith is built to make your workflow simpler.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={() => navigateTo('book-test')} className="btn-primary">
                Book Soil Test
              </button>
              <button onClick={() => navigateTo('partners')} className="btn-secondary">
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
