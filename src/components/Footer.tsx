import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const Footer = () => {
  const { navigateTo } = useNavigation();

  return (
    <footer className="mt-14 bg-[#1f2b20] text-[#d8dfd1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-2xl text-white mb-3">FarmHith</h3>
            <p className="text-sm leading-relaxed text-[#b7c0af]">
              A simple digital bridge between farmers, soil labs, and biomass buyers.
            </p>
            <div className="flex gap-2 mt-5">
              <a href="https://facebook.com/farmhith" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Facebook size={15} />
              </a>
              <a href="https://x.com/farmhith" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Twitter size={15} />
              </a>
              <a href="https://instagram.com/farmhith" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Instagram size={15} />
              </a>
              <a href="https://youtube.com/@farmhith" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Youtube size={15} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">About</button></li>
              <li><button onClick={() => navigateTo('services')} className="hover:text-white transition-colors">Services</button></li>
              <li><button onClick={() => navigateTo('book-test')} className="hover:text-white transition-colors">Book Soil Test</button></li>
              <li><button onClick={() => navigateTo('partners')} className="hover:text-white transition-colors">Partnerships</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('education')} className="hover:text-white transition-colors">Education Hub</button></li>
              <li><button onClick={() => navigateTo('reports')} className="hover:text-white transition-colors">My Reports</button></li>
              <li><button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">Terms</button></li>
              <li><button onClick={() => navigateTo('refund')} className="hover:text-white transition-colors">Refund Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><Phone size={15} className="mt-0.5" /> +91 1234567890</li>
              <li className="flex items-start gap-2"><Mail size={15} className="mt-0.5" /> support@farmhith.in</li>
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5" /> Panipat, Haryana, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-5 text-xs text-[#aab3a2] flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© 2026 FarmHith. All rights reserved.</p>
          <p>Built for farmer-first, sustainable agriculture.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

