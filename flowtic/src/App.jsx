import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage     from './pages/LandingPage';
import Login           from './pages/Login';
import Signup          from './pages/Signup';
import Events          from './pages/Events';
import EventDetail     from './pages/EventDetail';
import WhiteMarket     from './pages/WhiteMarket';
import Food           from './pages/Food';
import Dashboard      from './pages/Dashboard';
import Profile        from './pages/Profile';
import Navbar          from './components/Navbar';
import Footer          from './components/Footer';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageShell({ children }) {
  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollTop />
      <Routes>
        <Route path="/"           element={<LandingPage />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/signup"     element={<Signup />} />
        <Route path="/events"     element={<PageShell><Events /></PageShell>} />
        <Route path="/events/:id" element={<PageShell><EventDetail /></PageShell>} />
        <Route path="/market"     element={<PageShell><WhiteMarket /></PageShell>} />
        <Route path="/food"       element={<PageShell><Food /></PageShell>} />
        <Route path="/dashboard"  element={<PageShell><Dashboard /></PageShell>} />
        <Route path="/profile"    element={<PageShell><Profile /></PageShell>} />
      </Routes>
    </BrowserRouter>
  );
}
