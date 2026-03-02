import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { envReady } from './lib/supabaseClient'
import Shell from './components/Shell.jsx'
import AuthPage from './pages/AuthPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import EnvMissing from './pages/EnvMissing.jsx'

export default function App(){
  if (!envReady) return <EnvMissing />

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Shell />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
