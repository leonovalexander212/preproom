import { useEffect, useRef, useState } from 'react';

// Хук, который наблюдает за элементом и возвращает true, когда он попадает в viewport.
// Используется для fade-in анимаций при скролле — добавляем класс is-visible
// к элементу с классом reveal, и CSS делает остальное.
//
// Однократный триггер: после первого появления элемент остаётся видимым.
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Если IntersectionObserver не поддерживается (очень старые браузеры) — сразу показываем
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
