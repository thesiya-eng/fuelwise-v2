import React from "react"

export default function MonthlyFuelCard({ entries = [] }) {

  let totalCost = 0
  let totalDistance = 0
  let totalLiters = 0

  // ✅ Calculate based on odometer differences
  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1]
    const curr = entries[i]

    totalCost += Number(curr.total_cost || 0)
    totalLiters += Number(curr.liters || 0)

    const distance = curr.odometer_km - prev.odometer_km

    if (distance > 0) {
      totalDistance += distance
    }
  }

  const efficiency =
    totalLiters > 0
      ? (totalDistance / totalLiters).toFixed(1)
      : 0

  return (
    <div className="card">
      <div className="card-inner">

        <div className="kicker">Monthly Fuel Usage</div>

        <div style={{ height: 10 }} />

        <p className="small">
          Overview of your fuel spending and distance travelled this month.
        </p>

        <div style={{ height: 14 }} />

        <div className="grid cols-3">

          <div>
            <div className="kicker">Fuel Cost</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              R {totalCost.toFixed(2)}
            </div>
          </div>

          <div>
            <div className="kicker">Distance</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {totalDistance.toFixed(0)} km
            </div>
          </div>

          <div>
            <div className="kicker">Efficiency</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>
              {efficiency} km/L
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}