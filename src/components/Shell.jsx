import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

import fuelLogo from "../assets/logo.png"
import fleetLogo from "../assets/fleetwise.png"

export default function Shell({ children }) {

  const navigate = useNavigate()

  const [mode, setMode] = useState(
    localStorage.getItem("appMode") || "fuel"
  )

  const switchMode = () => {
    const newMode = mode === "fuel" ? "fleet" : "fuel"

    localStorage.setItem("appMode", newMode)
    setMode(newMode)
  }

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  const currentLogo = mode === "fleet" ? fleetLogo : fuelLogo

  const isMobile = window.innerWidth < 768

  return (
    <div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: isMobile ? "16px" : "20px",
        alignItems: "center"
      }}>

        {/* 🔥 LOGO + NAME */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          <img
            src={currentLogo}
            alt="logo"
            style={{
              height: "42px",
              width: "42px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
            }}
          />

          <h2 style={{ margin: 0 }}>
            {mode === "fleet" ? "FleetWise" : "FuelWise"}
          </h2>

        </div>

        {/* 🔥 BUTTONS */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="glass-btn" onClick={switchMode}>
            🔁 Switch Mode
          </button>

          <button className="glass-btn glass-btn-purple" onClick={logout}>
            🚪 Logout
          </button>
        </div>

      </div>

      <div key={mode}>
        {children}
      </div>

    </div>
  )
}