import React from "react"
import { supabase } from "../lib/supabaseClient"
import { formatZAR } from "../utils/format"

export default function EntriesTable({ entries }) {

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this entry?")
    if (!confirmDelete) return

    const { error } = await supabase
      .from("fuel_entries")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error deleting entry")
      console.error(error)
    } else {
      window.dispatchEvent(new Event("entryAdded"))
    }
  }

  const handleEdit = async (entry) => {
    const newCost = prompt("Update total cost:", entry.total_cost)
    const newLiters = prompt("Update liters:", entry.liters)
    const newOdometer = prompt("Update odometer:", entry.odometer_km)

    if (!newCost || !newLiters || !newOdometer) return

    const { error } = await supabase
      .from("fuel_entries")
      .update({
        total_cost: Number(newCost),
        liters: Number(newLiters),
        odometer_km: Number(newOdometer)
      })
      .eq("id", entry.id)

    if (error) {
      alert("Error updating entry")
      console.error(error)
    } else {
      window.dispatchEvent(new Event("entryAdded"))
    }
  }

  const cardStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "20px"
  }

  return (
    <div style={cardStyle}>

      <h3 style={{ marginBottom: 16 }}>Recent Fuel Entries</h3>

      {entries.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No fuel entries yet.</p>
      ) : (

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,

            // 🔥 THIS IS THE KEY PART
            maxHeight: "900px", // ~15 entries
            overflowY: "auto",
            paddingRight: "6px"
          }}
        >

          {entries.map((entry, index) => {
            const prev = entries[index + 1]

            let distance = null

            if (prev) {
              distance = entry.odometer_km - prev.odometer_km
            }

            return (
              <div
                key={entry.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              >

                <div style={{ display: "flex", gap: 16 }}>

                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {formatZAR(entry.total_cost)}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                      {entry.entry_date}
                    </div>
                  </div>

                  <div style={{ fontSize: 13 }}>
                    {entry.liters} L
                  </div>

                  <div style={{ fontSize: 13 }}>
                    {entry.odometer_km} km
                    {distance !== null && (
                      <span style={{ marginLeft: 8, opacity: 0.6 }}>
                        (+{distance} km)
                      </span>
                    )}
                  </div>

                </div>

                <div style={{ display: "flex", gap: 10 }}>

                  <button
                    onClick={() => handleEdit(entry)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "none",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.1)",
                      color: "white"
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(entry.id)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "8px",
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    🗑️
                  </button>

                </div>

              </div>
            )
          })}

        </div>

      )}

    </div>
  )
}