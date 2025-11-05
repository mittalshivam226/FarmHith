import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPage, navigateTo } = useNavigation();

  const navItems = [
    { id: 'home', label: 'Home', labelHindi: 'होम' },
    { id: 'about', label: 'About Us', labelHindi: 'हमारे बारे में' },
    { id: 'services', label: 'Services', labelHindi: 'सेवाएं' },
    { id: 'book-test', label: 'Book Test', labelHindi: 'टेस्ट बुक करें', highlight: true },
    { id: 'reports', label: 'My Reports', labelHindi: 'मेरी रिपोर्ट' },
    { id: 'education', label: 'Learn', labelHindi: 'सीखें' },
    { id: 'blog', label: 'Blog', labelHindi: 'ब्लॉग' },
    { id: 'contact', label: 'Contact', labelHindi: 'संपर्क' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div
            className="flex items-center gap-4 cursor-pointer hover-lift transition-all duration-300"
            onClick={() => navigateTo('home')}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-glow-green transition-all duration-300">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Farm<span className="text-primary-600">हित</span>
              </h1>
              <p className="text-sm text-gray-600">Empowering Farmers</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover-lift ${
                  currentPage === item.id
                    ? 'bg-primary-600 text-white shadow-lg hover:shadow-glow-green'
                    : item.highlight
                    ? 'bg-accent-500 text-white hover:bg-accent-600 hover:shadow-glow-yellow shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="lg:hidden p-3 rounded-xl hover:bg-gray-100 hover-lift transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 animate-slide-down shadow-lg">
          <nav className="px-6 py-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-6 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover-lift ${
                  currentPage === item.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : item.highlight
                    ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-primary-600'
                }`}
              >
                <div>{item.label}</div>
                <div className="text-sm opacity-75 mt-1">{item.labelHindi}</div>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
