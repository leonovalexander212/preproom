import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import Lenis from "lenis";
import "./App.css";
import BrutalScene from "./components/BrutalScene.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Landing from "./pages/Landing.jsx";
import Directions from "./pages/Directions.jsx";
import DirectionQuestions from "./pages/DirectionQuestions.jsx";
import Recordings from "./pages/Recordings.jsx";
import Tests from "./pages/Tests.jsx";
import Quiz from "./pages/Quiz.jsx";
import { DocsPage, PrivacyPage, TermsPage, StatusPage, ContactPage } from "./pages/Legal.jsx";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
  }, [pathname, hash]);
  return null;
}

function QuizPopup({ onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "min(520px, 92%)", background: "var(--bg)", border: "2px solid var(--fg)", boxShadow: "10px 10px 0 var(--accent)", padding: 36 }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", color: "var(--accent-ink)" }}>// ПОПРОБУЙ КВИЗ</div>
        <div className="display" style={{ fontSize: 48, marginTop: 14, lineHeight: 0.95 }}>10 СЛУЧАЙНЫХ<br/><span style={{ color: "var(--accent-ink)" }}>ВОПРОСОВ</span></div>
        <p style={{ marginTop: 18, color: "var(--fg-dim)", fontSize: 14, lineHeight: 1.6 }}>Проверь себя на скорость — мини-тренажёр на любом направлении за 3 минуты.</p>
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <Link to="/tests" onClick={onClose} className="btn-brutal">НАЧАТЬ ↗</Link>
          <button onClick={onClose} className="btn-ghost">ПОЗЖЕ</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Cookie-логика для loading screen: показываем только если давно не было
  const [booted, setBooted] = useState(() => {
    const last = parseInt(localStorage.getItem("pp-last-visit") || "0", 10);
    const now = Date.now();
    // Если прошло меньше 30 минут (1800000 мс) — пропускаем загрузку
    return now - last < 30 * 60 * 1000;
  });

  useEffect(() => {
    if (booted) localStorage.setItem("pp-last-visit", String(Date.now()));
  }, [booted]);

  const [theme, setTheme] = useState(() => localStorage.getItem("pp-theme") || "dark");
  const [showQuizPopup, setShowQuizPopup] = useState(false);

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem("pp-theme", theme); }, [theme]);
  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    setTheme((t) => (t === "dark" ? "light" : "dark"));
    setTimeout(() => root.classList.remove("theme-switching"), 420);
  };

  // Quiz popup через 10 сек после буста (1 раз за сессию)
  useEffect(() => {
    if (!booted) return;
    if (sessionStorage.getItem("pp-quiz-shown") === "1") return;
    const t = setTimeout(() => {
      setShowQuizPopup(true);
      sessionStorage.setItem("pp-quiz-shown", "1");
    }, 10000);
    return () => clearTimeout(t);
  }, [booted]);

  useEffect(() => {
    if (!booted) return;
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.__lenis = lenis;
    let raf; const tick = (time) => { lenis.raf(time); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => { lenis.destroy(); delete window.__lenis; cancelAnimationFrame(raf); };
  }, [booted]);

  return (
    <div className="App noise">
      {!booted && <LoadingScreen onDone={() => setBooted(true)} />}
      <BrutalScene theme={theme} />
      <BrowserRouter>
        <ScrollToTop />
        <NavBar theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/directions" element={<Directions />} />
          <Route path="/d/:slug" element={<DirectionQuestions />} />
          <Route path="/recordings" element={<Recordings />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/tests/quiz" element={<Quiz />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Landing />} />
        </Routes>
        <Footer />
        {showQuizPopup && <QuizPopup onClose={() => setShowQuizPopup(false)} />}
      </BrowserRouter>
    </div>
  );
}

export default App;