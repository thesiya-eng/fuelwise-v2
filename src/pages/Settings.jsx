import React, { useState } from "react"

export default function Settings() {

  const [notifications, setNotifications] = useState(true)
  const [currency, setCurrency] = useState("ZAR")
  const [unit, setUnit] = useState("km/L")

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>

      <h1 style={{ marginBottom: 20 }}>Settings</h1>

      <div className="card">

        <div className="section">
          <h3>Notifications</h3>
          <label style={{ display: "flex", gap: 10 }}>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            Enable alerts
          </label>
        </div>

        <div className="section">
          <h3>Currency</h3>
          <select
            className="input"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="ZAR">ZAR (R)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>

        <div className="section">
          <h3>Units</h3>
          <select
            className="input"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            <option value="km/L">km/L</option>
            <option value="mpg">MPG</option>
          </select>
        </div>

        <div className="section">
          <h3>Account</h3>
          <button className="btn-danger">
            Logout
          </button>
        </div>

      </div>

    </div>
  )
}