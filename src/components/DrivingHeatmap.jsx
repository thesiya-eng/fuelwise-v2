import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import CalendarHeatmap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"

export default function DrivingHeatmap() {
  const [data, setData] = useState([])

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: logs, error } = await supabase
      .from("daily_odometer_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("log_date", { ascending: true })

    if (error) {
      console.error(error)
      return
    }

    if (!logs || logs.length < 2) return

    const heatmapData = []

    for (let i = 1; i < logs.length; i++) {
      const distance = logs[i].odometer_km - logs[i - 1].odometer_km

      heatmapData.push({
        date: logs[i].log_date,
        count: distance,
      })
    }

    setData(heatmapData)
  }

  const containerStyle = {
    marginTop: "40px",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
  }

  return (
    <div style={containerStyle}>
      <h3 style={{ marginBottom: "15px" }}>Driving Activity</h3>

      <CalendarHeatmap
        startDate={new Date(new Date().setMonth(new Date().getMonth() - 6))}
        endDate={new Date()}
        values={data}
        classForValue={(value) => {
          if (!value) return "color-empty"
          if (value.count < 20) return "color-scale-1"
          if (value.count < 50) return "color-scale-2"
          if (value.count < 100) return "color-scale-3"
          return "color-scale-4"
        }}
      />
    </div>
  )
}