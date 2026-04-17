import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

// 👇 import your logos
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

  return (
    <div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        alignItems: "center"
      }}>

        {/* 🔥 LOGO + NAME */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          
          <img
            src={currentLogo}
            alt="logo"
            style={{
              height: "40px",
              width: "auto",
              objectFit: "contain"
            }}
          />

          <h2 style={{ margin: 0 }}>
            {mode === "fleet" ? "FleetWise" : "FuelWise"}
          </h2>

        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={switchMode}>
            Switch Mode
          </button>

          <button onClick={logout}>
            Logout
          </button>
        </div>

      </div>

      {/* 🔥 THIS IS THE FIX */}
      <div key={mode}>
        {children}
      </div>

    </div>
  )
}