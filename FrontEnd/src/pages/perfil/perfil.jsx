"use client"

import { Calendar, Plane } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "./Perfil.css"
import { getClientById } from "../../api/client"

export default function Perfil({ user, onLogout }) {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [profile, setProfile] = useState({ nome: user?.nome, email: user?.email })

  useEffect(() => {
    // Carrega viagens locais por usuário
    (async () => {
      const { getTrips } = await import("../../api/tripsLocal")
      setTrips(getTrips(user.id))
    })()
  }, [user])

  useEffect(() => {
    // Busca dados atualizados do cliente na API
    (async () => {
      try {
        const data = await getClientById(user.id)
        setProfile({ nome: data.nome, email: data.email })
      } catch (_) {
        // Mantém dados já conhecidos em caso de erro
      }
    })()
  }, [user])

  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const userProfile = {
    name: profile?.nome ? profile.nome : capitalize(user?.email?.split('@')[0]) || 'Usuário',
    email: profile?.email || user?.email || 'Não disponível',
    joinedDate: new Date().toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).split(' ').map(capitalize).join(' '),
    statistics: {
      tripsPlanned: trips.length,
      countriesVisited: new Set(trips.map(trip => trip.destination)).size,
      savedDestinations: trips.filter(trip => trip.status === 'saved').length,
    }
  }

  return (
    <div className="perfil-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">Viagem+</h1>
          <span 
            className="nav-logout" 
            onClick={() => {
              onLogout()
              navigate('/login')
            }}
          >
            Sair
          </span>
        </div>
      </nav>

      <div className="perfil-main">
        <button className="back-btn" onClick={() => navigate("/my-trips")}>
          ← Voltar
        </button>
        
        <div className="perfil-content-wrapper">
          <aside className="perfil-sidebar">
            <div className="perfil-avatar">
              <span role="img" aria-label="user">👤</span>
            </div>

            <div className="perfil-info">
              <div className="perfil-joined">
                <Calendar size={18} className="icon" />
                <span>Membro desde {userProfile.joinedDate}</span>
              </div>
              <a href={`mailto:${userProfile.email}`} className="perfil-email">
                {userProfile.email}
              </a>
            </div>

            <div className="perfil-stats">
              <div>
                <span>Viagens Planejadas</span>
                <span className="stat">{userProfile.statistics.tripsPlanned}</span>
              </div>
              <div>
                <span>Destinos Únicos</span>
                <span className="stat">{userProfile.statistics.countriesVisited}</span>
              </div>
              <div>
                <span>Viagens Salvas</span>
                <span className="stat">{userProfile.statistics.savedDestinations}</span>
              </div>
            </div>

            <div className="perfil-actions">
              <button 
                className="perfil-btn"
                onClick={() => navigate('/plan-trip')}
              >
                <Plane size={16} /> Nova Viagem
              </button>
            </div>
          </aside>

          <section className="perfil-content">
            <div className="perfil-header">
              <h1>{userProfile.name}</h1>
            </div>

            <div className="perfil-trips">
              <h2>Minhas Viagens</h2>
              {trips.length > 0 ? (
                <div className="trips-grid">
                  {trips.map(trip => (
                    <div 
                      key={trip.id} 
                      className="trip-card" 
                      onClick={() => navigate(`/trip-details/${trip.id}`)}
                    >
                      <h3>{trip.destination}</h3>
                      <p>{new Date(trip.startDate).toLocaleDateString('pt-BR')} — {new Date(trip.endDate).toLocaleDateString('pt-BR')}</p>
                      <span className={`trip-status ${trip.status || ''}`}>
                        {trip.status === 'saved' ? 'Salva' : 'Planejada'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-trips">
                  Você ainda não tem viagens planejadas. 
                  <button onClick={() => navigate('/plan-trip')}>Planejar primeira viagem</button>
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
