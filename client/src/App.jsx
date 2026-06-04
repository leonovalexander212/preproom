import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import "./App.css";
import BackgroundScene from "./components/BackgroundScene.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Directions from "./pages/Directions.jsx";
import DirectionQuestions from "./pages/DirectionQuestions.jsx";
import Recordings from "./pages/Recordings.jsx";
import Tests from "./pages/Tests.jsx";
import QuizDirection from "./pages/QuizDirection.jsx";
import { DocsPage, PrivacyPage, TermsPage, StatusPage, ContactPage } from "./pages/Legal.jsx";
import MockInterview from "./pages/MockInterview.jsx";
import NotFound from "./pages/NotFound.jsx";

/* ===== ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ (мягкий fade) ===== */
const PAGE_TRANSITION_CSS = `
@keyframes ppPageIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.pp-page {
  animation: ppPageIn 260ms ease-out both;
  will-change: opacity, transform;
}

@media (prefers-reduced-motion: reduce) {
  .pp-page { animation: none; }
}
`;

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname} className="pp-page">
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/directions" element={<Directions />} />
        <Route path="/d/:slug" element={<DirectionQuestions />} />
        <Route path="/recordings" element={<Recordings />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/quiz-direction" element={<QuizDirection />} />
        <Route path="/mock" element={<MockInterview />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  }, [pathname, hash]);
  return null;
}

function DirectionTestPopup({ onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const accept = () => {
    localStorage.setItem("pp-dir-test-seen", "1");
    onClose();
    navigate("/quiz-direction");
  };
  const decline = () => {
    localStorage.setItem("pp-dir-test-seen", "1");
    onClose();
  };

  return (
    <div onClick={decline} data-testid="dir-test-popup"
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", padding: 16,
      }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(520px, 100%)", maxHeight: "calc(100vh - 32px)", overflowY: "auto",
          background: "var(--bg)", position: "relative",
          border: "2px solid var(--fg)", boxShadow: "8px 8px 0 var(--accent)",
          padding: "clamp(20px, 6vw, 36px)",
        }}>

        <button
          onClick={decline}
          aria-label="Закрыть"
          style={{
            position: "absolute", top: 12, right: 12,
            width: 40, height: 40, lineHeight: "36px", textAlign: "center",
            background: "transparent", color: "#ff5b00",
            border: "2px solid #ff5b00", fontSize: 20, fontWeight: 800,
            cursor: "pointer", padding: 0,
          }}>
          ✕
        </button>

        <div className="display" style={{ fontSize: "clamp(30px, 8vw, 48px)", marginTop: 8, lineHeight: 0.95, paddingRight: 44 }}>
          НЕ ЗНАЕШЬ,<br />
          <span style={{ color: "var(--accent-ink)" }}>С ЧЕГО НАЧАТЬ?</span>
        </div>
        <p style={{ marginTop: 16, color: "var(--fg-dim)", fontSize: "clamp(13px, 3.5vw, 14px)", lineHeight: 1.6 }}>
          Ответь на 10 вопросов и мы подберём IT-направление для тебя.
          Никаких тяжёлых терминов. Честно. Всего 2 минуты.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={accept} className="btn-accent" style={{ flex: 1 }}>ПРОЙТИ ТЕСТ ↗</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("pp-theme") || "dark");
  const [showDirPopup, setShowDirPopup] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("pp-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    setTheme((t) => (t === "dark" ? "light" : "dark"));
    setTimeout(() => root.classList.remove("theme-switching"), 420);
  };

  useEffect(() => {
    if (localStorage.getItem("pp-dir-test-seen") === "1") return;
    const t = setTimeout(() => setShowDirPopup(true), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Disable Lenis on touch/mobile devices — use native scroll instead
    const isMobile = window.matchMedia("(max-width: 831px)").matches || "ontouchstart" in window;
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    let raf;
    const tick = (time) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => {
      lenis.destroy();
      delete window.__lenis;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="App noise">
      <style>{PAGE_TRANSITION_CSS}</style>
      <BackgroundScene theme={theme} />
      <BrowserRouter>
        <ScrollToTop />
        <NavBar theme={theme} onToggleTheme={toggleTheme} />
        <AnimatedRoutes />
        <Footer />
        {showDirPopup && (
          <DirectionTestPopup onClose={() => setShowDirPopup(false)} />
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
