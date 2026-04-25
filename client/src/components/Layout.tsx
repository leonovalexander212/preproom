import { Outlet, Link } from 'react-router-dom';

// Общий макет страниц: фиксированные ambient-пятна в фоне,
// над ними — стеклянный хедер и содержимое.
export function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient-свечения в фоне. fixed — чтобы они оставались при скролле */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="ambient-glow"
          style={{
            top: '-20%',
            left: '-10%',
            width: '60vw',
            height: '60vw',
            background: 'radial-gradient(circle, #6d66ed 0%, transparent 70%)',
          }}
        />
        <div
          className="ambient-glow"
          style={{
            top: '20%',
            right: '-15%',
            width: '50vw',
            height: '50vw',
            background: 'radial-gradient(circle, #4d42b8 0%, transparent 70%)',
            opacity: 0.3,
          }}
        />
        <div
          className="ambient-glow"
          style={{
            bottom: '-10%',
            left: '20%',
            width: '50vw',
            height: '40vw',
            background: 'radial-gradient(circle, #342d78 0%, transparent 70%)',
            opacity: 0.35,
          }}
        />
      </div>

      {/* Стеклянный хедер — фиксация вверху, размывает подлежащий контент */}
      <header className="glass-strong sticky top-0 z-20 border-x-0 border-t-0">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-accent-50 font-bold text-sm transition-transform group-hover:scale-105">
              P
            </div>
            <span className="font-bold text-fg-primary tracking-tight">PrepRoom</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-fg-secondary">
            <a href="#" className="hover:text-fg-primary transition-colors">О проекте</a>
            <a href="#" className="hover:text-fg-primary transition-colors">Как это работает</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="relative z-10 mt-16 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-fg-tertiary">
          PrepRoom · подготовка к собеседованиям по реальной статистике
        </div>
      </footer>
    </div>
  );
}
