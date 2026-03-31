import { Menu, X, LogIn, LogOut, Sprout } from 'lucide-react';
import { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentPage, navigateTo, isAuthenticated, logout } = useNavigation();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'book-test', label: 'Book Test', highlight: true },
    { id: 'reports', label: 'Reports' },
    { id: 'education', label: 'Learn' },
    { id: 'blog', label: 'Blog' },
    { id: 'partners', label: 'Partners' },
    { id: 'contact', label: 'Contact' },
    { id: 'profile', label: 'Profile', authenticated: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-primary-200/60 bg-[#eef7ef]/92 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-4">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-white/70 transition-colors surface-3d"
          >
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-md">
              <Sprout size={20} />
            </span>
            <div className="text-left">
              <p className="font-display text-xl leading-none text-slate-900">FarmHith</p>
              <p className="text-xs text-slate-500 mt-1">Soil. Value. Sustainability.</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems
              .filter((item) => !item.authenticated || isAuthenticated)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    currentPage === item.id
                      ? 'bg-primary-700 text-white shadow-md'
                      : item.highlight
                      ? 'bg-accent-500 text-white hover:bg-accent-600 shadow-sm'
                      : 'text-slate-700 hover:bg-white hover:text-primary-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 text-primary-700 px-4 py-2 text-sm font-semibold hover:bg-primary-100 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white text-primary-700 px-4 py-2 text-sm font-semibold hover:bg-primary-50 transition-colors"
              >
                <LogIn size={16} />
                Login
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-primary-200 bg-white text-slate-700"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-primary-200 bg-[#eef7ef] animate-slide-down">
          <nav className="px-4 py-4 grid grid-cols-2 gap-2">
            {navItems
              .filter((item) => !item.authenticated || isAuthenticated)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    currentPage === item.id
                      ? 'bg-primary-700 text-white'
                      : item.highlight
                      ? 'bg-accent-500 text-white'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 mt-1 px-3 py-2.5 rounded-xl bg-red-50 text-red-700 font-semibold"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigateTo('login');
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 mt-1 px-3 py-2.5 rounded-xl bg-white text-primary-700 font-semibold border border-primary-200"
              >
                Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
