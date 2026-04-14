import React, { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useUser } from "../context/UserContext"

export default function JoinCompany({ onJoined }) {
const { user } = useUser()

const [companyName, setCompanyName] = useState("")
const [loading, setLoading] = useState(false)

async function handleJoin() {
if (!companyName) return

```
setLoading(true)

try {
  // 🔍 Find company safely (no crash if not found)
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .ilike("name", companyName)

  if (error) throw error

  const company = data?.[0]

  if (!company) {
    alert("Company not found")
    setLoading(false)
    return
  }

  // 🚫 Prevent duplicate joins
  const { data: existing } = await supabase
    .from("company_memberships")
    .select("*")
    .eq("user_id", user.id)
    .eq("company_id", company.id)
    .maybeSingle()

  if (existing) {
    alert("You already joined this company")
    setLoading(false)
    return
  }

  // ✅ Insert membership
  const { error: insertError } = await supabase
    .from("company_memberships")
    .insert([
      {
        user_id: user.id,
        company_id: company.id,
      },
    ])

  if (insertError) throw insertError

  alert("Joined company 🎉")
  onJoined && onJoined()

} catch (err) {
  console.error(err)
  alert("Something went wrong. Try again.")
}

setLoading(false)
```

}

return (
<div
style={{
marginBottom: "25px",
padding: "20px",
borderRadius: "18px",
background: "rgba(255,255,255,0.05)",
border: "1px solid rgba(255,255,255,0.1)",
backdropFilter: "blur(12px)",
}}
>
<div style={{ marginBottom: "12px", opacity: 0.7 }}>
Join a fleet company </div>

```
  <div style={{ display: "flex", gap: "10px" }}>
    <input
      placeholder="Enter company name"
      value={companyName}
      onChange={(e) => setCompanyName(e.target.value)}
      style={{
        flex: 1,
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.05)",
        color: "white",
        outline: "none",
      }}
    />

    <button
      onClick={handleJoin}
      disabled={loading}
      style={{
        padding: "12px 18px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(135deg, #6366f1, #22c55e)",
        color: "white",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Joining..." : "Join"}
    </button>
  </div>
</div>
```

)
}
