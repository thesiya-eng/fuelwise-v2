import React from "react"
import { formatZAR } from "../utils/format"

export default function StatCards({ entries }) {

  // 🟡 EMPTY STATE FIX
  if (!entries || entries.length === 0) {
    return (
      <div style={{ marginTop: "24px", opacity: 0.6 }}>
        No stats available yet.
      </div>
    )
  }

  const now = new Date()
  const currentMonth = now.toISOString().slice(0, 7)

  const currentEntries = entries.filter(e =>
    e.entry_date &&
    new Date(e.entry_date).toISOString().slice(0, 7) === currentMonth
  )

  const sum = (arr, key) =>
    arr.reduce((sum, e) => sum + (e[key] || 0), 0)

  const totalSpend = sum(currentEntries, "total_cost")
  const totalLiters = sum(currentEntries, "liters")
  const entryCount = currentEntries.length
  const avgPrice = totalLiters > 0 ? totalSpend / totalLiters : 0

  // 🔥 COST PER KM
  let costPerKm = 0

  if (currentEntries.length > 1) {
    const sorted = [...currentEntries].sort(
      (a, b) => a.odometer_km - b.odometer_km
    )

    const first = sorted[0].odometer_km
    const last = sorted[sorted.length - 1].odometer_km

    const distance = last - first

    if (distance > 0) {
      costPerKm = totalSpend / distance
    }
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "18px",
      marginTop: "24px"
    }}>

      <Card title="TOTAL SPEND (THIS MONTH)" value={formatZAR(totalSpend)} big />
      <Card title="TOTAL LITERS" value={`${totalLiters.toFixed(2)} L`} />
      <Card title="ENTRIES" value={entryCount} />
      <Card title="AVG PRICE / LITER" value={formatZAR(avgPrice)} />
      <Card title="COST PER KM" value={costPerKm ? formatZAR(costPerKm) : "-"} />

    </div>
  )
}

function Card({ title, value, big }) {
  return (
    <div style={{
      borderRadius: "18px",
      padding: "22px",
      gridColumn: big ? "span 2" : "span 1",
      background: big
        ? "linear-gradient(145deg, rgba(99,102,241,0.25), rgba(99,102,241,0.05))"
        : "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)"
    }}>
      <div style={{ fontSize: 12, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
    </div>
  )
}