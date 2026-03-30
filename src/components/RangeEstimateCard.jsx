import React from "react"

export default function RangeEstimateCard({ entries = [] }){

  if(!entries.length){
    return null
  }

  const last = entries[0]

  const efficiency = last.efficiency_km_l || 0

  const tankSize = 50 // default tank size (liters)

  const estimatedRange =
    efficiency > 0
      ? (efficiency * tankSize).toFixed(0)
      : 0

  const progress =
    efficiency > 0
      ? Math.min((estimatedRange / (tankSize * 15)) * 100,100)
      : 0

  return(

    <div className="card">

      <div className="card-inner">

        <div className="kicker">Estimated Range</div>

        <div style={{height:6}} />

        <div style={{fontSize:24,fontWeight:850}}>
          {estimatedRange} km
        </div>

        <div
          style={{
            height:10,
            background:"#eee",
            borderRadius:6,
            marginTop:10
          }}
        >

          <div
            style={{
              height:"100%",
              width:`${progress}%`,
              background:"#4f46e5",
              borderRadius:6
            }}
          />

        </div>

        <p className="small" style={{marginTop:8}}>
          Based on your last tank efficiency
        </p>

      </div>

    </div>

  )

}