"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Footer from "../footer/footer"
import "./detalhes-viagem.css"

export default function TripDetails({ user, onLogout }) {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [activeTab, setActiveTab] = useState("gastos")
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "" })
  const [newPackingItem, setNewPackingItem] = useState("")
  const [editingExpenseId, setEditingExpenseId] = useState(null)
  
  // ⭐️ CORREÇÃO: Variáveis de estado e referência para o menu
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // ⭐️ CORREÇÃO: Função para abrir/fechar o menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // Efeito para carregar a viagem
  useEffect(() => {
    loadTrip()
  }, [tripId])

  // ⭐️ CORREÇÃO: Efeito para fechar o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  const loadTrip = () => {
    import("../../api/tripsLocal").then(({ getTrip }) => {
      const found = getTrip(user.id, tripId)
      if (found) setTrip(found)
    })
  }

  const saveTrip = (updatedTrip) => {
    import("../../api/tripsLocal").then(({ updateTrip }) => {
      updateTrip(user.id, updatedTrip)
      setTrip(updatedTrip)
    })
  }

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: Number.parseFloat(newExpense.amount),
    }

    const updatedTrip = {
      ...trip,
      expenses: [...(trip.expenses || []), expense],
    }

    saveTrip(updatedTrip)
    setNewExpense({ description: "", amount: "", category: "alimentação" })
  }

  const handleDeleteExpense = (expenseId) => {
    const updatedTrip = {
      ...trip,
      expenses: trip.expenses.filter((exp) => exp.id !== expenseId),
    }
    saveTrip(updatedTrip)
  }

  const handleAddPackingItem = () => {
    if (!newPackingItem.trim()) {
      alert("Por favor, escreva um item")
      return
    }

    const item = {
      id: Date.now(),
      text: newPackingItem,
      packed: false,
    }

    const updatedTrip = {
      ...trip,
      packingList: [...(trip.packingList || []), item],
    }

    saveTrip(updatedTrip)
    setNewPackingItem("")
  }

  const handleTogglePackingItem = (itemId) => {
    const updatedTrip = {
      ...trip,
      packingList: trip.packingList.map((item) => (item.id === itemId ? { ...item, packed: !item.packed } : item)),
    }
    saveTrip(updatedTrip)
  }

  const handleDeletePackingItem = (itemId) => {
    const updatedTrip = {
      ...trip,
      packingList: trip.packingList.filter((item) => item.id !== itemId),
    }
    saveTrip(updatedTrip)
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const userName = capitalize(user?.email?.split('@')[0]) || 'Usuário'

  if (!trip) {
    return (
      <div className="loading-container">
        <p>Carregando...</p>
      </div>
    )
  }

  const totalBudget = trip.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
  const packedCount = trip.packingList?.filter((item) => item.packed).length || 0

  return (
    <div className="trip-details-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">✈️ Viagem+</h1>

          <div className="nav-links">
            <button className="nav-link-btn" onClick={() => navigate("/home")}>
              🏠 Home
            </button>
            <button className="nav-link-btn" onClick={() => navigate("/my-trips")}>
              ✈️ Minhas Viagens
            </button>
          </div>

          <div className="user-menu" ref={menuRef}>
            <button className="user-btn" onClick={toggleMenu}>
              <span role="img" aria-label="user">👤</span> {userName}
            </button>

            {isMenuOpen && (
              <div className="menu-popup">
                <button
                  className="menu-item"
                  onClick={() => {
                    setIsMenuOpen(false)
                    navigate("/user-profile")
                  }}
                >
                  👤 Ver Perfil
                </button>
                <button className="menu-item logout" onClick={handleLogout}>
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Header with mountain background */}
      <div className="hero-header">
        <img src="/montanha.png" alt="Mountain background" className="hero-background-image" />
        <div className="hero-overlay"></div>
        
        {/* Budget and Items display on hero */}
        <div className="hero-stats">
          <div className="hero-stat-item">
            <div className="stat-label">Orçamento</div>
            <div className="stat-value">R$ {totalBudget.toFixed(2)}</div>
          </div>
          <div className="hero-stat-item">
            <div className="stat-label">Itens</div>
            <div className="stat-value">
              {packedCount}/{trip.packingList?.length || 0}
            </div>
          </div>
        </div>
      </div>

      <main className="trip-details-main">
        {/* Tab Content */}
        <div className="tab-content-area">
          {/* Gastos Tab */}
          {activeTab === "gastos" && (
            <>
              {/* Add Expense Section */}
              <div className="add-expense-section">
                <h2 className="section-title">Adicionar Gasto</h2>
                <div className="expense-form">
                  <input
                    type="text"
                    className="input-field full-width"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Descrição do gasto (ex: Hotel, Comida, Transporte)"
                  />
                  <div className="form-row-grid">
                    <input
                      type="number"
                      className="input-field"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="Valor"
                      step="0.01"
                    />
                    <input
                      type="text"
                      className="input-field"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      placeholder="Alimentação"
                    />
                  </div>
                  <button className="add-button" onClick={handleAddExpense}>
                    Adicionar Gasto
                  </button>
                </div>
              </div>

              {/* Expenses list or Empty state */}
              {trip.expenses && trip.expenses.length > 0 ? (
                <div className="expenses-list">
                  {trip.expenses.map((expense) => (
                    <div key={expense.id} className="expense-card">
                  <div className="expense-details">
                    <div className="expense-title">{expense.description}</div>
                    <div className="expense-category">{expense.category}</div>
                  </div>
                  <div className="expense-amount">R$ {expense.amount.toFixed(2)}</div>
                </div>
              ))}
            </div>
              ) : (
                <div className="empty-state">
                  <p>Nenhum Gasto registrado ainda</p>
                </div>
              )}
            </>
          )}

          {/* Itens Tab */}
          {activeTab === "itens" && (
            <div className="items-section">
              <div className="add-item-section">
                <h3 className="subsection-title">Adicionar Item à Lista</h3>
                <div className="item-form-single">
                  <input
                    type="text"
                    className="input-field full-width"
                    value={newPackingItem}
                    onChange={(e) => setNewPackingItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddPackingItem()}
                    placeholder="Ex: Passaporte, Mala, Protetor Solar..."
                  />
                  <button className="add-button" onClick={handleAddPackingItem}>
                    Adicionar Item
                  </button>
                </div>
              </div>

              {trip.packingList && trip.packingList.length > 0 ? (
                <div className="packing-items-list">
                  {trip.packingList.map((item) => (
                    <div key={item.id} className="packing-item-card">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={item.packed}
                          onChange={() => handleTogglePackingItem(item.id)}
                          className="checkbox-input"
                        />
                        <span className={item.packed ? "item-text packed" : "item-text"}>{item.text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="info-section-new">
              <div className="info-box">
                <h3 className="info-box-title">Destino</h3>
                <p className="info-box-content">{trip.destination}</p>
              </div>

              <div className="info-box">
                <h3 className="info-box-title">Datas</h3>
                <p className="info-box-content">
                  Início: {new Date(trip.startDate).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="info-box-content">
                  Fim: {new Date(trip.endDate).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="info-box">
                <h3 className="info-box-title">Duração</h3>
                <p className="info-box-content">
                  {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} dias
                </p>
              </div>

              <div className="info-box">
                <h3 className="info-box-title">Orçamento Total</h3>
                <p className="info-box-content-highlight">R$ {totalBudget.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Tabs Navigation */}
      <div className="footer-tabs">
        <div className="tabs-nav-footer">
          <button
            className={`tab-button-footer ${activeTab === "gastos" ? "active" : ""}`}
            onClick={() => setActiveTab("gastos")}
          >
            Gastos
          </button>
          <button
            className={`tab-button-footer ${activeTab === "itens" ? "active" : ""}`}
            onClick={() => setActiveTab("itens")}
          >
            Itens
          </button>
          <button
            className={`tab-button-footer ${activeTab === "info" ? "active" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}