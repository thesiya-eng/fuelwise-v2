import React from "react"

export default function FuelAnalytics({ entries }) {

  const monthly = {}

  entries.forEach(e => {
    if (!e.entry_date) return

    const month = e.entry_date.slice(0, 7)

    if (!monthly[month]) monthly[month] = 0
    monthly[month] += e.total_cost || 0
  })

  const labels = Object.keys(monthly)
  const values = Object.values(monthly)

  return (
    <div style={{
      marginTop: 30,
      padding: 20,
      borderRadius: 16,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)"
    }}>

      <h3>Fuel Analytics</h3>

      {labels.length === 0 ? (
        <p>No data yet.</p>
      ) : (

        <div style={{ marginTop: 20 }}>

          {labels.map((month, i) => (

            <div key={i} style={{ marginBottom: 10 }}>

              <div style={{ fontSize: 12, opacity: 0.6 }}>
                {month}
              </div>

              <div style={{
                height: 20,
                width: `${values[i] / Math.max(...values) * 100}%`,
                background: "#22c55e",
                borderRadius: 6
              }} />

            </div>

          ))}

        </div>

      )}

    </div>
  )
}