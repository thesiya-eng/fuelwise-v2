import React, { useState } from "react"
import { useUser } from "../context/UserContext"
import { addVehicle } from "../services/fleetService"

export default function AddVehicleButton({ onAdded }) {

  const { user } = useUser()

  const [name, setName] = useState("")
  const [plate, setPlate] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    if (!name) return

    setLoading(true)

    const vehicle = await addVehicle(user.id, name, plate)

    if (vehicle) {
      setName("")
      setPlate("")
      onAdded && onAdded()
      alert("Vehicle added 🚗")
    }

    setLoading(false)
  }

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        placeholder="Vehicle name (e.g. Polo)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      />

      <input
        placeholder="Plate number"
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      />

      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add Vehicle"}
      </button>
    </div>
  )
}