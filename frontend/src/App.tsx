import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { NoticeProvider } from './context/NoticeContext'
import Navbar from './components/Navbar'
import NoticesPage from './pages/NoticesPage'
import SearchPage from './pages/SearchPage'
import ContactPage from './pages/ContactPage'

const App: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <NoticeProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/notices" replace />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </NoticeProvider>
  </div>
)

export default App
