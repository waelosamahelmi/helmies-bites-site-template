import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import { Menu } from './pages/Menu';
import About from './pages/About';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Account } from './pages/Account';
import { Loyalty } from './pages/Loyalty';
import { Orders } from './pages/Orders';
import Locations from './pages/Locations';
import Contact from './pages/Contact';
import Lounas from './pages/Lounas';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { MobileMenu } from './components/MobileMenu';
import { useTenant } from './contexts/tenant-context';

export default function App() {
  const { tenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
          <p className="text-gray-500">The requested restaurant could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div id="app-root" className="min-h-screen flex flex-col">
      <Header onCartClick={() => {}} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lounas" element={<Lounas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <CartModal />
      <MobileMenu />
    </div>
  );
}
