import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // данные считаются свежими 5 минут
      refetchOnWindowFocus: false,
    },
  },
})

// StrictMode отключён намеренно: он в dev монтирует компоненты дважды,
// из-за чего авто-отправка запроса в AiChat при открытии срабатывала дважды
// и генерировала ошибки 400. Для streaming-фичей Strict Mode больше мешает чем помогает.
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>,
)
