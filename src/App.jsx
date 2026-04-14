import React, { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"
import { Routes, Route } from "react-router-dom"

import Shell from "./components/Shell.jsx"
import Dashboard from "./pages/DashboardPage.jsx"
import Profile from "./pages/Profile.jsx"
import Settings from "./pages/Settings.jsx"
import AuthPage from "./pages/AuthPage.jsx"

export default function App() {

const [session, setSession] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
supabase.auth.getSession().then(({ data }) => {
setSession(data.session)
setLoading(false)
})

```
const { data: listener } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    setSession(session)
  }
)

return () => listener.subscription.unsubscribe()
```

}, [])

// 🔥 SHOW SOMETHING WHILE LOADING
if (loading) {
return (
<div style={{ padding: "40px", color: "white" }}> <h2>Loading FuelWise...</h2> </div>
)
}

// 🔐 NOT LOGGED IN
if (!session) {
return <AuthPage />
}

// ✅ LOGGED IN
return ( <Shell> <Routes>
<Route path="/" element={<Dashboard />} />
<Route path="/profile" element={<Profile />} />
<Route path="/settings" element={<Settings />} /> </Routes> </Shell>
)
}
