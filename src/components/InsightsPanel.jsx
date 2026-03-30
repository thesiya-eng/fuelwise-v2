import React from "react"

export default function InsightsPanel({ entries }) {

  const now = new Date()
  const currentMonth = now.toISOString().slice(0, 7)

  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = lastMonthDate.toISOString().slice(0, 7)

  const current = entries.filter(e =>
    e.entry_date.startsWith(currentMonth)
  )

  const last = entries.filter(e =>
    e.entry_date.startsWith(lastMonth)
  )

  const sum = (arr, key) =>
    arr.reduce((sum, e) => sum + (e[key] || 0), 0)

  const totalSpend = sum(current, "total_cost")
  const lastSpend = sum(last, "total_cost")

  const totalLiters = sum(current, "liters")
  const lastLiters = sum(last, "liters")

  const avgPrice = totalLiters > 0 ? totalSpend / totalLiters : 0
  const lastAvg = lastLiters > 0 ? lastSpend / lastLiters : 0

  const calcChange = (current, last) => {
    if (last === 0) return null
    return ((current - last) / last) * 100
  }

  const spendChange = calcChange(totalSpend, lastSpend)
  const avgChange = calcChange(avgPrice, lastAvg)

  // 🧠 Efficiency trend
  let efficiencyTrend = null

  if (entries.length > 2) {
    const lastTwo = entries.slice(-2)
    const prevTwo = entries.slice(-4, -2)

    const calcEfficiency = (arr) => {
      if (arr.length < 2) return null
      const distance = arr[1].odometer_km - arr[0].odometer_km
      return distance > 0 ? distance / arr[1].liters : null
    }

    const recentEff = calcEfficiency(lastTwo)
    const prevEff = calcEfficiency(prevTwo)

    if (recentEff && prevEff) {
      efficiencyTrend = ((recentEff - prevEff) / prevEff) * 100
    }
  }

  // 🔮 Prediction (simple projection)
  const daysPassed = new Date().getDate()
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

  const predictedSpend =
    daysPassed > 0 ? (totalSpend / daysPassed) * daysInMonth : 0

  const insights = []

  // 🚨 Spend behavior
  if (spendChange !== null) {
    if (spendChange > 15) {
      insights.push(`🚨 Your fuel spending has jumped ${spendChange.toFixed(1)}%. Something changed significantly.`)
    } else if (spendChange > 5) {
      insights.push(`⚠️ You're spending more on fuel this month (+${spendChange.toFixed(1)}%).`)
    } else if (spendChange < -10) {
      insights.push(`✅ Strong improvement — you reduced fuel spend by ${Math.abs(spendChange).toFixed(1)}%.`)
    }
  }

  // ⛽ Price insight
  if (avgChange !== null) {
    if (avgChange > 5) {
      insights.push(`⛽ You're paying more per liter — fuel prices or station choice may be affecting costs.`)
    } else if (avgChange < -5) {
      insights.push(`💰 Good job — you're getting better fuel prices this month.`)
    }
  }

  // 📉 Efficiency insight
  if (efficiencyTrend !== null) {
    if (efficiencyTrend < -10) {
      insights.push(`📉 Your fuel efficiency dropped sharply (${efficiencyTrend.toFixed(1)}%). Check driving patterns or routes.`)
    } else if (efficiencyTrend > 10) {
      insights.push(`📈 Your efficiency improved — you're getting more km per liter.`)
    }
  }

  // 🔮 Prediction insight
  if (predictedSpend > 0) {
    insights.push(`🔮 At this rate, you may spend around R ${predictedSpend.toFixed(0)} this month.`)
  }

  if (insights.length === 0) {
    insights.push("✅ Everything looks stable — no major changes detected.")
  }

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)"
      }}
    >

      <h3 style={{ marginBottom: "12px" }}>Insights</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {insights.map((text, index) => (
          <div key={index} style={{ fontSize: "14px", lineHeight: 1.5 }}>
            {text}
          </div>
        ))}
      </div>

    </div>
  )
}