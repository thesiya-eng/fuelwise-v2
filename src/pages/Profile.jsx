import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Profile() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [carName, setCarName] = useState("")
  const [fuelType, setFuelType] = useState("")
  const [tankSize, setTankSize] = useState("")

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const { data: userData } = await supabase.auth.getUser()
    const currentUser = userData.user
    setUser(currentUser)

    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", currentUser.id)
      .single()

    if (data) {
      setCarName(data.car_name || "")
      setFuelType(data.fuel_type || "")
      setTankSize(data.tank_size || "")
    }

    setLoading(false)
  }

  async function saveProfile() {
    if (!user) return

    const { error } = await supabase
      .from("user_settings")
      .upsert({
        user_id: user.id,
        car_name: carName,
        fuel_type: fuelType,
        tank_size: Number(tankSize)
      })

    if (error) {
      alert("Error saving profile")
    } else {
      alert("Profile saved ✅")
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>

      <h1 style={{ marginBottom: 20 }}>Profile</h1>

      <div className="card section">
        <h3 style={{ opacity: 0.7 }}>User Info</h3>
        <p style={{ fontWeight: 600 }}>{user?.email}</p>
      </div>

      <div className="card">

        <h3 style={{ marginBottom: 16 }}>Vehicle Info</h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12
        }}>

          <input
            className="input"
            placeholder="Car Name"
            value={carName}
            onChange={(e) => setCarName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Fuel Type"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
          />

          <input
            className="input"
            type="number"
            placeholder="Tank Size (L)"
            value={tankSize}
            onChange={(e) => setTankSize(e.target.value)}
          />

        </div>

        <button
          onClick={saveProfile}
          className="btn-primary"
          style={{ marginTop: 16, width: "100%" }}
        >
          Save Changes
        </button>

      </div>

    </div>
  )
}