import React, { useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function EntryForm({ onClose }) {

  const today = new Date().toISOString().slice(0, 10)

  const [date, setDate] = useState(today)
  const [cost, setCost] = useState("")
  const [liters, setLiters] = useState("")
  const [odometer, setOdometer] = useState("")
  const [loading, setLoading] = useState(false)

  const saveEntry = async () => {

    if (!cost || !liters || !odometer) {
      alert("Please fill all fields")
      return
    }

    setLoading(true)

    try {

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        alert("User not authenticated")
        setLoading(false)
        return
      }

      // 🔥 GET MODE + VEHICLE
      const mode = localStorage.getItem("appMode")
      const vehicleId = localStorage.getItem("fleetVehicleId")

      const insertData = {
        user_id: user.id,
        entry_date: date,
        total_cost: parseFloat(cost),
        liters: parseFloat(liters),
        odometer_km: parseFloat(odometer)
      }

      // 🔥 IF FLEET MODE → ADD VEHICLE
      if (mode === "fleet" && vehicleId) {
        insertData.vehicle_id = vehicleId
      }

      const { data, error } = await supabase
        .from("fuel_entries")
        .insert([insertData])
        .select()

      if (error) {
        alert(error.message)
        setLoading(false)
        return
      }

      window.dispatchEvent(new Event("entryAdded"))
      onClose()

    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    }

    setLoading(false)
  }

  return (
    <div className="modal-card">

      <h3>Add Fuel Entry</h3>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: "100%", marginTop: 10, padding: 10 }}
      />

      <input
        type="number"
        placeholder="Total Cost (R)"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        style={{ width: "100%", marginTop: 10, padding: 10 }}
      />

      <input
        type="number"
        placeholder="Liters"
        value={liters}
        onChange={(e) => setLiters(e.target.value)}
        style={{ width: "100%", marginTop: 10, padding: 10 }}
      />

      <input
        type="number"
        placeholder="Odometer (km)"
        value={odometer}
        onChange={(e) => setOdometer(e.target.value)}
        style={{ width: "100%", marginTop: 10, padding: 10 }}
      />

      <button
        style={{ marginTop: 14, width: "100%", padding: 12 }}
        onClick={saveEntry}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Entry"}
      </button>

      <button
        style={{ marginTop: 10, width: "100%", padding: 12 }}
        onClick={onClose}
      >
        Cancel
      </button>

    </div>
  )
}