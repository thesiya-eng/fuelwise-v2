import React from "react"

export default function NextFuelPrediction({ entries }) {

  if (!entries || entries.length < 2) return null

  const sorted = [...entries].sort(
    (a, b) => a.odometer_km - b.odometer_km
  )

  const recent = sorted.slice(-3)

  if (recent.length < 2) return null

  let totalDistance = 0
  let totalLiters = 0
  let totalDays = 0

  for (let i = 1; i < recent.length; i++) {
    const prev = recent[i - 1]
    const curr = recent[i]

    const distance = curr.odometer_km - prev.odometer_km
    const days =
      (new Date(curr.entry_date) - new Date(prev.entry_date)) /
      (1000 * 60 * 60 * 24)

    if (distance > 0 && days > 0) {
      totalDistance += distance
      totalDays += days
      totalLiters += curr.liters || 0
    }
  }

  if (totalDistance === 0 || totalDays === 0) return null

  const kmPerDay = totalDistance / totalDays
  const avgLiters = totalLiters / (recent.length - 1)

  const estimatedTank = avgLiters * 1.2
  const kmPerLiter = totalDistance / totalLiters
  const range = kmPerLiter * estimatedTank

  const daysUntilEmpty = range / kmPerDay
  const roundedDays = Math.max(1, Math.round(daysUntilEmpty))

  return (
    <div style={{
      marginTop: 20,
      padding: 24,
      borderRadius: 18,
      background: "linear-gradient(145deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))",
      border: "1px solid rgba(34,197,94,0.3)"
    }}>

      <div style={{ fontSize: 13, opacity: 0.7 }}>
        🚗 NEXT FUEL PREDICTION
      </div>

      <div style={{
        fontSize: 28,
        fontWeight: 700,
        marginTop: 10
      }}>
        In ~{roundedDays} days
      </div>

      <div style={{
        fontSize: 13,
        marginTop: 8,
        opacity: 0.7
      }}>
        Based on your recent driving and fuel usage
      </div>

    </div>
  )
}