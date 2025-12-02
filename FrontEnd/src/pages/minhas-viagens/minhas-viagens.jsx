import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./minhas-viagens.css"

export default function MyTrips({ user, onLogout }) {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  // O estado 'editingId' e 'editData' e as funções 'handleEdit' e 'handleSaveEdit' foram removidos.

  const menuRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((s) => !s)

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

  useEffect(() => {
    loadTrips()
  }, [user])

  const loadTrips = () => {
    import("../../api/tripsLocal").then(({ getTrips }) => {
      setTrips(getTrips(user.id))
    })
  }

  // A função handleEdit foi removida.
  // A função handleSaveEdit foi removida.

  const handleDeleteTrip = (tripId) => {
    if (window.confirm("Tem certeza que deseja deletar esta viagem?")) {
      import("../../api/tripsLocal").then(({ deleteTrip }) => {
        deleteTrip(user.id, tripId)
        loadTrips()
      })
    }
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

          <div className="nav-links">
            <button className="nav-link-btn" onClick={() => navigate("/home")}>
              🏠 Home
            </button>
            <button className="nav-link-btn" onClick={() => navigate("/plan-trip")}>
              📝 Agendar Viagem
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
                  {/* Bloco de edição removido - apenas a visualização permanece */}
                  <>
                    {trip.image && (
                      <div style={{ 
                        width: '100%', 
                        height: '200px', 
                        overflow: 'hidden',
                        borderRadius: '8px 8px 0 0',
                        marginBottom: '15px'
                      }}>
                        <img 
                          src={trip.image} 
                          alt={trip.destination}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }}
                        />
                      </div>
                    )}
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
                      {/* Botão de Editar (edit-btn) removido */}
                      <button className="delete-btn" onClick={() => handleDeleteTrip(trip.id)}>
                        Deletar
                      </button>
                    </div>
                  </>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}