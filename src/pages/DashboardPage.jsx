import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

import StatCards from "../components/StatCards"
import PredictionCard from "../components/PredictionCard"
import NextFuelPrediction from "../components/NextFuelPrediction"
import ChartsPanel from "../components/ChartsPanel" // ✅ FIXED
import EntriesTable from "../components/EntriesTable"
import FloatingAddButton from "../components/FloatingAddButton"

export default function Dashboard() {

  const [entries, setEntries] = useState([])

  async function loadEntries() {
    const { data, error } = await supabase
      .from("fuel_entries")
      .select("*")
      .order("entry_date", { ascending: false })

    if (error) {
      console.error("Error loading entries:", error)
    } else {
      setEntries(data)
    }
  }

  useEffect(() => {
    loadEntries()

    const refresh = () => loadEntries()
    window.addEventListener("entryAdded", refresh)

    return () => window.removeEventListener("entryAdded", refresh)
  }, [])

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px"
    }}>

      <h1 style={{ marginBottom: "10px" }}>
        FuelWise Dashboard
      </h1>

      {/* STATS */}
      <StatCards entries={entries} />

      {/* PREDICTIONS */}
      <PredictionCard entries={entries} />
      <NextFuelPrediction entries={entries} />

      {/* ✅ REAL ANALYTICS (FIXED) */}
      <ChartsPanel entries={entries} />

      {/* ENTRIES */}
      <EntriesTable entries={entries} />

      {/* FLOATING BUTTON */}
      <FloatingAddButton />

    </div>
  )
}