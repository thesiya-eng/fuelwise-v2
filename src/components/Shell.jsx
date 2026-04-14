import React from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import fuelLogo from "../assets/logo.png"
import fleetLogo from "../assets/fleetwise.png"

import EntryForm from "../components/EntryForm"
import DailyOdometerForm from "../components/DailyOdometerForm"

export default function Shell({ children }) {

  const navigate = useNavigate()

  const [user, setUser] = React.useState(null)
  const [mode, setMode] = React.useState("fuel")

  const [company, setCompany] = React.useState(null)
  const [loadingCompany, setLoadingCompany] = React.useState(true)

  const [showEntry, setShowEntry] = React.useState(false)
  const [showOdometer, setShowOdometer] = React.useState(false)
  const [showLogoPopup, setShowLogoPopup] = React.useState(false)

  React.useEffect(() => {
    loadUser()

    const savedMode = localStorage.getItem("appMode")
    if (savedMode) setMode(savedMode)

    function handleOpenEntry() {
      setShowEntry(true)
    }

    function handleOpenOdometer() {
      setShowOdometer(true)
    }

    window.addEventListener("openEntry", handleOpenEntry)
    window.addEventListener("openOdometer", handleOpenOdometer)

    return () => {
      window.removeEventListener("openEntry", handleOpenEntry)
      window.removeEventListener("openOdometer", handleOpenOdometer)
    }
  }, [])

  React.useEffect(() => {
    if (user) loadCompany()
  }, [user])

  async function loadUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user || null)
  }

  async function loadCompany() {
    setLoadingCompany(true)

    const { data } = await supabase
      .from("company_members")
      .select(`
        company_id,
        companies (
          id,
          name
        )
      `)
      .eq("user_id", user.id)
      .maybeSingle()

    if (data) setCompany(data.companies)

    setLoadingCompany(false)
  }

  async function createCompany() {
    if (!user) return

    const companyName = prompt("Enter your company name")
    if (!companyName) return

    const vehicleName = prompt("Enter your vehicle name (e.g. Ford Ranger)")

    // 1. Create company
    const { data: companyData, error: companyError } = await supabase
      .from("companies")
      .insert([{ name: companyName, created_by: user.id }])
      .select()
      .single()

    if (companyError) {
      alert(companyError.message)
      return
    }

    // 2. Link user
    await supabase.from("company_members").insert([
      {
        user_id: user.id,
        company_id: companyData.id,
        role: "admin"
      }
    ])

    // 3. Create vehicle
    const { data: vehicleData } = await supabase
      .from("vehicles")
      .insert([
        {
          company_id: companyData.id,
          name: vehicleName || "Primary Vehicle"
        }
      ])
      .select()
      .single()

    // 🔥 Store both
    localStorage.setItem("fleetVehicleId", vehicleData.id)
    localStorage.setItem("fleetVehicleName", vehicleData.name)

    await loadCompany()
  }

  async function logout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  function toggleMode() {
    const newMode = mode === "fuel" ? "fleet" : "fuel"
    setMode(newMode)
    localStorage.setItem("appMode", newMode)
  }

  const initials =
    user?.email
      ? user.email.split("@")[0][0].toUpperCase()
      : "U"

  const glassBtn = {
    padding: "10px 16px",
    borderRadius: 18,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
    backdropFilter: "blur(8px)",
    cursor: "pointer"
  }

  const appName = mode === "fuel" ? "FuelWise" : "FleetWise"
  const slogan =
    mode === "fuel"
      ? "Smart Fuel Tracking"
      : "Fleet Intelligence Platform"

  const currentLogo = mode === "fuel" ? fuelLogo : fleetLogo

  if (mode === "fleet" && !loadingCompany && !company) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: 80 }}>
        <h1>🚀 FleetWise</h1>
        <h2>Start Your Fleet</h2>

        <button style={glassBtn} onClick={createCompany}>
          Start Your Fleet
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      <div className="container">
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          padding: "18px 24px",
          backdropFilter: "blur(10px)"
        }}>

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                overflow: "hidden"
              }}>
                <img src={currentLogo} alt="logo" style={{ width: "100%" }} />
              </div>

              <div>
                <h2 style={{ margin: 0 }}>{appName}</h2>
                <p style={{ margin: 0, opacity: 0.7 }}>{slogan}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button style={glassBtn} onClick={toggleMode}>
                Switch Mode
              </button>
              <button style={glassBtn} onClick={logout}>
                Logout
              </button>
            </div>

          </div>

        </div>
      </div>

      {children}

      {showEntry && (
        <div className="modal-backdrop">
          <EntryForm onClose={() => setShowEntry(false)} />
        </div>
      )}

      {showOdometer && (
        <div className="modal-backdrop">
          <DailyOdometerForm onClose={() => setShowOdometer(false)} />
        </div>
      )}

    </div>
  )
}