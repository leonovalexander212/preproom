import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DirectionPage } from './pages/DirectionPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/d/:slug" element={<DirectionPage />} />
      </Route>
    </Routes>
  )
}

export default App
