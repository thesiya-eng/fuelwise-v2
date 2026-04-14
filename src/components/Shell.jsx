import React from "react"
import { useNavigate } from "react-router-dom"

export default function Shell({ children }) {

const navigate = useNavigate()

const mode = localStorage.getItem("appMode") || "fuel"

const switchMode = () => {
const newMode = mode === "fuel" ? "fleet" : "fuel"

```
localStorage.setItem("appMode", newMode)

// 🔥 FORCE REACT TO UPDATE
window.dispatchEvent(new Event("modeChanged"))
```

}

const logout = () => {
localStorage.clear()
navigate("/")
}

return ( <div>

```
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    alignItems: "center"
  }}>
    <h2>
      {mode === "fleet"
        ? "FleetWise"
        : "FuelWise"}
    </h2>

    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={switchMode}>
        Switch Mode
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  </div>

  {children}

</div>
```

)
}
