export function formatZAR(value){
  const n = Number(value || 0)
  try{
    return new Intl.NumberFormat('en-ZA', { style:'currency', currency:'ZAR' }).format(n)
  }catch{
    return `R${n.toFixed(2)}`
  }
}

export function formatNumber(value, digits=2){
  const n = Number(value)
  if (!Number.isFinite(n)) return '-'
  return n.toFixed(digits)
}

export function initialsFromEmail(email){
  if (!email) return 'FW'
  const s = String(email).split('@')[0].replace(/[^a-zA-Z0-9]/g,'').slice(0,2)
  return (s || 'FW').toUpperCase()
}
