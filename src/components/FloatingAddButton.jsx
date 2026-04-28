import React, { useState } from "react"

export default function FloatingAddButton({ onAdd }) {

  const [open, setOpen] = useState(false)

  const isMobile = window.innerWidth < 768

  const handleMainClick = () => {
    if (isMobile) {
      onAdd()
    } else {
      setOpen(!open)
    }
  }

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      zIndex: 1000
    }}>

      {!isMobile && open && (
        <div style={{
          position: "absolute",
          bottom: 60,
          right: 0,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
          <div onClick={onAdd} style={menuItem}>
            ➕ Add Fuel Entry
          </div>
        </div>
      )}

      <button onClick={handleMainClick} style={fabStyle}>
        + Add Entry
      </button>

    </div>
  )
}

const fabStyle = {
  padding: "14px 20px",
  borderRadius: 30,
  background: "linear-gradient(135deg, #6366f1, #22c55e)",
  color: "white",
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
}

const menuItem = {
  padding: "10px 14px",
  borderRadius: 10,
  background: "rgba(0,0,0,0.85)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "white",
  cursor: "pointer",
  backdropFilter: "blur(10px)"
}