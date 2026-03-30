import React, { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export default function DailyOdometerForm() {

  const today = new Date().toISOString().slice(0, 10)

  const [date, setDate] = useState(today)
  const [odometer, setOdometer] = useState("")
  const [liters, setLiters] = useState("")
  const [totalCost, setTotalCost] = useState("")
  const [existing, setExisting] = useState(null)

  useEffect(() => {
    checkToday()
  }, [])

  const checkToday = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { data } = await supabase
      .from("fuel_entries")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", today)
      .maybeSingle()

    if (data) {
      setExisting(data)
      setOdometer(data.odometer_km)
      setLiters(data.liters)
      setTotalCost(data.total_cost)
    }
  }

  const saveOdometer = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      user_id: user.id,
      entry_date: date,
      odometer_km: Number(odometer),
      liters: Number(liters),
      total_cost: Number(totalCost)
    }

    const { error } = await supabase
      .from("fuel_entries")
      .upsert(payload, { onConflict: "user_id,entry_date" })

    if (!error) {
      alert("Saved successfully ✅")

      window.dispatchEvent(new Event("entryAdded"))

      setExisting(payload)
    }
  }

  const deleteToday = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    await supabase
      .from("fuel_entries")
      .delete()
      .eq("user_id", user.id)
      .eq("entry_date", today)

    setExisting(null)
    setOdometer("")
    setLiters("")
    setTotalCost("")

    window.dispatchEvent(new Event("entryAdded"))
  }

  return (
    <div style={{
      marginTop: "30px",
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)"
    }}>

      <h3>Log Today’s Fuel</h3>

      {existing && (
        <p style={{ color: "#aaa", fontSize: "13px" }}>
          Today’s entry already logged.
        </p>
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>

        <input
          type="number"
          placeholder="Odometer (km)"
          value={odometer}
          onChange={(e) => setOdometer(e.target.value)}
        />

        <input
          type="number"
          placeholder="Liters"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
        />

        <input
          type="number"
          placeholder="Total Cost"
          value={totalCost}
          onChange={(e) => setTotalCost(e.target.value)}
        />

      </div>

      <div style={{ marginTop: "10px" }}>

        <button onClick={saveOdometer}>
          Save
        </button>

        {existing && (
          <button
            onClick={deleteToday}
            style={{ marginLeft: "10px", background: "red" }}
          >
            Delete
          </button>
        )}

      </div>

    </div>
  )
}