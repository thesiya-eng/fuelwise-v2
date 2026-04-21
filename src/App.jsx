import React from "react"
import { Routes, Route } from "react-router-dom"
import { useUser } from "./context/UserContext"

import Shell from "./components/Shell.jsx"
import Dashboard from "./pages/DashboardPage.jsx"
import Profile from "./pages/Profile.jsx"
import Settings from "./pages/Settings.jsx"
import AuthPage from "./pages/AuthPage.jsx"

export default function App() {
  const { user } = useUser()

  if (!user) {
    return <AuthPage />
  }

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Shell>
  )
}