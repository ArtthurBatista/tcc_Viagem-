"use client"

import { Calendar, Plane, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

// Dados de Viagens Simulados (Mock Data)
// ESTA É A PARTE QUE VOCÊ DEVE SUBSTITUIR POR UMA CHAMADA À SUA API/BANCO DE DADOS FUTURAMENTE.
const MOCK_TRIPS = [
  { id: 't1', destination: 'Tóquio, Japão', startDate: '2024-11-01', endDate: '2024-11-10', status: 'planned' },
  { id: 't2', destination: 'Paris, França', startDate: '2025-05-15', endDate: '2025-05-25', status: 'saved' },
  { id: 't3', destination: 'Rio de Janeiro, Brasil', startDate: '2023-12-20', endDate: '2024-01-05', status: 'planned' },
  { id: 't4', destination: 'Nova York, EUA', startDate: '2025-10-01', endDate: '2025-10-07', status: 'saved' },
];

// Utility to capitalize strings
const capitalize = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export default function Perfil({ user, onLogout }) {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect para simular a busca de dados de uma API (agora com mock data)
  useEffect(() => {
    setLoading(true);
    // Simula um delay de rede (300ms)
    const timer = setTimeout(() => {
      // No futuro, você substituirá esta linha:
      setTrips(MOCK_TRIPS); 
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [user]);

  const userProfile = {
    // Usa o email do usuário como fonte principal para o nome
    name: capitalize(user?.email?.split('@')[0]) || 'Usuário',
    email: user?.email || 'Não disponível',
    // Data de adesão mockada (apenas para exibição)
    joinedDate: new Date('2023-08-15').toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    }).split(' ').map(capitalize).join(' '),
    statistics: {
      tripsPlanned: trips.filter(trip => trip.status === 'planned').length,
      // Conta destinos únicos
      countriesVisited: new Set(trips.map(trip => trip.destination)).size,
      savedDestinations: trips.filter(trip => trip.status === 'saved').length,
    }
  }

  const statusMap = {
    'saved': { text: 'Salva', bg: 'bg-yellow-100', color: 'text-yellow-700' },
    'planned': { text: 'Planejada', bg: 'bg-indigo-100', color: 'text-indigo-700' },
    // Default status if missing
    'default': { text: 'Rascunho', bg: 'bg-gray-100', color: 'text-gray-500' },
  };

  const getStatusProps = (status) => statusMap[status] || statusMap.default;

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Estilos customizados para elementos específicos e responsividade */}
      <style>{`
        .navbar-content {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 1rem;
          padding-right: 1rem;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .back-btn {
          color: #4f46e5;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .back-btn:hover {
          transform: translateX(-4px);
        }
        .trip-card {
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .trip-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
        @media (min-width: 768px) {
          .perfil-main {
            padding-top: 64px; /* Compensate for fixed navbar */
          }
        }
      `}</style>


      {/* Barra de Navegação */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-10 h-16">
        <div className="navbar-content">
          <h1 className="text-2xl font-bold text-indigo-700">Viagem+</h1>
          <span 
            className="text-gray-600 cursor-pointer font-medium hover:text-red-500 transition-colors" 
            onClick={handleLogout}
          >
            Sair
          </span>
        </div>
      </nav>

      <div className="perfil-main flex-grow pt-24 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <button 
          className="back-btn flex items-center gap-1 text-lg text-indigo-600 hover:text-indigo-800 mb-6" 
          onClick={() => navigate("/my-trips")}
        >
          <span className="text-xl">←</span> Voltar
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar - Informações do Perfil e Estatísticas */}
          <aside className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-xl h-fit border border-gray-100">
            <div className="text-center pb-4">
              <div className="mx-auto w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 mb-4">
                <User size={40} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1 truncate">{userProfile.name}</h2>
              <a href={`mailto:${userProfile.email}`} className="text-sm text-gray-500 hover:underline break-all">
                {userProfile.email}
              </a>
            </div>

            <div className="border-t pt-4 mt-4 border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Calendar size={18} className="text-indigo-500" />
                <span>Membro desde {userProfile.joinedDate}</span>
              </div>

              <div className="text-gray-700">
                <h3 className="text-lg font-semibold mb-2 border-b pb-2">Estatísticas</h3>
                {Object.entries(userProfile.statistics).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1.5 border-b last:border-b-0 border-gray-100">
                        <span className="text-sm">
                            {key === 'tripsPlanned' && 'Viagens Planejadas'}
                            {key === 'countriesVisited' && 'Destinos Únicos'}
                            {key === 'savedDestinations' && 'Viagens Salvas'}
                        </span>
                        <span className="font-bold text-indigo-600">{value}</span>
                    </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <button 
                className="w-full p-3 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                onClick={() => navigate('/plan-trip')}
              >
                <Plane size={16} /> Planejar Nova Viagem
              </button>
            </div>
          </aside>

          {/* Conteúdo Principal - Lista de Viagens */}
          <section className="w-full md:w-3/4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Suas Viagens</h1>

            <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Minhas Viagens Planejadas/Salvas</h2>
              
              {loading ? (
                <div className="text-center p-8 text-gray-500">
                  <Plane className="animate-pulse mx-auto mb-3" size={32} />
                  <p>Carregando viagens...</p>
                </div>
              ) : trips.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trips.map(trip => {
                    const statusProps = getStatusProps(trip.status);
                    return (
                      <div 
                        key={trip.id} 
                        className="trip-card bg-white p-4 rounded-lg border border-gray-200 cursor-pointer flex flex-col justify-between hover:border-indigo-400" 
                        onClick={() => navigate(`/trip-details/${trip.id}`)}
                      >
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{trip.destination || 'Destino Desconhecido'}</h3>
                          <p className="text-xs text-gray-500 mb-3">
                            {new Date(trip.startDate).toLocaleDateString('pt-BR')} — {new Date(trip.endDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div>
                          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${statusProps.bg} ${statusProps.color}`}>
                            {statusProps.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 text-center">
                  <p className="text-gray-600 mb-4">
                    Você ainda não tem viagens planejadas ou salvas.
                  </p>
                  <button 
                    className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                    onClick={() => navigate('/plan-trip')}
                  >
                    Planejar primeira viagem →
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}