import React from 'react'

export default function EnvMissing(){
  return (
    <div className="container">
      <div className="card">
        <div className="card-inner">
          <h1>Fuel Wise v2</h1>
          <p style={{marginTop:8}}>
            Missing Supabase environment variables.
          </p>
          <div className="toast bad">
            Create a <b>.env</b> file (copy from <b>.env.example</b>) and add:
            <div style={{marginTop:8}}>
              <code>VITE_SUPABASE_URL</code><br/>
              <code>VITE_SUPABASE_ANON_KEY</code>
            </div>
          </div>
          <p className="small" style={{marginTop:10}}>
            After adding them, restart the dev server.
          </p>
        </div>
      </div>
    </div>
  )
}
