"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login/login"
import Home from "./pages/home/home"
import PlanTrip from "./pages/planejar viagens/planejar-viagens"
import MyTrips from "./pages/minhas-viagens/minhas-viagens"
import TripDetails from "./pages/detalhes-viagem/detalhes-viagem"
import "./App.css"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("currentUser")
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={isLoggedIn ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/plan-trip"
          element={isLoggedIn ? <PlanTrip user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-trips"
          element={isLoggedIn ? <MyTrips user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route
          path="/trip-details/:tripId"
          element={isLoggedIn ? <TripDetails user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
