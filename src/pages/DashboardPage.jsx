import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

import StatCards from "../components/StatCards"
import PredictionCard from "../components/PredictionCard"
import NextFuelPrediction from "../components/NextFuelPrediction"
import ChartsPanel from "../components/ChartsPanel"
import EntriesTable from "../components/EntriesTable"
import FloatingAddButton from "../components/FloatingAddButton"

export default function Dashboard() {

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const [mode, setMode] = useState(
    localStorage.getItem("appMode") || "fuel"
  )

  const vehicleName = localStorage.getItem("fleetVehicleName")

  async function loadEntries(currentMode) {
    setLoading(true)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const vehicleId = localStorage.getItem("fleetVehicleId")

    let query = supabase
      .from("fuel_entries")
      .select("*")
      .order("entry_date", { ascending: false })

    // filter by mode
    query = query.eq("mode", currentMode)

    if (currentMode === "fuel") {
      query = query.eq("user_id", user.id)
    }

    if (currentMode === "fleet") {
      if (vehicleId) {
        query = query.eq("vehicle_id", vehicleId)
      } else {
        setEntries([])
        setLoading(false)
        return
      }
    }

    const { data, error } = await query

    if (error) {
      console.error(error)
      setEntries([])
    } else {
      setEntries(data || [])
    }

    setLoading(false)
  }

  // reload when mode changes
  useEffect(() => {
    loadEntries(mode)
  }, [mode])

  // listen for mode switch
  useEffect(() => {
    const handleModeChange = () => {
      const newMode = localStorage.getItem("appMode") || "fuel"
      setMode(newMode)
    }

    window.addEventListener("modeChanged", handleModeChange)

    return () => {
      window.removeEventListener("modeChanged", handleModeChange)
    }
  }, [])

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>

      <h1 style={{ marginBottom: "10px" }}>
        {mode === "fleet"
          ? `${vehicleName || "Fleet Dashboard"}`
          : "FuelWise Dashboard"}
      </h1>

      {mode === "fleet" && (
        <button
          style={{
            marginBottom: 20,
            padding: "8px 14px",
            borderRadius: 10,
            background: "#6c5ce7",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
          onClick={() => alert("Multi-vehicle system coming next")}
        >
          + Add Vehicle
        </button>
      )}

      {loading && (
        <p style={{ opacity: 0.6 }}>Loading data...</p>
      )}

      {!loading && entries.length === 0 && (
        <p style={{ opacity: 0.6, marginBottom: "20px" }}>
          No fuel entries yet - your dashboard will update as you add data.
        </p>
      )}

      <StatCards entries={entries} />
      <PredictionCard entries={entries} />
      <NextFuelPrediction entries={entries} />
      <ChartsPanel entries={entries} />
      <EntriesTable entries={entries} />

      <FloatingAddButton />

    </div>
  )
}