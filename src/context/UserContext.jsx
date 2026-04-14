import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accountType, setAccountType] = useState("personal")
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  async function handleInvites(currentUser) {
    if (!currentUser) return

    const { data: invite } = await supabase
      .from("invites")
      .select("*")
      .eq("email", currentUser.email)
      .eq("status", "pending")
      .single()

    if (invite) {
      // ✅ Add user to company
      await supabase.from("company_memberships").insert({
        user_id: currentUser.id,
        company_id: invite.company_id,
        role: "member",
      })

      // 🧹 Mark invite as accepted
      await supabase
        .from("invites")
        .update({ status: "accepted" })
        .eq("id", invite.id)
    }
  }

  async function loadUserData(currentUser) {
    if (!currentUser) {
      setAccountType("personal")
      setCompany(null)
      return
    }

    // 🔥 HANDLE INVITES FIRST
    await handleInvites(currentUser)

    // 🔍 CHECK MEMBERSHIP
    const { data: membership, error } = await supabase
      .from("company_memberships")
      .select("*, companies(*)")
      .eq("user_id", currentUser.id)
      .single()

    if (membership) {
      setAccountType("fleet")
      setCompany(membership.companies)
    } else {
      setAccountType("personal")
      setCompany(null)
    }

    if (error && error.code !== "PGRST116") {
      console.warn("Membership fetch error:", error)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user
      setUser(sessionUser)
      loadUserData(sessionUser)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user
        setUser(sessionUser)
        loadUserData(sessionUser)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <UserContext.Provider value={{ user, accountType, company }}>
      {!loading && children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}