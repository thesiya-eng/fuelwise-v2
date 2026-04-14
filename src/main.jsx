import React from "react"
import ReactDOM from "react-dom/client"
import App from "./AppFixed.jsx"
import "./styles.css"
import { BrowserRouter } from "react-router-dom"
import { UserProvider } from "./context/UserContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
)