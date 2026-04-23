import React from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

export default function AuthPage() {
  const nav = useNavigate()
  const [mode, setMode] = React.useState("login")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [msg, setMsg] = React.useState(null)

  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768)

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/", { replace: true })
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (sess) nav("/", { replace: true })
    })

    return () => sub?.subscription?.unsubscribe?.()
  }, [nav])

  async function login(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) setMsg({ type: "bad", text: error.message })
    setLoading(false)
  }

  async function signup(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMsg({ type: "bad", text: error.message })
    } else {
      setMsg({
        type: "good",
        text: "Account created! Check your email if confirmation is enabled.",
      })
    }

    setLoading(false)
  }

  async function google() {
    setLoading(true)
    setMsg(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    })

    if (error) setMsg({ type: "bad", text: error.message })
    setLoading(false)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
      }}
    >
      {/* LEFT */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "20px" : "40px",
        }}
      >
        <div className="card" style={{ width: "100%", maxWidth: "380px" }}>
          {/* HEADER */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ opacity: 0.5, fontSize: 13 }}>FuelWise</div>
            <h1 style={{ margin: "6px 0" }}>Welcome back</h1>
            <p style={{ opacity: 0.7, fontSize: 14 }}>
              Log in to your dashboard or create an account.
            </p>
          </div>

          {/* TOGGLE */}
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 10,
              padding: 4,
              marginBottom: 20,
            }}
          >
            <button
              onClick={() => setMode("login")}
              disabled={loading}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: "none",
                background:
                  mode === "login"
                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                    : "transparent",
                color: "white",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <button
              onClick={() => setMode("signup")}
              disabled={loading}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: "none",
                background:
                  mode === "signup"
                    ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                    : "transparent",
                color: "white",
                cursor: "pointer",
              }}
            >
              Sign up
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={mode === "login" ? login : signup}
            style={{ display: "grid", gap: 12 }}
          >
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="input"
              type="password"
              placeholder="Password (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <button className="btn-primary" disabled={loading}>
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Login"
                : "Create account"}
            </button>
          </form>

          {/* DIVIDER */}
          <div
            style={{
              margin: "20px 0",
              textAlign: "center",
              opacity: 0.5,
              fontSize: 12,
            }}
          >
            OR
          </div>

          {/* GOOGLE */}
          <button
            onClick={google}
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Continue with Google
          </button>

          {/* MESSAGE */}
          {msg && (
            <div
              style={{
                marginTop: 15,
                padding: 12,
                borderRadius: 10,
                fontSize: 14,
                background:
                  msg.type === "good"
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(239,68,68,0.15)",
              }}
            >
              {msg.text}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT (hidden on mobile) */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              marginBottom: "20px",
              background: "linear-gradient(135deg,#22c55e,#4ade80)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Smart Fuel Tracking
          </h1>

          <p
            style={{
              fontSize: "18px",
              opacity: 0.7,
              maxWidth: "420px",
              lineHeight: 1.6,
            }}
          >
            Track your fuel spend, predict your next fill-up, and understand your
            driving costs in real time.
          </p>

          <div style={{ marginTop: 40, opacity: 0.5 }}>
            Built for drivers who want control.
          </div>
        </div>
      )}
    </div>
  )
}