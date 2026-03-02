import React from 'react'
import { formatZAR, formatNumber } from '../lib/format'

function Stat({ label, value, hint }){
  return (
    <div className="card">
      <div className="card-inner">
        <div className="kicker">{label}</div>
        <div style={{height:6}} />
        <div style={{fontSize:22, fontWeight:850}}>{value}</div>
        {hint ? <p className="small" style={{marginTop:6}}>{hint}</p> : null}
      </div>
    </div>
  )
}

export default function StatCards({ stats }){
  const t = stats?.totals
  if (!t) return null

  return (
    <div className="grid cols-4">
      <Stat label="Total Spend" value={formatZAR(t.totalCost)} />
      <Stat label="Total Liters" value={`${formatNumber(t.totalLiters, 2)} L`} />
      <Stat label="Total KM" value={`${formatNumber(t.totalKm, 1)} km`} hint="Calculated from odometer differences" />
      <Stat label="Avg Cost / KM" value={stats.avgCostPerKm ? formatZAR(stats.avgCostPerKm) : '-'} hint="Lower is better" />
    </div>
  )
}
