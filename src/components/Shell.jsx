import React from "react"
import { supabase } from "../lib/supabaseClient"
import logo from "../assets/logo.png"

import EntryForm from "../components/EntryForm"
import DailyOdometerForm from "../components/DailyOdometerForm"

export default function Shell({ children }) {

  const [user, setUser] = React.useState(null)
  const [showEntry, setShowEntry] = React.useState(false)
  const [showOdometer, setShowOdometer] = React.useState(false)
  const [showLogoPopup, setShowLogoPopup] = React.useState(false)

  React.useEffect(() => {
    loadUser()

    function handleOpenEntry() {
      setShowEntry(true)
    }

    function handleOpenOdometer() {
      setShowOdometer(true)
    }

    window.addEventListener("openEntry", handleOpenEntry)
    window.addEventListener("openOdometer", handleOpenOdometer)

    return () => {
      window.removeEventListener("openEntry", handleOpenEntry)
      window.removeEventListener("openOdometer", handleOpenOdometer)
    }
  }, [])

  async function loadUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user || null)
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const initials =
    user?.email
      ? user.email
          .split("@")[0]
          .split(".")
          .map(x => x[0])
          .join("")
          .toUpperCase()
      : "U"

  const glassBtn = {
    padding: "10px 16px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    backdropFilter: "blur(8px)",
    cursor: "pointer"
  }

  return (

    <div className="min-h-screen">

      {/* HEADER */}
      <div className="container">

        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "18px 24px",
            backdropFilter: "blur(10px)"
          }}
        >

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>

            {/* LEFT */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

              <div
                onClick={() => setShowLogoPopup(true)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "2px solid rgba(255,255,255,0.2)"
                }}
              >
                <img
                  src={logo}
                  alt="logo"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              <div>
                <h2 style={{ margin: 0 }}>FuelWise</h2>
                <p style={{ margin: 0, opacity: 0.7 }}>Smart Fuel Tracking</p>
                {user && (
                  <p style={{ margin: 0, fontSize: 12 }}>{user.email}</p>
                )}
              </div>

            </div>

            {/* RIGHT */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

              {/* ❌ REMOVED + ODOMETER BUTTON */}

              {["Home", "Settings", "Profile"].map((item) => (
                <button key={item} style={glassBtn}>
                  {item}
                </button>
              ))}

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#6c5ce7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}
              >
                {initials}
              </div>

              <button
                onClick={logout}
                style={{
                  padding: "8px 14px",
                  borderRadius: 16,
                  background: "#ef4444",
                  color: "white",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>

      <div style={{ height: 24 }} />

      {children}

      {/* ENTRY MODAL */}
      {showEntry && (
        <div className="modal-backdrop">
          <EntryForm onClose={() => setShowEntry(false)} />
        </div>
      )}

      {/* ODOMETER MODAL (still works via floating menu now) */}
      {showOdometer && (
        <div className="modal-backdrop">
          <DailyOdometerForm onClose={() => setShowOdometer(false)} />
        </div>
      )}

      {/* LOGO POPUP */}
      {showLogoPopup && (
        <div className="modal-backdrop">

          <div className="modal-card">
            <h3>FuelWise</h3>
            <p>Smart fuel tracking system 🚗</p>

            <button
              onClick={() => setShowLogoPopup(false)}
              style={{ marginTop: 10, width: "100%", padding: 10 }}
            >
              Close
            </button>
          </div>

        </div>
      )}

    </div>
  )
}