import { ArrowRight, Beaker, Check, Factory, Phone, Sprout, Truck, Users } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { SERVICE_PACKAGES } from '../utils/constants';

const Services = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="ambient-orb top-[-7%] left-[-8%] h-72 w-72 bg-primary-300/60" />
          <div className="ambient-orb right-[-9%] bottom-[-20%] h-80 w-80 bg-accent-200/70" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-primary-200 bg-white/90 px-4 py-1.5 text-xs font-semibold text-primary-700">
            End-to-end soil and residue services
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-display text-slate-900 leading-tight max-w-4xl">
            Built for
            <span className="text-primary-700"> on-ground clarity</span>,
            designed for results.
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl">
            Choose a soil testing package, monetize crop residue, and get advisory support all within one connected platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => navigateTo('book-test')} className="btn-primary">
              Book Soil Test
            </button>
            <button onClick={() => navigateTo('contact')} className="btn-secondary">
              Talk to Advisor
            </button>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl md:text-4xl">Soil Testing Packages</h2>
              <p className="text-slate-600 mt-2">Pick a package based on depth, turnaround, and crop planning needs.</p>
            </div>
            <button onClick={() => navigateTo('reports')} className="btn-secondary">
              Track Existing Reports
            </button>
          </div>

          <div className="mt-8 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {SERVICE_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => navigateTo('book-test')}
                className={`card-hover surface-3d p-6 text-left relative ${
                  pkg.popular ? 'ring-2 ring-accent-400 shadow-glow-yellow' : ''
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-5 rounded-full bg-accent-500 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                <p className="text-sm font-semibold text-primary-700">{pkg.turnaroundDays} day turnaround</p>
                <h3 className="text-2xl mt-1">{pkg.name}</h3>
                <p className="text-slate-600 mt-2 text-sm min-h-[40px]">{pkg.description}</p>

                <div className="mt-5 flex items-end gap-1">
                  <p className="text-4xl font-display text-primary-700">Rs {pkg.price}</p>
                  <p className="text-slate-500 text-sm pb-1">per test</p>
                </div>

                <div className="mt-4 space-y-2">
                  {pkg.parameters.slice(0, 4).map((param) => (
                    <div key={param} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check size={16} className="text-primary-700 mt-0.5 flex-shrink-0" />
                      <span>{param}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-700">
                  Book this package <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-6">
          <div className="card-hover surface-3d p-6 md:p-8">
            <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Truck size={20} />
            </div>
            <h3 className="text-2xl md:text-3xl mt-4">Crop Residue Marketplace</h3>
            <p className="text-slate-600 mt-3">
              List paddy straw, husk, cotton stalk, and other residue lots to connect with verified biomass buyers.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              {[
                'Smart matching by location and availability',
                'Buyer discovery with transparent pricing',
                'Reduced stubble burning and cleaner air impact',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-slate-700">
                  <Check size={16} className="text-primary-700 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigateTo('contact')} className="btn-primary mt-6">
              Start Selling Residue
            </button>
          </div>

          <div className="card-hover surface-3d p-6 md:p-8">
            <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <Users size={20} />
            </div>
            <h3 className="text-2xl md:text-3xl mt-4">Advisory Services</h3>
            <p className="text-slate-600 mt-3">
              Convert your lab report into crop-specific input plans with guidance from experienced agronomists.
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              {[
                'Phone consultation',
                'Field visit assistance',
                'Season planning',
                'Nutrient correction roadmap',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-primary-100 bg-white px-3 py-2 text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => navigateTo('contact')} className="btn-secondary mt-6">
              <Phone size={16} />
              Book Consultation
            </button>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-hover surface-3d p-6 md:p-10">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <div>
                <p className="inline-flex items-center gap-2 text-primary-700 font-semibold">
                  <Factory size={18} />
                  Partner Ecosystem
                </p>
                <h2 className="text-3xl md:text-4xl mt-2">Lab and biomass partner onboarding</h2>
                <p className="text-slate-600 mt-3">
                  Certified labs and biomass plants can join FarmHith to receive high-intent requests and structured workflows.
                </p>
                <button onClick={() => navigateTo('partners')} className="btn-primary mt-6">
                  Partner With FarmHith
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Beaker, label: 'Digital report submission' },
                  { icon: Sprout, label: 'Farmer-ready recommendation format' },
                  { icon: Truck, label: 'Residue pickup coordination' },
                  { icon: Users, label: 'Role-based platform access' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-primary-100 bg-[#f8fdf9] p-4">
                    <item.icon size={18} className="text-primary-700" />
                    <p className="text-sm text-slate-700 mt-2">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
