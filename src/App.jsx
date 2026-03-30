import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"

import Shell from "./components/Shell.jsx"
import Dashboard from "./pages/DashboardPage.jsx"
import AuthPage from "./pages/AuthPage.jsx"

export default function App() {

  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) return null

  // 🔐 NOT LOGGED IN → SHOW AUTH
  if (!session) {
    return <AuthPage />
  }

  // ✅ LOGGED IN → SHOW APP
  return (
    <Shell>
      <Dashboard />
    </Shell>
  )
}