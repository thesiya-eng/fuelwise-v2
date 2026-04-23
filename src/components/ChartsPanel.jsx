import React from "react"
import FuelEfficiencyChart from "./FuelEfficiencyChart"
import MonthlyFuelCard from "./MonthlyFuelCard"

export default function ChartsPanel({ entries }) {

  const sortedEntries = [...entries].reverse()

  const isMobile = window.innerWidth < 768

  const containerStyle = {
    marginTop: "20px",
    padding: isMobile ? "16px" : "24px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
    gap: "20px",
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px" }}>Fuel Analytics</h2>

      <div style={gridStyle}>
        <div style={{ width: "100%", minWidth: 0 }}>
          <FuelEfficiencyChart entries={sortedEntries} />
        </div>

        <div style={{ width: "100%", minWidth: 0 }}>
          <MonthlyFuelCard entries={sortedEntries} />
        </div>
      </div>
    </div>
  )
}