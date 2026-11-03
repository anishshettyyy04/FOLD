import { Suspense, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Landing } from "./pages/Landing";
import { eventDateParts, useEventConfig } from "./lib/event";

import {Register,Ticket,Admin} from "./pages/EventDesk";
function RouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash)
      requestAnimationFrame(() =>
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "smooth" }),
      );
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="FOLD 2026 home">
        <span className="brand-mark">f.</span>
        <span>
          ZERONE<span className="brand-sub">PRESENTS FOLD 2026</span>
        </span>
      </Link>
      <button
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="main-nav"
        aria-label="Main navigation"
        className={open ? "main-nav is-open" : "main-nav"}
        onClick={() => setOpen(false)}
      >
        <Link to="/#about">The idea</Link>
        <Link to="/#challenge">The challenge</Link>
        <Link to="/#rules">The rules</Link>
        
        <Link
          to="/register"
          className="nav-cta"
          aria-current={location.pathname === "/register" ? "page" : undefined}
        >
          Register now <ArrowUpRight size={17} />
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  const date = eventDateParts(useEventConfig());
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <span className="eyebrow">THE NEXT GREAT IDEA IS YOURS.</span>
        <Link to="/register">
          Let’s make it unfold. <ArrowUpRight />
        </Link>
      </div>
      <div className="footer-wordmark" aria-label="FOLD 2026">
        FOLD<span>’26</span>
        <span className="footer-star" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="footer-bottom">
        <p>
          ZERONE Student Association
          <br />
          Information Science & Engineering · MITE
        </p>
        <div>
          
          <Link to="/privacy">Privacy notice</Link>
          <Link to="/admin">Organizer login</Link>
        </div>
        <p>
          {date.full}
          <br />
          MADE TO MAKE AN IMPACT.
        </p>
      </div>
    </footer>
  );
}

function Privacy() {
  return <article className="legal-page"><h1>Privacy notice</h1><p>ZERONE uses Google Forms to collect team registrations. Your collected email address receives a private ticket link. Contact the ZERONE Student Association at MITE for corrections or deletion requests.</p></article>;
}
export default function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <RouteScroll />
      <Header />
      <main id="main-content">
        <Suspense
          fallback={
            <div className="route-loading" role="status">
              <span className="loading-fold" />
              Unfolding your workspace…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/status" element={<Ticket />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route
              path="*"
              element={
                <div className="legal-page">
                  <span className="eyebrow">404 / A PAGE OUT OF PLACE</span>
                  <h1>
                    Let’s turn
                    <br />
                    the page.
                  </h1>
                  <Link to="/" className="button button-dark">
                    Back to FOLD <ArrowUpRight />
                  </Link>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
