import React from 'react'
import { format } from 'date-fns'

const todayStr = () => {
  try { return format(new Date(), 'yyyy-MM-dd') } catch { return '' }
}

export default function EntryForm({ onSubmit, submitting, initial }){
  const [entryDate, setEntryDate] = React.useState(initial?.entry_date || todayStr())
  const [odometer, setOdometer] = React.useState(initial?.odometer_km ?? '')
  const [liters, setLiters] = React.useState(initial?.liters ?? '')
  const [totalCost, setTotalCost] = React.useState(initial?.total_cost ?? '')
  const [station, setStation] = React.useState(initial?.station ?? '')
  const [notes, setNotes] = React.useState(initial?.notes ?? '')

  React.useEffect(()=>{
    if (!initial) return
    setEntryDate(initial.entry_date || todayStr())
    setOdometer(initial.odometer_km ?? '')
    setLiters(initial.liters ?? '')
    setTotalCost(initial.total_cost ?? '')
    setStation(initial.station ?? '')
    setNotes(initial.notes ?? '')
  }, [initial])

  const pricePerLiter = (() => {
    const l = Number(liters)
    const c = Number(totalCost)
    if (Number.isFinite(l) && l > 0 && Number.isFinite(c)) return c / l
    return null
  })()

  function submit(e){
    e.preventDefault()
    onSubmit({
      entry_date: entryDate,
      odometer_km: Number(odometer),
      liters: Number(liters),
      total_cost: Number(totalCost),
      station: station?.trim() || null,
      notes: notes?.trim() || null,
    })
  }

  return (
    <form onSubmit={submit} className="card">
      <div className="card-inner">
        <div className="row space">
          <div>
            <h2>{initial ? 'Edit Entry' : 'Add Fuel Entry'}</h2>
            <p className="small">Enter odometer, liters and total cost — we calculate the rest.</p>
          </div>
          <span className="badge">{pricePerLiter ? `~ R${pricePerLiter.toFixed(2)}/L` : 'Price/L auto'}</span>
        </div>

        <div style={{height:14}} />

        <div className="grid cols-2">
          <div>
            <label>Date</label>
            <input className="input" type="date" value={entryDate} onChange={e=>setEntryDate(e.target.value)} required />
          </div>
          <div>
            <label>Odometer (km)</label>
            <input className="input" type="number" step="0.1" min="0" value={odometer} onChange={e=>setOdometer(e.target.value)} required />
          </div>
          <div>
            <label>Liters</label>
            <input className="input" type="number" step="0.01" min="0.01" value={liters} onChange={e=>setLiters(e.target.value)} required />
          </div>
          <div>
            <label>Total Cost (R)</label>
            <input className="input" type="number" step="0.01" min="0" value={totalCost} onChange={e=>setTotalCost(e.target.value)} required />
          </div>
          <div>
            <label>Station (optional)</label>
            <input className="input" value={station} onChange={e=>setStation(e.target.value)} placeholder="Shell, BP, Engen…" />
          </div>
          <div>
            <label>Notes (optional)</label>
            <input className="input" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Anything to remember…" />
          </div>
        </div>

        <div style={{height:14}} />
        <div className="row space">
          <div className="small">
            {pricePerLiter ? `Estimated price per liter: R${pricePerLiter.toFixed(2)}` : 'Fill in liters + total cost to see price/L.'}
          </div>
          <button className="btn" disabled={submitting}>
            {submitting ? 'Saving…' : (initial ? 'Save Changes' : 'Add Entry')}
          </button>
        </div>
      </div>
    </form>
  )
}
