import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DirectionsPage } from './pages/DirectionsPage'
import { DirectionPage } from './pages/DirectionPage'
import { RecordingsPage } from './pages/RecordingsPage'
import { TestsPage } from './pages/TestsPage'
import { QuizPage } from './pages/QuizPage'
import { StatusPage } from './pages/StatusPage'
import { ContactPage } from './pages/ContactPage'
import { DocsPage, PrivacyPage, TermsPage } from './pages/LegalPages'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"             element={<HomePage />} />
        <Route path="/directions"   element={<DirectionsPage />} />
        <Route path="/d/:slug"      element={<DirectionPage />} />
        <Route path="/recordings"   element={<RecordingsPage />} />

        {/* Tests */}
        <Route path="/tests"        element={<TestsPage />} />
        <Route path="/tests/quiz"   element={<QuizPage />} />

        {/* Footer pages */}
        <Route path="/docs"         element={<DocsPage />} />
        <Route path="/contact"      element={<ContactPage />} />
        <Route path="/status"       element={<StatusPage />} />
        <Route path="/privacy"      element={<PrivacyPage />} />
        <Route path="/terms"        element={<TermsPage />} />
      </Route>
    </Routes>
  )
}

export default App
