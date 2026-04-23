import { supabase } from "../lib/supabaseClient"

// 🔹 GET ALL VEHICLES
export async function getVehicles(userId) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching vehicles:", error)
    return []
  }

  return data || []
}

// 🔹 ADD VEHICLE
export async function addVehicle(userId, name, plate) {
  const { data, error } = await supabase
    .from("vehicles")
    .insert([
      {
        user_id: userId,
        name,
        plate_number: plate,
      },
    ])
    .select()

  if (error) {
    console.error("Error adding vehicle:", error)
    return null
  }

  return data[0]
}