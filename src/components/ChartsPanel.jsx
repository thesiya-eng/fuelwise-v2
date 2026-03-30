import React from "react"
import FuelEfficiencyChart from "./FuelEfficiencyChart"
import MonthlyFuelCard from "./MonthlyFuelCard"

export default function ChartsPanel({ entries }) {

  // ✅ POWER UPGRADE: sort data chronologically (better charts)
  const sortedEntries = [...entries].reverse()

  const containerStyle = {
    marginTop: "20px",
    padding: "24px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  }

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px" }}>Fuel Analytics</h2>

      <div style={gridStyle}>
        <FuelEfficiencyChart entries={sortedEntries} />
        <MonthlyFuelCard entries={sortedEntries} />
      </div>
    </div>
  )
}