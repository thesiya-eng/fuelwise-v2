import React from "react"
import { formatZAR } from "../utils/format"

export default function PredictionCard({ entries }) {

  const now = new Date()
  const currentMonth = now.toISOString().slice(0, 7)

  // CURRENT MONTH
  const currentEntries = entries.filter(e =>
    e.entry_date && e.entry_date.startsWith(currentMonth)
  )

  const totalSpend = currentEntries.reduce(
    (sum, e) => sum + (e.total_cost || 0),
    0
  )

  const daysPassed = now.getDate()
  const daysInMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0
  ).getDate()

  const currentTrend =
    daysPassed > 0 ? (totalSpend / daysPassed) * daysInMonth : 0

  // PAST MONTHS
  const monthlyTotals = {}

  entries.forEach(e => {
    if (!e.entry_date) return

    const month = e.entry_date.slice(0, 7)

    if (month !== currentMonth) {
      if (!monthlyTotals[month]) monthlyTotals[month] = 0
      monthlyTotals[month] += e.total_cost || 0
    }
  })

  const pastMonths = Object.values(monthlyTotals)

  const historicalAverage =
    pastMonths.length > 0
      ? pastMonths.reduce((a, b) => a + b, 0) / pastMonths.length
      : currentTrend

  // FINAL PREDICTION
  const predictedSpend =
    (currentTrend * 0.7) + (historicalAverage * 0.3)

  // INSIGHT
  let insight = "Fuel usage looks stable this month ✅"

  if (predictedSpend > historicalAverage * 1.15) {
    insight = "You're spending more than your usual trend 📈"
  } else if (predictedSpend < historicalAverage * 0.85) {
    insight = "You're saving compared to previous months 👏"
  }

  return (
    <div style={{
      marginTop: 20,
      padding: 24,
      borderRadius: 18,
      background: "linear-gradient(145deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))",
      border: "1px solid rgba(99,102,241,0.3)"
    }}>

      <div style={{ fontSize: 13, opacity: 0.7 }}>
        🔮 SMART MONTHLY PREDICTION
      </div>

      <div style={{ fontSize: 32, fontWeight: 700, marginTop: 10 }}>
        {formatZAR(predictedSpend)}
      </div>

      <div style={{ fontSize: 13, marginTop: 8, opacity: 0.7 }}>
        Based on your recent usage and past months
      </div>

      <div style={{ marginTop: 12 }}>
        💡 {insight}
      </div>

    </div>
  )
}