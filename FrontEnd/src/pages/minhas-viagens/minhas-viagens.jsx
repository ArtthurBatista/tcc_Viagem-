"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./minhas-viagens.css"

export default function MyTrips({ user, onLogout }) {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    loadTrips()
  }, [user])

  const loadTrips = () => {
    const users = JSON.parse(localStorage.getItem("users")) || []
    const currentUser = users.find((u) => u.id === user.id)
    if (currentUser && currentUser.trips) {
      setTrips(currentUser.trips)
    }
  }

  const handleEdit = (trip) => {
    setEditingId(trip.id)
    setEditData({ ...trip })
  }

  const handleSaveEdit = (tripId) => {
    const users = JSON.parse(localStorage.getItem("users")) || []
    const userIndex = users.findIndex((u) => u.id === user.id)

    if (userIndex !== -1) {
      const tripIndex = users[userIndex].trips.findIndex((t) => t.id === tripId)
      if (tripIndex !== -1) {
        users[userIndex].trips[tripIndex] = editData
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
        loadTrips()
        setEditingId(null)
      }
    }
  }

  const handleDeleteTrip = (tripId) => {
    if (window.confirm("Tem certeza que deseja deletar esta viagem?")) {
      const users = JSON.parse(localStorage.getItem("users")) || []
      const userIndex = users.findIndex((u) => u.id === user.id)

      if (userIndex !== -1) {
        users[userIndex].trips = users[userIndex].trips.filter((t) => t.id !== tripId)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(users[userIndex]))
        loadTrips()
      }
    }
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })
  }

  const calculateBudget = (trip) => {
    return trip.expenses?.reduce((sum, exp) => sum + Number.parseFloat(exp.amount || 0), 0) || 0
  }

  return (
    <div className="my-trips-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">✈️ Viagem+</h1>
          <div className="nav-actions">
            <button className="nav-btn" onClick={() => navigate("/home")}>
              Home
            </button>
            <button className="nav-btn" onClick={() => navigate("/plan-trip")}>
              Planejar Viagem
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="my-trips-main">
        <div className="trips-header">
          <h2>Minhas Viagens</h2>
          <button className="new-trip-btn" onClick={() => navigate("/plan-trip")}>
            + Nova Viagem
          </button>
        </div>

        <div className="trips-content">
          {trips.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Nenhuma viagem planejada ainda</h3>
              <p>Comece agora criando sua primeira viagem incível</p>
              <button className="empty-btn" onClick={() => navigate("/plan-trip")}>
                Criar Primeira Viagem
              </button>
            </div>
          ) : (
            <div className="trips-grid">
              {trips.map((trip) => (
                <div key={trip.id} className="trip-card">
                  {editingId === trip.id ? (
                    <div className="trip-edit-form">
                      <div className="edit-row">
                        <input
                          type="text"
                          value={editData.name}
                          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          placeholder="Nome da viagem"
                          className="edit-input"
                        />
                        <input
                          type="text"
                          value={editData.destination}
                          onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
                          placeholder="Destino"
                          className="edit-input"
                        />
                      </div>
                      <div className="edit-row">
                        <input
                          type="date"
                          value={editData.startDate}
                          onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
                          className="edit-input"
                        />
                        <input
                          type="date"
                          value={editData.endDate}
                          onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
                          className="edit-input"
                        />
                      </div>
                      <div className="edit-buttons">
                        <button className="save-btn" onClick={() => handleSaveEdit(trip.id)}>
                          Salvar
                        </button>
                        <button className="cancel-btn" onClick={() => setEditingId(null)}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="trip-header-card">
                        <h3>{trip.name}</h3>
                        <span className="destination-badge">{trip.destination}</span>
                      </div>

                      <div className="trip-info">
                        <div className="info-item">
                          <span className="info-label">Período:</span>
                          <span className="info-value">
                            {formatDate(trip.startDate)} a {formatDate(trip.endDate)}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Orçamento:</span>
                          <span className="info-value budget">R$ {calculateBudget(trip).toFixed(2)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Itens:</span>
                          <span className="info-value">{trip.packingList?.length || 0} items</span>
                        </div>
                      </div>

                      {trip.description && <p className="trip-description">{trip.description}</p>}

                      <div className="trip-actions">
                        <button className="details-btn" onClick={() => navigate(`/trip-details/${trip.id}`)}>
                          Ver Detalhes
                        </button>
                        <button className="edit-btn" onClick={() => handleEdit(trip)}>
                          Editar
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteTrip(trip.id)}>
                          Deletar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
