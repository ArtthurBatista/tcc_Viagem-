"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./minhas-viagens.css"

// >>> ATENÇÃO: Você precisa implementar as seguintes funções de API! <<<
// Elas devem buscar e persistir os dados da viagem no seu backend.

// Função Fictícia para carregar viagens do Backend
async function apiLoadTrips(userId) {
  // Substitua este bloco pela sua chamada HTTP real (ex: fetch, axios)
  console.log(`API: Buscando viagens para o usuário ${userId}...`);

  // Simulação de retorno de dados (Para Testes)
  return [
    {
      id: 1,
      name: "Férias na Praia",
      destination: "Fernando de Noronha",
      startDate: new Date(2026, 0, 10).toISOString(),
      endDate: new Date(2026, 0, 20).toISOString(),
      description: "Dez dias de sol e mergulho.",
      expenses: [{ amount: 4500 }], // Exemplo simplificado para cálculo
      packingList: [{ text: "Biquíni", packed: true }],
    },
    {
      id: 2,
      name: "Trilha de Inverno",
      destination: "Serra da Mantiqueira",
      startDate: new Date(2025, 7, 5).toISOString(),
      endDate: new Date(2025, 7, 12).toISOString(),
      description: "Sete dias de acampamento e frio.",
      expenses: [{ amount: 800 }],
      packingList: [{ text: "Anorak", packed: false }],
    },
  ];
}

// Função Fictícia para deletar uma viagem no Backend
async function apiDeleteTrip(userId, tripId) {
  // Substitua este bloco pela sua chamada HTTP real (ex: fetch, axios)
  console.log(`API: Deletando viagem ${tripId} para o usuário ${userId}...`);
  // O backend deve retornar um sucesso ou um erro.
  return { success: true };
}

// ----------------------------------------------------------------------

export default function MyTrips({ user, onLogout }) {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [isLoading, setIsLoading] = useState(true) // Novo estado para controle de loading

  const menuRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((s) => !s)

  // Efeito para fechar o menu ao clicar fora/ESC
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

  // Efeito para carregar as viagens (agora assíncrono)
  useEffect(() => {
    loadTrips()
  }, [user])

  const loadTrips = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userTrips = await apiLoadTrips(user.id);
      setTrips(userTrips);
    } catch (error) {
      console.error("Erro ao carregar viagens:", error);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm("Tem certeza que deseja deletar esta viagem?")) {
      setIsLoading(true);
      try {
        await apiDeleteTrip(user.id, tripId);
        // Se a exclusão for bem-sucedida, recarrega a lista
        await loadTrips();
      } catch (error) {
        console.error("Erro ao deletar viagem:", error);
        alert("Não foi possível deletar a viagem. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleLogout = () => {
    // A função onLogout() deve ser responsável por limpar o estado do usuário
    // e remover qualquer token ou dado de sessão armazenado (não no localStorage, mas sim em cookies/sessão HTTP).
    onLogout()
    navigate("/login")
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })
  }

  const calculateBudget = (trip) => {
    // Calcula o total de gastos
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

            <div className="user-menu" ref={menuRef}>
              <button
                className={`user-btn ${isMenuOpen ? "open" : ""}`}
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                title="Abrir menu do usuário"
              >
                <span role="img" aria-label="user">👤</span>
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

      <main className="my-trips-main">
        <div className="trips-header">
          <h2>Minhas Viagens</h2>
          <button className="new-trip-btn" onClick={() => navigate("/plan-trip")} disabled={isLoading}>
            + Nova Viagem
          </button>
        </div>

        {isLoading && (
          <div className="loading-state">
            <p>Carregando suas viagens...</p>
          </div>
        )}

        {!isLoading && (
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
                          <span className="info-label">Gastos Totais:</span>
                          <span className="info-value budget">R$ {calculateBudget(trip).toFixed(2)}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Itens na Lista:</span>
                          <span className="info-value">{trip.packingList?.length || 0} items</span>
                        </div>
                      </div>

                      {trip.description && <p className="trip-description">{trip.description}</p>}

                      <div className="trip-actions">
                        <button className="details-btn" onClick={() => navigate(`/trip-details/${trip.id}`)} disabled={isLoading}>
                          Ver Detalhes
                        </button>
                        <button className="delete-btn" onClick={() => handleDeleteTrip(trip.id)} disabled={isLoading}>
                          Deletar
                        </button>
                      </div>
                    </>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}