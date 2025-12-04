"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { searchImage } from "../../api/images"
import "./planejar-viagens.css"
import ChatWidget from "../../components/ChatWidget/ChatWidget"

export default function PlanTrip({ user, onLogout }) {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState("")
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // novo: ref e estado do menu de usuário
  const menuRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }

    function handleEsc(e) {
      if (e.key === "Escape") setIsMenuOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const handleSubmit = async (e) => {
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

    // Buscar imagem para o destino antes de salvar
    let tripImage = null;
    try {
      tripImage = await searchImage(destination);
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
    }

    const newTrip = {
      id: Date.now(),
      name: tripName,
      destination,
      startDate,
      endDate,
      description,
      image: tripImage || null,
      expenses: [],
      packingList: [],
      createdAt: new Date().toISOString(),
    }

    // Persistência local por usuário
    import("../../api/tripsLocal").then(({ addTrip }) => {
      addTrip(user.id, newTrip)
      setSuccess("Viagem criada com sucesso!")
      setTimeout(() => {
        navigate("/my-trips")
      }, 1200)
    }).catch(() => {
      setError("Falha ao salvar viagem localmente")
    })
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

  return (
    <div className="plan-trip-container">
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
      <ChatWidget />
    </div>
  )
}
