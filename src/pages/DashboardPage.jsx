import React from 'react'
import { supabase } from '../lib/supabaseClient'
import EntryForm from '../components/EntryForm.jsx'
import EntriesTable from '../components/EntriesTable.jsx'
import StatCards from '../components/StatCards.jsx'
import ChartsPanel from '../components/ChartsPanel.jsx'
import { computeStats } from '../utils/calculations'
import { formatNumber, formatZAR } from '../lib/format'
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns'

export default function DashboardPage(){
  const [entries, setEntries] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [editing, setEditing] = React.useState(null)
  const [toast, setToast] = React.useState(null)

  async function load(){
    setLoading(true)
    const { data: userRes } = await supabase.auth.getUser()
    const userId = userRes?.user?.id
    if (!userId){
      setEntries([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('fuel_entries')
      .select('*')
      .order('entry_date', { ascending: true })

    if (error){
      setToast({ type:'bad', text: error.message })
      setEntries([])
    }else{
      setEntries(data || [])
    }
    setLoading(false)
  }

  React.useEffect(()=>{
    load()
    const { data: sub } = supabase
      .channel('fuel_entries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fuel_entries' }, () => {
        // Reload on change
        load()
      })
      .subscribe()

    return ()=> { supabase.removeChannel(sub) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = React.useMemo(()=> computeStats(entries), [entries])

  const monthlySpend = React.useMemo(()=>{
    const now = new Date()
    const start = startOfMonth(now)
    const end = endOfMonth(now)
    const total = stats.normalized.reduce((acc, x)=>{
      const d = parseISO(String(x.entry_date))
      if (isWithinInterval(d, { start, end })) acc += Number(x.total_cost || 0)
      return acc
    }, 0)
    return total
  }, [stats.normalized])

  async function addOrUpdate(payload){
    setSaving(true)
    setToast(null)
    const { data: userRes } = await supabase.auth.getUser()
    const userId = userRes?.user?.id

    if (!userId){
      setToast({ type:'bad', text: 'Not signed in.' })
      setSaving(false)
      return
    }

    if (editing){
      const { error } = await supabase
        .from('fuel_entries')
        .update(payload)
        .eq('id', editing.id)

      if (error) setToast({ type:'bad', text: error.message })
      else{
        setToast({ type:'good', text: 'Entry updated.' })
        setEditing(null)
      }
    }else{
      const { error } = await supabase
        .from('fuel_entries')
        .insert({ ...payload, user_id: userId })

      if (error) setToast({ type:'bad', text: error.message })
      else setToast({ type:'good', text: 'Entry added.' })
    }

    setSaving(false)
    // load() will happen via realtime channel; but for safety:
    await load()
  }

  async function remove(row){
    const ok = confirm(`Delete entry on ${row.entry_date}?`)
    if (!ok) return
    setToast(null)
    const { error } = await supabase.from('fuel_entries').delete().eq('id', row.id)
    if (error) setToast({ type:'bad', text: error.message })
    else setToast({ type:'good', text: 'Entry deleted.' })
    await load()
  }

  const highlight = React.useMemo(()=>{
    const most = stats.mostExpensive
    const cheapest = stats.cheapestPricePerLiter
    const spike = stats.priceSpike
    return { most, cheapest, spike }
  }, [stats])

  return (
    <div className="grid" style={{gap:14}}>
      <EntryForm onSubmit={addOrUpdate} submitting={saving} initial={editing} />

      {toast ? <div className={`toast ${toast.type === 'good' ? 'good' : 'bad'}`}>{toast.text}</div> : null}

      <StatCards stats={stats} />

      <div className="grid cols-3">
        <div className="card">
          <div className="card-inner">
            <div className="kicker">This month</div>
            <div style={{fontSize:22, fontWeight:850, marginTop:6}}>{formatZAR(monthlySpend)}</div>
            <p className="small" style={{marginTop:6}}>Spend for the current calendar month.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div className="kicker">Avg Price / Liter</div>
            <div style={{fontSize:22, fontWeight:850, marginTop:6}}>
              {stats.avgPricePerLiter ? `R${formatNumber(stats.avgPricePerLiter, 2)}/L` : '-'}
            </div>
            <p className="small" style={{marginTop:6}}>Based on your total spend and liters.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div className="kicker">Avg Efficiency</div>
            <div style={{fontSize:22, fontWeight:850, marginTop:6}}>
              {stats.avgKmPerLiter ? `${formatNumber(stats.avgKmPerLiter, 2)} km/L` : '-'}
            </div>
            <p className="small" style={{marginTop:6}}>Calculated from odometer differences.</p>
          </div>
        </div>
      </div>

      <ChartsPanel normalized={stats.normalized} />

      <div className="grid cols-3">
        <div className="card">
          <div className="card-inner">
            <div className="kicker">Most expensive fill-up</div>
            <div style={{fontSize:18, fontWeight:850, marginTop:6}}>
              {highlight.most ? formatZAR(highlight.most.total_cost) : '-'}
            </div>
            <p className="small" style={{marginTop:6}}>
              {highlight.most ? `Date: ${highlight.most.entry_date}` : 'Add entries to see this.'}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div className="kicker">Cheapest price per liter</div>
            <div style={{fontSize:18, fontWeight:850, marginTop:6}}>
              {highlight.cheapest ? `R${formatNumber(highlight.cheapest, 2)}/L` : '-'}
            </div>
            <p className="small" style={{marginTop:6}}>Lowest R/L from your history.</p>
          </div>
        </div>

        <div className="card">
          <div className="card-inner">
            <div className="kicker">Price spike detector</div>
            <div style={{fontSize:18, fontWeight:850, marginTop:6}}>
              {highlight.spike ? `+${formatNumber(highlight.spike.pct*100, 1)}%` : 'Normal'}
            </div>
            <p className="small" style={{marginTop:6}}>
              {highlight.spike ? 'Last fill-up price/L is higher than recent median.' : 'No unusual spike detected.'}
            </p>
          </div>
        </div>
      </div>

      <EntriesTable
        rows={stats.normalized}
        onEdit={(row)=> setEditing(row)}
        onDelete={remove}
      />

      {loading ? (
        <div className="toast">Loading entries…</div>
      ) : null}
    </div>
  )
}
