import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts"

export default function MonthlySpendChart({ entries }) {

  const monthly = {}

  entries.forEach((row) => {
    const month = row.entry_date.slice(0, 7)

    if (!monthly[month]) {
      monthly[month] = 0
    }

    monthly[month] += row.total_cost || 0
  })

  const data = Object.keys(monthly).map((month) => ({
    month,
    spend: monthly[month],
  }))

  if (data.length === 0) {
    return <div style={{ opacity: 0.6 }}>No data yet.</div>
  }

  const max = Math.max(...data.map(d => d.spend))

  return (
    <div>
      <h4 style={{ marginBottom: "10px", opacity: 0.7 }}>
        Monthly Fuel Spend
      </h4>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip
            formatter={(value) => `R ${value.toFixed(2)}`}
          />

          <Bar dataKey="spend" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.spend === max ? "#22c55e" : "#6366f1"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}