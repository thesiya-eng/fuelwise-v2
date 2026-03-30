import React from "react"

function Row({ label, value }) {
  return (

    <div className="row space">

      <span className="small">{label}</span>

      <strong>{value}</strong>

    </div>

  )
}

export default function LastFillSummary({ entries = [] }){

  if(!entries.length){
    return null
  }

  const last = entries[0]

  const distance = last.distance_km || 0
  const liters = last.liters || 0
  const cost = last.total_cost || 0

  const efficiency =
    distance && liters
      ? (distance / liters).toFixed(2)
      : "-"

  const costPerKm =
    distance
      ? (cost / distance).toFixed(2)
      : "-"

  return(

    <div className="card">

      <div className="card-inner">

        <div className="kicker">Last Fill-Up</div>

        <div style={{height:10}} />

        <Row
          label="Distance Driven"
          value={`${distance} km`}
        />

        <Row
          label="Fuel Used"
          value={`${liters} L`}
        />

        <Row
          label="Efficiency"
          value={
            efficiency !== "-"
              ? `${efficiency} km/L`
              : "-"
          }
        />

        <Row
          label="Cost per KM"
          value={
            costPerKm !== "-"
              ? `R ${costPerKm}/km`
              : "-"
          }
        />

      </div>

    </div>

  )

}