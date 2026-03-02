import { parseISO } from 'date-fns'

export function normalizeEntries(entries){
  // Ensure sorted oldest -> newest for distance calculations
  const sorted = [...entries].sort((a,b)=>{
    const da = new Date(a.entry_date);
    const db = new Date(b.entry_date);
    if (da - db !== 0) return da - db;
    const ca = new Date(a.created_at);
    const cb = new Date(b.created_at);
    if (ca - cb !== 0) return ca - cb;
    return Number(a.odometer_km) - Number(b.odometer_km);
  })

  let prevOdo = null
  return sorted.map(e=>{
    const odometer = Number(e.odometer_km)
    const liters = Number(e.liters)
    const totalCost = Number(e.total_cost)

    const pricePerLiter = liters > 0 ? totalCost / liters : null
    const distance = (prevOdo !== null && Number.isFinite(prevOdo)) ? (odometer - prevOdo) : null
    prevOdo = odometer

    const costPerKm = (distance && distance > 0) ? (totalCost / distance) : null
    const kmPerLiter = (liters > 0 && distance && distance > 0) ? (distance / liters) : null

    return {
      ...e,
      _calc: {
        pricePerLiter,
        distance,
        costPerKm,
        kmPerLiter,
      }
    }
  })
}

export function computeStats(entries){
  const e = normalizeEntries(entries)

  const totals = e.reduce((acc, x)=>{
    acc.totalCost += Number(x.total_cost || 0)
    acc.totalLiters += Number(x.liters || 0)
    const d = x._calc.distance
    if (d && d > 0) acc.totalKm += d
    return acc
  }, { totalCost:0, totalLiters:0, totalKm:0 })

  const avgPricePerLiter = totals.totalLiters > 0 ? (totals.totalCost / totals.totalLiters) : null
  const avgCostPerKm = totals.totalKm > 0 ? (totals.totalCost / totals.totalKm) : null
  const avgKmPerLiter = (totals.totalLiters > 0 && totals.totalKm > 0) ? (totals.totalKm / totals.totalLiters) : null

  let mostExpensive = null
  let cheapestPrice = null
  let priceSpike = null

  for (const x of e){
    const cost = Number(x.total_cost || 0)
    const ppl = x._calc.pricePerLiter
    if (!mostExpensive || cost > Number(mostExpensive.total_cost || 0)) mostExpensive = x
    if (ppl && (cheapestPrice === null || ppl < cheapestPrice)) cheapestPrice = ppl
  }

  // Spike detection: compare last price/liter to median of previous 5
  const prices = e.map(x=>x._calc.pricePerLiter).filter(v=>Number.isFinite(v))
  if (prices.length >= 6){
    const last = prices[prices.length-1]
    const prev = prices.slice(Math.max(0, prices.length-6), prices.length-1)
    const sorted = [...prev].sort((a,b)=>a-b)
    const mid = Math.floor(sorted.length/2)
    const median = sorted.length % 2 ? sorted[mid] : (sorted[mid-1]+sorted[mid])/2
    if (median > 0){
      const pct = (last - median) / median
      if (pct >= 0.08){
        priceSpike = { last, median, pct } // >=8% spike
      }
    }
  }

  return {
    totals,
    avgPricePerLiter,
    avgCostPerKm,
    avgKmPerLiter,
    mostExpensive,
    cheapestPricePerLiter: cheapestPrice,
    priceSpike,
    normalized: e,
  }
}
