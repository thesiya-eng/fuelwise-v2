import React from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function ProtectedRoute({ children }){
  const [loading, setLoading] = React.useState(true)
  const [session, setSession] = React.useState(null)

  React.useEffect(()=>{
    let mounted = true

    supabase.auth.getSession().then(({ data })=>{
      if (!mounted) return
      setSession(data.session || null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess)=>{
      setSession(sess || null)
      setLoading(false)
    })

    return ()=>{
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  if (loading) return <div className="container"><div className="card"><div className="card-inner"><p>Loading…</p></div></div></div>
  if (!session) return <Navigate to="/auth" replace />
  return children
}
