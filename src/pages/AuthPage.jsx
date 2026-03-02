import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function AuthPage(){
  const nav = useNavigate()
  const [mode, setMode] = React.useState('login') // login | signup
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
    <div className="container" style={{maxWidth:860}}>
      <div className="card">
        <div className="card-inner">
          <div className="row space">
            <div>
              <div className="kicker">Fuel Wise v2</div>
              <h1>Welcome back</h1>
              <p style={{marginTop:6}}>Log in to see your dashboard, or create an account.</p>
            </div>
            <span className="badge">Supabase Auth</span>
          </div>

          <div style={{height:14}} />
          <div className="grid cols-2">
            <div className="card" style={{background:'rgba(255,255,255,0.03)'}}>
              <div className="card-inner">
                <div className="row space">
                  <h2>{mode === 'login' ? 'Login' : 'Sign up'}</h2>
                  <div className="row" style={{gap:8}}>
                    <button className={"btn secondary"} onClick={()=>setMode('login')} disabled={loading}>Login</button>
                    <button className={"btn secondary"} onClick={()=>setMode('signup')} disabled={loading}>Sign up</button>
                  </div>
                </div>

                <div style={{height:12}} />
                <form onSubmit={mode === 'login' ? login : signup} className="grid">
                  <div>
                    <label>Email</label>
                    <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
                  </div>
                  <div>
                    <label>Password</label>
                    <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
                    <div className="small" style={{marginTop:6}}>Minimum 6 characters.</div>
                  </div>

                  <button className="btn" disabled={loading}>
                    {loading ? 'Please wait…' : (mode === 'login' ? 'Login' : 'Create account')}
                  </button>
                </form>

                <div className="hr" />
                <button className="btn secondary" onClick={google} disabled={loading} style={{width:'100%'}}>
                  Continue with Google
                </button>

                {msg ? (
                  <div className={`toast ${msg.type === 'good' ? 'good' : 'bad'}`}>{msg.text}</div>
                ) : null}
              </div>
            </div>

            <div className="card" style={{background:'rgba(255,255,255,0.03)'}}>
              <div className="card-inner">
                <h2>What you get</h2>
                <div style={{height:10}} />
                <div className="grid">
                  <div className="toast">
                    <b>Private dashboard</b><br/>
                    Only you can see your entries (RLS).
                  </div>
                  <div className="toast">
                    <b>Advanced analytics</b><br/>
                    Spend trends + km between fill-ups.
                  </div>
                  <div className="toast">
                    <b>Future-ready</b><br/>
                    Built for Netlify + custom domain later.
                  </div>
                </div>

                <div className="hr" />
                <p className="small">
                  If Google login fails on localhost, check your Supabase Google provider settings and redirect URLs.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
