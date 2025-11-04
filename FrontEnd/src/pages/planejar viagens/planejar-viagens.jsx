"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./planejar-viagens.css"

export default function PlanTrip({ user, onLogout }) {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState("")
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!tripName || !destination || !startDate || !endDate) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("A data de término deve ser posterior à data de início")
      return
    }

    
    const newTrip = {
      id: Date.now(),
      name: tripName,
      destination,
      startDate,
      endDate,
      description,
      expenses: [],
      packingList: [],
      createdAt: new Date().toISOString(),
    }

    
    const users = JSON.parse(localStorage.getItem("users")) || []
    const userIndex = users.findIndex((u) => u.id === user.id)

    if (userIndex !== -1) {
      if (!users[userIndex].trips) {
        users[userIndex].trips = []
      }
      users[userIndex].trips.push(newTrip)
      localStorage.setItem("users", JSON.stringify(users))

      
      localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
    }

    setSuccess("Viagem criada com sucesso!")
    setTimeout(() => {
      navigate("/my-trips")
    }, 1500)
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  return (
    <div className="plan-trip-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">✈️ Viagem+</h1>
          <div className="nav-actions">
            <button className="nav-btn" onClick={() => navigate("/home")}>
              Home
            </button>
            <button className="nav-btn" onClick={() => navigate("/my-trips")}>
              Minhas Viagens
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="plan-trip-main">
        <div className="plan-trip-header">
          <h2>Planejar Nova Viagem</h2>
          <p>Preencha os detalhes da sua próxima aventura</p>
        </div>

        <div className="plan-trip-content">
          <form onSubmit={handleSubmit} className="trip-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tripName">Nome da Viagem *</label>
                <input
                  id="tripName"
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Ex: Férias no Rio"
                />
              </div>

              <div className="form-group">
                <label htmlFor="destination">Destino *</label>
                <input
                  id="destination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: Rio de Janeiro, Brasil"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Data de Início *</label>
                <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">Data de Término *</label>
                <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição (Opcional)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Adicione notas sobre sua viagem..."
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="submit-btn">
              Criar Viagem
            </button>
          </form>

          <div className="plan-trip-tips">
            <h3>Dicas para Planejar sua Viagem</h3>
            <ul>
              <li>
                <span className="tip-icon">📍</span>
                <div>
                  <strong>Escolha seu destino</strong>
                  <p>Pense em lugares que você sempre quis visitar</p>
                </div>
              </li>
              <li>
                <span className="tip-icon">📅</span>
                <div>
                  <strong>Defina as datas</strong>
                  <p>Escolha a melhor época para visitar</p>
                </div>
              </li>
              <li>
                <span className="tip-icon">💰</span>
                <div>
                  <strong>Defina orçamento</strong>
                  <p>Saiba quanto pretende gastar</p>
                </div>
              </li>
              <li>
                <span className="tip-icon">📦</span>
                <div>
                  <strong>Crie lista de coisas</strong>
                  <p>Nunca mais esqueça o que levar</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
