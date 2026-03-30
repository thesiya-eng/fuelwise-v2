import React from "react"
import { supabase } from "../lib/supabaseClient"

export default function WeeklyDrivingHeatmap() {

  const [days, setDays] = React.useState([])

  React.useEffect(() => {
    load()
  }, [])

  async function load() {

    const { data: userRes } = await supabase.auth.getUser()
    const userId = userRes?.user?.id

    if (!userId) return

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data } = await supabase
      .from("daily_odometer_logs")
      .select("*")
      .eq("user_id", userId)
      .gte("log_date", sevenDaysAgo.toISOString())
      .order("log_date", { ascending: true })

    if (!data || data.length < 2) {
      setDays([])
      return
    }

    const results = []

    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1]
      const curr = data[i]

      const distance = curr.odometer_km - prev.odometer_km
      const date = new Date(curr.log_date)

      const dayName = date.toLocaleDateString("en-ZA", { weekday: "short" })

      results.push({
        day: dayName,
        km: Math.max(distance, 0)
      })
    }

    setDays(results)
  }

  if (!days.length) return null

  const maxKm = Math.max(...days.map(d => d.km))

  const getBarWidth = (km) => {
    return `${(km / maxKm) * 100}%`
  }

  const getColor = (km) => {
    const intensity = km / maxKm

    if (intensity > 0.75) return "#22c55e" // green
    if (intensity > 0.4) return "#6366f1"  // blue
    return "#94a3b8" // gray
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

      <h3 style={{ marginBottom: "12px" }}>🚗 Driving This Week</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {days.map((d, i) => (
          <div key={i}>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              marginBottom: "4px"
            }}>
              <span>{d.day}</span>
              <span>{d.km.toFixed(1)} km</span>
            </div>

            <div
              style={{
                height: "8px",
                width: "100%",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "6px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: getBarWidth(d.km),
                  background: getColor(d.km),
                  borderRadius: "6px",
                  transition: "width 0.4s ease"
                }}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}