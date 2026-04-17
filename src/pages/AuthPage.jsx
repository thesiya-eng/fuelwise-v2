import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthPage(){
  const nav = useNavigate()
  const [mode, setMode] = React.useState('login')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [msg, setMsg] = React.useState(null)

  React.useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if (data.session) nav('/', { replace:true })
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess)=>{
      if (sess) nav('/', { replace:true })
    })
    return ()=> sub?.subscription?.unsubscribe?.()
  }, [nav])

  async function login(e){
    e.preventDefault()
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setMsg({ type:'bad', text: error.message })
    setLoading(false)
  }

  async function signup(e){
    e.preventDefault()
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error){
      setMsg({ type:'bad', text: error.message })
    }else{
      setMsg({ type:'good', text: 'Account created! Check your email if confirmation is enabled.' })
    }
    setLoading(false)
  }

  async function google(){
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) setMsg({ type:'bad', text: error.message })
    setLoading(false)
  }

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a, #020617)"
    }}>

      {/* LEFT SIDE */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px"
      }}>

        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.05)",
          padding: "30px",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)"
        }}>

          <div style={{ marginBottom: 20 }}>
            <div style={{ opacity: 0.6, fontSize: 14 }}>FuelWise</div>
            <h1 style={{ margin: 0 }}>Welcome back</h1>
            <p style={{ opacity: 0.7 }}>
              Log in to your dashboard or create an account.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <button onClick={()=>setMode('login')} disabled={loading}>
              Login
            </button>
            <button onClick={()=>setMode('signup')} disabled={loading}>
              Sign up
            </button>
          </div>

          <form onSubmit={mode === 'login' ? login : signup} style={{ display: "grid", gap: 12 }}>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
              minLength={6}
            />

            <button disabled={loading}>
              {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Create account')}
            </button>

          </form>

          <div style={{ margin: "20px 0", height: 1, background: "rgba(255,255,255,0.1)" }} />

          <button onClick={google} disabled={loading} style={{ width: "100%" }}>
            Continue with Google
          </button>

          {msg && (
            <div style={{
              marginTop: 15,
              padding: 10,
              borderRadius: 10,
              background: msg.type === 'good'
                ? "rgba(34,197,94,0.2)"
                : "rgba(239,68,68,0.2)"
            }}>
              {msg.text}
            </div>
          )}

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px",
        color: "white"
      }}>

        <h1 style={{ fontSize: "42px", marginBottom: "20px" }}>
          Smart Fuel Tracking
        </h1>

        <p style={{
          fontSize: "18px",
          opacity: 0.7,
          maxWidth: "400px",
          lineHeight: 1.5
        }}>
          Track your fuel spend, predict your next fill-up, and understand your driving costs in real time.
        </p>

        <div style={{ marginTop: "40px", opacity: 0.6 }}>
          Built for drivers who want control.
        </div>

      </div>

    </div>
  )
}