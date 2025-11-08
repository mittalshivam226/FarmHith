import { NavigationProvider, useNavigation } from './context/NavigationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import BookTest from './pages/BookTest';
import Reports from './pages/Reports';
import Education from './pages/Education';
import Blog from './pages/Blog';
import Partners from './pages/Partners';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Profile from './pages/Profile';

function AppContent() {
  const { currentPage } = useNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'services':
        return <Services />;
      case 'book-test':
        return <BookTest />;
      case 'reports':
        return <Reports />;
      case 'education':
        return <Education />;
      case 'blog':
        return <Blog />;
      case 'partners':
        return <Partners />;
      case 'contact':
        return <Contact />;
      case 'login':
        return <Login />;
      case 'profile':
        return <Profile />;
      case 'privacy':
        return <Legal type="privacy" />;
      case 'terms':
        return <Legal type="terms" />;
      case 'refund':
        return <Legal type="refund" />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
