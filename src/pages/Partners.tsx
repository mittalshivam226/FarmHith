import { Building, CheckCircle, GraduationCap, Heart, Zap } from 'lucide-react';
import { PARTNERS } from '../utils/constants';
import { useNavigation } from '../context/NavigationContext';

const Partners = () => {
  const { navigateTo } = useNavigation();

  const partnerTypes = [
    {
      type: 'lab',
      icon: Building,
      title: 'Testing Laboratories',
      count: 45,
      desc: 'Certified labs ensuring reliable and timely analysis.',
    },
    {
      type: 'ngo',
      icon: Heart,
      title: 'NGO Partners',
      count: 12,
      desc: 'Organizations supporting farmer outreach and adoption.',
    },
    {
      type: 'institution',
      icon: GraduationCap,
      title: 'Academic Institutions',
      count: 8,
      desc: 'Universities and research centers advancing soil science.',
    },
    {
      type: 'energy',
      icon: Zap,
      title: 'Clean Energy Firms',
      count: 15,
      desc: 'Biomass players converting residue into renewable fuel.',
    },
  ];

  const benefits = [
    'Access to 15,000+ farmers across service regions',
    'Structured digital operations and reporting workflows',
    'Transparent pricing and faster order coordination',
    'Co-branding and visibility within FarmHith channels',
    'Support for quality and compliance practices',
    'Collaboration on pilot programs and new services',
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
            Ecosystem partnerships
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 leading-tight max-w-4xl">
            Building impact through
            <span className="text-primary-700"> trusted partners</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            FarmHith connects labs, institutions, NGOs, and biomass players to create measurable value for farmers and sustainability goals.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl">Partner Network</h2>
          <p className="text-slate-600 mt-2">80+ organizations collaborating across testing, education, and residue markets.</p>
          <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {partnerTypes.map((partnerType) => (
              <button
                key={partnerType.type}
                onClick={() => navigateTo('contact')}
                className="card-hover surface-3d p-5 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                  <partnerType.icon size={18} />
                </div>
                <p className="text-3xl font-display text-primary-700 mt-4">{partnerType.count}+</p>
                <h3 className="text-lg mt-1">{partnerType.title}</h3>
                <p className="text-sm text-slate-600 mt-2">{partnerType.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl">Featured Partners</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[...PARTNERS, ...PARTNERS].map((partner, index) => (
              <button
                key={`${partner.id}-${index}`}
                onClick={() => navigateTo('contact')}
                className="card-hover surface-3d p-4 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center mx-auto font-semibold">
                  {partner.name.charAt(0)}
                </div>
                <p className="text-sm font-semibold text-slate-900 mt-3">{partner.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {partner.type === 'institution'
                    ? 'Institution'
                    : partner.type === 'energy'
                    ? 'Energy'
                    : partner.type.toUpperCase()}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
          <div className="card-hover surface-3d p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl">Become a Partner</h2>
            <p className="text-slate-600 mt-3">
              Join FarmHith to collaborate on farmer services, lab scale-up, and residue value chains.
            </p>
            <div className="mt-5 space-y-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2 text-sm text-slate-700">
                  <CheckCircle size={16} className="text-primary-700 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigateTo('contact')} className="btn-primary mt-6">
              Apply for Partnership
            </button>
          </div>

          <div className="card-hover surface-3d p-6 md:p-8">
            <h3 className="text-2xl">Partnership Categories</h3>
            <div className="mt-4 space-y-3">
              {[
                { title: 'Soil Testing Labs', desc: 'NABL-certified or government-approved testing centers' },
                { title: 'Agricultural NGOs', desc: 'Organizations with farmer networks and field programs' },
                { title: 'Biomass Plants', desc: 'Residue processing and bioenergy conversion operators' },
                { title: 'Input Suppliers', desc: 'Seed, nutrient, and equipment distribution partners' },
                { title: 'Financial Institutions', desc: 'Agri-focused banking and finance ecosystem players' },
              ].map((category) => (
                <div key={category.title} className="rounded-xl border border-primary-100 bg-[#f8fdf9] p-4">
                  <h4 className="font-semibold text-slate-900">{category.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{category.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl">Success Stories</h2>
            <p className="text-slate-600 mt-2">Examples of measurable outcomes from partner collaborations.</p>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {[
                {
                  partner: 'Green Lab Network',
                  type: 'Testing Laboratory',
                  impact: 'Increased sample volume by 300 percent in six months.',
                },
                {
                  partner: 'Bio Energy Solutions',
                  type: 'Biomass Plant',
                  impact: 'Collected 5,000 tons of crop residue in the first year.',
                },
                {
                  partner: 'Rural Development NGO',
                  type: 'NGO Partner',
                  impact: 'Expanded affordable testing access across 50+ villages.',
                },
              ].map((story) => (
                <div key={story.partner} className="rounded-2xl border border-primary-100 bg-white p-4">
                  <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center">
                    <Building size={16} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mt-3">{story.partner}</h3>
                  <p className="text-xs text-primary-700 mt-1">{story.type}</p>
                  <p className="text-sm text-slate-600 mt-3">{story.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
