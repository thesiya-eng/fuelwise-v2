import { supabase } from "../lib/supabaseClient"

export async function getVehicles(userId) {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    console.error("Error fetching vehicles:", error)
    return []
  }

  return data
}

export async function addVehicle(userId, name, plate) {
  const { error } = await supabase.from("vehicles").insert([
    {
      user_id: userId,
      name,
      plate_number: plate,
    },
  ])

  if (error) {
    console.error("Error adding vehicle:", error)
  }
}