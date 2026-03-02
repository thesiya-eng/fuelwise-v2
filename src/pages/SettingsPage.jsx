import React from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SettingsPage(){
  const [email, setEmail] = React.useState('')
  const [msg, setMsg] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      setEmail(data?.user?.email || '')
    })
  }, [])

  async function resetPassword(){
    setLoading(true); setMsg(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    })
    if (error) setMsg({ type:'bad', text: error.message })
    else setMsg({ type:'good', text: 'Password reset email sent (if allowed by your Supabase settings).' })
    setLoading(false)
  }

  return (
    <div className="card">
      <div className="card-inner">
        <h2>Settings</h2>
        <p className="small" style={{marginTop:6}}>
          Basic account actions. (More settings can be added later.)
        </p>

        <div style={{height:12}} />

        <div className="grid cols-2">
          <div>
            <label>Your email</label>
            <input className="input" value={email} disabled />
          </div>
          <div style={{display:'flex', alignItems:'end'}}>
            <button className="btn secondary" onClick={resetPassword} disabled={loading || !email} style={{width:'100%'}}>
              {loading ? 'Sending…' : 'Send password reset email'}
            </button>
          </div>
        </div>

        {msg ? <div className={`toast ${msg.type === 'good' ? 'good' : 'bad'}`}>{msg.text}</div> : null}

        <div className="hr" />
        <div className="toast">
          Coming next: exports (CSV), household shared vehicle, and receipt scan (OCR) once you’re ready.
        </div>
      </div>
    </div>
  )
}
