import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { initialsFromEmail } from '../lib/format'

export default function Shell() {
  const [email, setEmail] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [logoOpen, setLogoOpen] = React.useState(false)

  const loc = useLocation()

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data?.user?.email || '')
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setEmail(sess?.user?.email || '')
    })

    return () => sub?.subscription?.unsubscribe?.()
  }, [])

  // Close logo preview with ESC
  React.useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setLogoOpen(false)
    }
    if (logoOpen) window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [logoOpen])

  async function signOut() {
    await supabase.auth.signOut()
  }

  const initials = initialsFromEmail(email)

  return (
    <div className="container">
      {/* Top header */}
      <div className="card">
        <div className="card-inner">
          <div className="row space">
            <div className="row" style={{ gap: 12 }}>
              {/* Logo + initials (Option B) */}
              <div className="row" style={{ gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setLogoOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    lineHeight: 0,
                  }}
                  aria-label="Open logo preview"
                  title="Open logo preview"
                >
                  <img
                    src="/src/assets/logo.png"
                    alt="Fuel Wise"
                    style={{
                      height: 34,
                      width: 34,
                      borderRadius: 999,
                      objectFit: 'cover',
                      border: '1px solid rgba(110,168,254,0.38)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                    }}
                  />
                </button>

                <div className="avatar" aria-hidden>
                  {initials}
                </div>
              </div>

              <div>
                <div className="kicker">Fuel Wise v2</div>
                <h1>Dashboard</h1>
                <p className="small">Signed in as {email || '—'}</p>
              </div>
            </div>

            <div className="row" style={{ gap: 10 }}>
              <Link
                className="btn secondary"
                to="/"
                aria-current={loc.pathname === '/' ? 'page' : undefined}
              >
                Home
              </Link>

              <Link
                className="btn secondary"
                to="/settings"
                aria-current={loc.pathname === '/settings' ? 'page' : undefined}
              >
                Settings
              </Link>

              <div style={{ position: 'relative' }}>
                <button
                  className="btn"
                  onClick={() => setOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={open}
                >
                  Profile ▾
                </button>

                {open && (
                  <div
                    className="card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 10px)',
                      minWidth: 220,
                      zIndex: 5,
                    }}
                  >
                    <div className="card-inner">
                      <div className="row" style={{ justifyContent: 'space-between' }}>
                        <span className="badge">Account</span>
                        <span className="small">{email}</span>
                      </div>

                      <div className="hr" />

                      <button className="btn danger" onClick={signOut} style={{ width: '100%' }}>
                        Log out
                      </button>

                      <div className="toast" style={{ marginTop: 12 }}>
                        Multi-user is handled by accounts. Sign in/out to switch users.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Preview Overlay */}
      {logoOpen && (
        <div
          onClick={() => setLogoOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 24,
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520, width: '100%' }}
          >
            <div className="card-inner" style={{ textAlign: 'center' }}>
              <div className="row space">
                <div style={{ textAlign: 'left' }}>
                  <div className="kicker">Fuel Wise</div>
                  <h2>Logo preview</h2>
                  <p className="small">Click outside or press Esc to close.</p>
                </div>

                <button className="btn danger" type="button" onClick={() => setLogoOpen(false)}>
                  Close
                </button>
              </div>

              <div style={{ height: 14 }} />

              <img
                src="/src/assets/logo.png"
                alt="Fuel Wise Logo"
                style={{
                  width: '100%',
                  maxHeight: 420,
                  objectFit: 'contain',
                  borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,0,0,0.12)',
                }}
              />

              {/* Developer credit */}
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 14,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 13, opacity: 0.85 }}>Developed by SB. Duma</div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                  Made in South Africa 🇿🇦
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: 14 }} />
      <Outlet />
      <div style={{ height: 22 }} />

      <p className="small">Tip: add at least 3–5 entries to see trends clearly.</p>
    </div>
  )
}