import { Outlet, Link } from 'react-router-dom';

// Общий макет страниц: хедер сверху, контент снизу.
// <Outlet /> — это место, куда React Router вставит текущую страницу (HomePage или DirectionPage).
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-bg-border sticky top-0 z-10 backdrop-blur-md bg-bg-base/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-accent-500 flex items-center justify-center text-accent-50 font-bold text-sm transition-transform group-hover:scale-105">
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

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-bg-border mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-fg-tertiary">
          PrepRoom · подготовка к собеседованиям по реальной статистике
        </div>
      </footer>
    </div>
  );
}
