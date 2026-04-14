import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useUser } from "../context/UserContext"

import StatCards from "../components/StatCards"
import PredictionCard from "../components/PredictionCard"
import NextFuelPrediction from "../components/NextFuelPrediction"
import ChartsPanel from "../components/ChartsPanel"
import EntriesTable from "../components/EntriesTable"
import FloatingAddButton from "../components/FloatingAddButton"

export default function Dashboard() {

  const { accountType } = useUser()

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  const vehicleName = localStorage.getItem("fleetVehicleName")

  async function loadEntries() {
    setLoading(true)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const mode = localStorage.getItem("appMode")
    const vehicleId = localStorage.getItem("fleetVehicleId")

    let query = supabase
      .from("fuel_entries")
      .select("*")
      .order("entry_date", { ascending: false })

    if (mode === "fuel") {
      query = query.eq("user_id", user.id)
    }

    if (mode === "fleet") {
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

  useEffect(() => {
    loadEntries()

    const refresh = () => loadEntries()
    window.addEventListener("entryAdded", refresh)

    return () => window.removeEventListener("entryAdded", refresh)
  }, [])

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>

      {/* 🔥 HEADER */}
      <h1 style={{ marginBottom: "10px" }}>
        {accountType === "fleet"
          ? `🚀 ${vehicleName || "Fleet Dashboard"}`
          : "FuelWise Dashboard"}
      </h1>

      {/* 🔥 ADD VEHICLE BUTTON */}
      {accountType === "fleet" && (
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
          onClick={() => alert("Multi-vehicle system coming next 🔥")}
        >
          + Add Vehicle
        </button>
      )}

      {/* 🔥 LOADING */}
      {loading && (
        <p style={{ opacity: 0.6 }}>Loading data...</p>
      )}

      {/* 🔥 EMPTY STATE MESSAGE (BUT KEEP DASHBOARD) */}
      {!loading && entries.length === 0 && (
        <p style={{ opacity: 0.6, marginBottom: "20px" }}>
          No fuel entries yet — your dashboard will update as you add data 👇
        </p>
      )}

      {/* 🔥 ALWAYS SHOW DASHBOARD */}
      <StatCards entries={entries} />
      <PredictionCard entries={entries} />
      <NextFuelPrediction entries={entries} />
      <ChartsPanel entries={entries} />
      <EntriesTable entries={entries} />

      <FloatingAddButton />

    </div>
  )
}