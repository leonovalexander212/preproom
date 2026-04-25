import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

// Обёртка над <Outlet /> которая делает плавный fade при смене страницы.
//
// Как работает:
// 1. При смене URL (location.pathname) запускаем "выход" — добавляем класс page-leaving
// 2. После 200мс (длительность исчезновения) обновляем displayed location и снимаем класс
// 3. Новый контент появляется с fade-in
//
// key={displayedLocation.pathname} нужен чтобы React действительно размонтировал старую
// страницу и смонтировал новую — без этого React пытался бы переиспользовать DOM.
export function PageTransition() {
  const location = useLocation();
  const [displayedLocation, setDisplayedLocation] = useState(location);
  const [stage, setStage] = useState<'entering' | 'leaving'>('entering');

  useEffect(() => {
    if (location.pathname === displayedLocation.pathname) return;

    // Запускаем фазу "выхода"
    setStage('leaving');
  }, [location.pathname, displayedLocation.pathname]);

  // Когда фаза "leaving" — ждём окончания CSS-анимации, потом меняем location
  useEffect(() => {
    if (stage !== 'leaving') return;

    const timer = setTimeout(() => {
      setDisplayedLocation(location);
      setStage('entering');
      // Прокрутка к началу страницы при смене маршрута
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 200);

    return () => clearTimeout(timer);
  }, [stage, location]);

  return (
    <div
      key={displayedLocation.pathname}
      className={stage === 'leaving' ? 'page-transition-leaving' : 'page-transition-entering'}
    >
      <Outlet context={{ location: displayedLocation }} />
    </div>
  );
}
