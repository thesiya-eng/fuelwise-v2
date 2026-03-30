import React from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

export default function ProtectedRoute({ children }) {

  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user || null)
    setLoading(false)
  }

  if (loading) return null

  if (!user) return <Navigate to="/" />

  return children
}