import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';

const Footer = () => {
  const { navigateTo } = useNavigation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Farm<span className="text-green-400">हित</span>
              </h3>
            </div>
            <p className="text-sm mb-4">
              Empowering farmers through smart soil testing and sustainable practices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('about')} className="hover:text-green-400 transition-colors">About Us</button></li>
              <li><button onClick={() => navigateTo('services')} className="hover:text-green-400 transition-colors">Our Services</button></li>
              <li><button onClick={() => navigateTo('book-test')} className="hover:text-green-400 transition-colors">Book a Test</button></li>
              <li><button onClick={() => navigateTo('partners')} className="hover:text-green-400 transition-colors">Our Partners</button></li>
              <li><button onClick={() => navigateTo('blog')} className="hover:text-green-400 transition-colors">Blog</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigateTo('education')} className="hover:text-green-400 transition-colors">Educational Hub</button></li>
              <li><button onClick={() => navigateTo('reports')} className="hover:text-green-400 transition-colors">My Reports</button></li>
              <li><button onClick={() => navigateTo('privacy')} className="hover:text-green-400 transition-colors">Privacy Policy</button></li>
              <li><button onClick={() => navigateTo('terms')} className="hover:text-green-400 transition-colors">Terms of Service</button></li>
              <li><button onClick={() => navigateTo('refund')} className="hover:text-green-400 transition-colors">Refund Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <div>
                  <p>+91 1234567890</p>
                  <p className="text-xs text-gray-400">Mon-Sat, 9AM-6PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <p>support@farmhith.in</p>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <p>Panipat, Haryana, India</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Farmहित (FarmHith). All rights reserved.</p>
          <p className="text-gray-500 mt-2">
            Built with ❤️ for Indian farmers | किसानों के कल्याण के लिए
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
