import { ArrowRight, Beaker, Leaf, Landmark, TrendingUp, Truck } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { STATS } from '../utils/constants';

const Home = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[-8%] h-72 w-72 rounded-full bg-primary-200/60 blur-3xl animate-float-soft" />
          <div className="absolute right-[-7%] bottom-[-12%] h-80 w-80 rounded-full bg-accent-200/70 blur-3xl animate-float-soft" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/80 border border-primary-200 px-4 py-2 text-xs font-semibold text-primary-700">
                Sustainable farming network for India
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 leading-tight">
                Grow smarter with
                <span className="text-primary-700"> soil intelligence</span> and
                <span className="text-accent-600"> residue income.</span>
              </h1>
              <p className="mt-5 text-lg text-slate-600 max-w-xl">
                FarmHith helps farmers book soil testing, get clear recommendations, and sell crop residue to trusted biomass buyers.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => navigateTo('book-test')} className="btn-primary">
                  Book Soil Test
                </button>
                <button onClick={() => navigateTo('services')} className="btn-secondary">
                  Explore Services
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="card-hover p-4">
                  <p className="font-semibold text-slate-900">Affordable</p>
                  <p className="text-slate-600 mt-1">Starting at Rs 299</p>
                </div>
                <div className="card-hover p-4">
                  <p className="font-semibold text-slate-900">Fast reports</p>
                  <p className="text-slate-600 mt-1">Typically 5-7 days</p>
                </div>
                <div className="card-hover p-4 col-span-2 sm:col-span-1">
                  <p className="font-semibold text-slate-900">Field support</p>
                  <p className="text-slate-600 mt-1">Pickup and guidance</p>
                </div>
              </div>
            </div>

            <div className="card-hover p-6 md:p-8 bg-white/90">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Beaker, title: 'Soil Testing', desc: 'NPK, pH, moisture and advisory' },
                  { icon: Leaf, title: 'Residue Sales', desc: 'List and monetize crop residue' },
                  { icon: Truck, title: 'Logistics', desc: 'Pickup and buyer coordination' },
                  { icon: Landmark, title: 'Trusted Labs', desc: 'Reliable analysis and records' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[#ece2ce] bg-[#fffdf8] p-4">
                    <item.icon size={20} className="text-primary-700" />
                    <p className="mt-3 font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigateTo('partners')}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-primary-300 bg-primary-50 px-4 py-3 text-primary-700 font-semibold hover:bg-primary-100 transition-colors"
              >
                View Ecosystem Partners <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, index) => (
              <div key={index} className="card-hover p-5 text-center">
                <p className="text-3xl font-display font-bold text-primary-700">{stat.value.toLocaleString()}{stat.suffix}</p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-display">How FarmHith Works</h2>
            <p className="text-slate-600 mt-2">Three simple steps from sample to better yield.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div onClick={() => navigateTo('book-test')} className="card-hover p-6 cursor-pointer">
              <div className="text-accent-600 font-display font-bold text-4xl">01</div>
              <h3 className="mt-2 text-xl font-semibold">Book a Soil Test</h3>
              <p className="mt-2 text-slate-600 text-sm">Submit details in minutes and choose your sample collection method.</p>
            </div>
            <div onClick={() => navigateTo('reports')} className="card-hover p-6 cursor-pointer">
              <div className="text-accent-600 font-display font-bold text-4xl">02</div>
              <h3 className="mt-2 text-xl font-semibold">Track and Review</h3>
              <p className="mt-2 text-slate-600 text-sm">See progress and receive clear parameter-wise insights from lab reports.</p>
            </div>
            <div onClick={() => navigateTo('services')} className="card-hover p-6 cursor-pointer">
              <div className="text-accent-600 font-display font-bold text-4xl">03</div>
              <h3 className="mt-2 text-xl font-semibold">Act and Earn</h3>
              <p className="mt-2 text-slate-600 text-sm">Apply recommendations and sell crop residue through the marketplace network.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#e8dcc5] bg-white/85 p-8 md:p-12 text-center shadow-card-hover">
            <p className="inline-flex items-center gap-2 text-accent-700 font-semibold">
              <TrendingUp size={18} />
              Built for real farm decisions
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-display">Ready to improve soil health and farm income?</h2>
            <p className="mt-3 text-slate-600">
              Start with one soil test and unlock a better fertilizer plan plus residue monetization opportunities.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button onClick={() => navigateTo('book-test')} className="btn-primary">Start Now</button>
              <button onClick={() => navigateTo('contact')} className="btn-secondary">Talk to Team</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

