import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Dot
} from "recharts"

export default function FuelEfficiencyChart({ entries }) {

  const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-ZA", {
      month: "short",
      day: "numeric"
    })
  }

  const data = []

  for (let i = 1; i < entries.length; i++) {
    const prev = entries[i - 1]
    const curr = entries[i]

    const distance = curr.odometer_km - prev.odometer_km

    if (distance > 0 && curr.liters > 0) {
      const efficiency = distance / curr.liters

      data.push({
        date: formatDate(curr.entry_date),
        efficiency: Number(efficiency.toFixed(2))
      })
    }
  }

  if (data.length === 0) {
    return <div style={{ opacity: 0.6 }}>Not enough data yet.</div>
  }

  const values = data.map(d => d.efficiency)
  const max = Math.max(...values)
  const min = Math.min(...values)

  const CustomDot = (props) => {
    const { cx, cy, payload } = props

    if (payload.efficiency === max) {
      return <circle cx={cx} cy={cy} r={6} fill="#22c55e" />
    }

    if (payload.efficiency === min) {
      return <circle cx={cx} cy={cy} r={6} fill="#ef4444" />
    }

    return <circle cx={cx} cy={cy} r={3} fill="#6366f1" />
  }

  return (
    <div>
      <h4 style={{ marginBottom: "10px", opacity: 0.7 }}>
        Fuel Efficiency Trend (km/L)
      </h4>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip
            formatter={(value) => `${value} km/L`}
          />

          <Line
            type="monotone"
            dataKey="efficiency"
            stroke="#6366f1"
            strokeWidth={3}
            dot={<CustomDot />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}