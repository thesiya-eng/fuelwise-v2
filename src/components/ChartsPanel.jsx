import React from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'
import { format } from 'date-fns'
import { formatZAR, formatNumber } from '../lib/format'

function makeCostSeries(normalized){
  // newest -> oldest for chart X order
  const arr = [...normalized].sort((a,b)=> String(a.entry_date).localeCompare(String(b.entry_date)))
  return arr.map(x=>({
    date: x.entry_date,
    cost: Number(x.total_cost || 0),
    ppl: Number(x._calc.pricePerLiter || 0),
  }))
}

function makeKmSeries(normalized){
  const arr = [...normalized].sort((a,b)=> String(a.entry_date).localeCompare(String(b.entry_date)))
  return arr.map(x=>({
    date: x.entry_date,
    km: Number(x._calc.distance || 0),
  }))
}

export default function ChartsPanel({ normalized }){
  if (!normalized?.length) return null
  const costSeries = makeCostSeries(normalized)
  const kmSeries = makeKmSeries(normalized)

  return (
    <div className="grid cols-2">
      <div className="card">
        <div className="card-inner">
          <div className="row space">
            <div>
              <h2>Spend Over Time</h2>
              <p className="small">Each point is a fill-up total cost.</p>
            </div>
            <span className="badge">Recharts</span>
          </div>
          <div style={{height:14}} />
          <div style={{width:'100%', height:280}}>
            <ResponsiveContainer>
              <LineChart data={costSeries} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="date" tickFormatter={(d)=> {
                  try{ return format(new Date(d), 'dd MMM') }catch{ return d }
                }} />
                <YAxis tickFormatter={(v)=> {
                  const n = Number(v)
                  if (!Number.isFinite(n)) return ''
                  return `R${Math.round(n)}`
                }} />
                <Tooltip formatter={(v)=> formatZAR(v)} labelFormatter={(d)=> `Date: ${d}`} />
                <Line type="monotone" dataKey="cost" strokeWidth={2} dot />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-inner">
          <div className="row space">
            <div>
              <h2>KM Between Fill-ups</h2>
              <p className="small">Distance is calculated using odometer differences.</p>
            </div>
            <span className="badge">Usage</span>
          </div>
          <div style={{height:14}} />
          <div style={{width:'100%', height:280}}>
            <ResponsiveContainer>
              <BarChart data={kmSeries} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="date" tickFormatter={(d)=> {
                  try{ return format(new Date(d), 'dd MMM') }catch{ return d }
                }} />
                <YAxis tickFormatter={(v)=> formatNumber(v, 0)} />
                <Tooltip formatter={(v)=> `${formatNumber(v, 1)} km`} labelFormatter={(d)=> `Date: ${d}`} />
                <Bar dataKey="km" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
