import { createClient } from '@supabase/supabase-js'

// 🔥 HARD FAIL SAFE (logs if env missing)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
console.error("❌ Supabase ENV NOT LOADED", {
url: supabaseUrl,
key: supabaseAnon,
})
}

// 🚀 ALWAYS create client (prevents null crash)
export const supabase = createClient(
supabaseUrl || "https://hypwkhtisxbhjflrkyc.supabase.co",
supabaseAnon || "sb_publishable_HFKhLMyyMZdQuM7wleT0mQ_ynSXU63q",
{
auth: {
persistSession: true,
autoRefreshToken: true,
detectSessionInUrl: true,
},
}
)
