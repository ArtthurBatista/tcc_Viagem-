"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import "./detalhes-viagem.css"

export default function TripDetails({ user, onLogout }) {
  const navigate = useNavigate()
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [activeTab, setActiveTab] = useState("expenses")
  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "alimentação" })
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
            <div className="user-menu" ref={menuRef}>
              <button
                className={`user-btn ${isMenuOpen ? "open" : ""}`}
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                title="Abrir menu do usuário"
              >
                <span role="img" aria-label="user">👤</span> {userName}
              </button>

              {isMenuOpen && (
                <div className="menu-popup" role="menu">
                  <button
                    className="menu-item"
                    onClick={() => {
                      setIsMenuOpen(false)
                      navigate("/user-profile")
                    }}
                  >
                    Ver Perfil
                  </button>
                  <button
                    className="menu-item logout"
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleLogout()
                    }}
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="trip-details-main">
        <button className="back-btn" onClick={() => navigate("/my-trips")}>
          ← Voltar
        </button>

        <div className="trip-details-header">
          <div>
            <h2>{trip.name}</h2>
            <p className="destination">{trip.destination}</p>
          </div>
          <div className="trip-stats">
            <div className="stat">
              <span className="stat-label">Gastos Totais</span>
              <span className="stat-value">R$ {totalBudget.toFixed(2)}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Itens Preparados</span>
              <span className="stat-value">
                {packedCount}/{trip.packingList?.length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="trip-details-content">
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "expenses" ? "active" : ""}`}
              onClick={() => setActiveTab("expenses")}
            >
              Gastos ({trip.expenses?.length || 0})
            </button>
            <button
              className={`tab-btn ${activeTab === "packing" ? "active" : ""}`}
              onClick={() => setActiveTab("packing")}
            >
              Lista de Coisas ({trip.packingList?.length || 0})
            </button>
            <button className={`tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>
              Informações
            </button>
          </div>


          {activeTab === "expenses" && (
            <div className="tab-content">
              <div className="add-expense-form">
                <h3>Adicionar Gasto</h3>
                <div className="form-group">
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Descrição do gasto (ex: Hotel, Comida, Transporte)"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="number"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="Valor"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                      <option value="alimentação">Alimentação</option>
                      <option value="hospedagem">Hospedagem</option>
                      <option value="transporte">Transporte</option>
                      <option value="atividades">Atividades</option>
                      <option value="compras">Compras</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>
                <button className="add-btn" onClick={handleAddExpense}>
                  Adicionar Gasto
                </button>
              </div>

              {trip.expenses && trip.expenses.length > 0 ? (
                <div className="expenses-list">
                  <h3>Resumo de Gastos</h3>
                  <div className="expense-categories">
                    {Array.from(new Set(trip.expenses.map((e) => e.category))).map((category) => {
                      const categoryTotal = trip.expenses
                        .filter((e) => e.category === category)
                        .reduce((sum, e) => sum + e.amount, 0)
                      return (
                        <div key={category} className="category-summary">
                          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                          <span className="category-total">R$ {categoryTotal.toFixed(2)}</span>
                        </div>
                      )
                    })}
                  </div>

                  <h3 style={{ marginTop: "30px" }}>Todos os Gastos</h3>
                  <div className="expenses-table">
                    {trip.expenses.map((expense) => (
                      <div key={expense.id} className="expense-item">
                        <div className="expense-info">
                          <span className="expense-category-badge">{expense.category}</span>
                          <div>
                            <p className="expense-description">{expense.description}</p>
                            <span className="expense-amount">R$ {expense.amount.toFixed(2)}</span>
                          </div>
                        </div>
                        <button className="delete-expense-btn" onClick={() => handleDeleteExpense(expense.id)}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-message">
                  <p>Nenhum gasto registrado ainda</p>
                </div>
              )}
            </div>
          )}


          {activeTab === "packing" && (
            <div className="tab-content">
              <div className="add-packing-form">
                <h3>Adicionar Item à Lista</h3>
                <div className="form-group">
                  <input
                    type="text"
                    value={newPackingItem}
                    onChange={(e) => setNewPackingItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddPackingItem()}
                    placeholder="Ex: Passaporte, Mala, Protetor Solar..."
                  />
                </div>
                <button className="add-btn" onClick={handleAddPackingItem}>
                  Adicionar Item
                </button>
              </div>

              {trip.packingList && trip.packingList.length > 0 ? (
                <div className="packing-list">
                  <h3>Minha Lista de Coisas</h3>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(packedCount / trip.packingList.length) * 100}%` }}
                    />
                  </div>
                  <p className="progress-text">
                    {packedCount} de {trip.packingList.length} itens preparados
                  </p>

                  <div className="packing-items">
                    {trip.packingList.map((item) => (
                      <div key={item.id} className={`packing-item ${item.packed ? "packed" : ""}`}>
                        <input
                          type="checkbox"
                          checked={item.packed}
                          onChange={() => handleTogglePackingItem(item.id)}
                          className="packing-checkbox"
                        />
                        <span className="packing-text">{item.text}</span>
                        <button className="delete-packing-btn" onClick={() => handleDeletePackingItem(item.id)}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-message">
                  <p>Nenhum item na sua lista ainda</p>
                </div>
              )}
            </div>
          )}


          {activeTab === "info" && (
            <div className="tab-content">
              <div className="trip-info-section">
                <div className="info-card">
                  <h3> Destino</h3>
                  <p>{trip.destination}</p>
                </div>

                <div className="info-card">
                  <h3> Datas</h3>
                  <p>
                    Início:{" "}
                    {new Date(trip.startDate).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    Fim:{" "}
                    {new Date(trip.endDate).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="info-card">
                  <h3> Duração</h3>
                  <p>{Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} dias</p>
                </div>

                {trip.description && (
                  <div className="info-card">
                    <h3> Descrição</h3>
                    <p>{trip.description}</p>
                  </div>
                )}

                <div className="info-card">
                  <h3> Orçamento Total</h3>
                  <p className="budget-text">R$ {totalBudget.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}