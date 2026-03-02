import React from 'react'
import { formatNumber, formatZAR } from '../lib/format'

export default function EntriesTable({ rows, onEdit, onDelete }){
  if (!rows?.length){
    return (
      <div className="card">
        <div className="card-inner">
          <h2>Your entries</h2>
          <p className="small">No entries yet. Add your first fill-up above.</p>
        </div>
      </div>
    )
  }

  // Show newest first in table
  const list = [...rows].sort((a,b)=> String(b.entry_date).localeCompare(String(a.entry_date)))

  return (
    <div className="card">
      <div className="card-inner">
        <div className="row space">
          <div>
            <h2>Your entries</h2>
            <p className="small">Newest first. Distance is calculated from the previous entry.</p>
          </div>
          <span className="badge">{list.length} entries</span>
        </div>
        <div style={{height:12}} />

        <div style={{overflowX:'auto'}}>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Odo (km)</th>
                <th>Liters</th>
                <th>Total</th>
                <th>R/L</th>
                <th>KM</th>
                <th>KM/L</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(r=>{
                const c = r._calc || {}
                return (
                  <tr key={r.id}>
                    <td>{r.entry_date}</td>
                    <td>{formatNumber(r.odometer_km, 1)}</td>
                    <td>{formatNumber(r.liters, 2)}</td>
                    <td>{formatZAR(r.total_cost)}</td>
                    <td>{c.pricePerLiter ? `R${formatNumber(c.pricePerLiter, 2)}` : '-'}</td>
                    <td>{c.distance ? formatNumber(c.distance, 1) : '-'}</td>
                    <td>{c.kmPerLiter ? formatNumber(c.kmPerLiter, 2) : '-'}</td>
                    <td style={{whiteSpace:'nowrap'}}>
                      <button className="btn secondary" onClick={()=>onEdit(r)}>Edit</button>{' '}
                      <button className="btn danger" onClick={()=>onDelete(r)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="toast">
          Pro tip: To get accurate KM per fill-up, always enter your odometer reading each time you refuel.
        </div>
      </div>
    </div>
  )
}
