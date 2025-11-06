"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Home, Plane, UserCircle, MapPin, Calendar, DollarSign, Package, ChevronDown } from "lucide-react"

export default function PlanTrip({ user, onLogout }) {
  const navigate = useNavigate()
  const [tripName, setTripName] = useState("")
  const [destination, setDestination] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Ref e estado do menu de usuário
  const menuRef = useRef(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // Lógica para fechar o menu ao clicar fora ou pressionar ESC
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
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validação
    if (!tripName || !destination || !startDate || !endDate) {
      setError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setError("A data de término deve ser posterior à data de início")
      return
    }

    const newTrip = {
      id: Date.now(), // ID temporário, será gerado pelo seu backend
      name: tripName,
      destination,
      startDate,
      endDate,
      description,
      createdAt: new Date().toISOString(),
      // status: 'planned' ou 'draft' - adicione conforme a lógica do seu backend
    }

    // --- REMOVIDA LÓGICA DE LOCALSTORAGE ---
    // Simula o envio bem-sucedido para a API/Backend
    console.log("Viagem criada com sucesso. Objeto pronto para envio:", newTrip)
    
    // Limpa o formulário e exibe sucesso
    setTripName("")
    setDestination("")
    setStartDate("")
    setEndDate("")
    setDescription("")

    setSuccess("Viagem criada com sucesso! Redirecionando...")
    setTimeout(() => {
      navigate("/my-trips")
    }, 1500)
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Estilos para o menu popup e inputs */}
      <style>{`
        /* Estilos base para campos de formulário */
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db; /* gray-300 */
            border-radius: 0.5rem; /* rounded-lg */
            font-size: 1rem;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
            border-color: #4f46e5; /* indigo-600 */
            outline: none;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }
        /* Estilos do menu suspenso do usuário */
        .menu-popup {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background-color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          padding: 0.5rem 0;
          width: 160px;
          z-index: 20;
          border: 1px solid #e5e7eb;
        }
        .menu-item {
          width: 100%;
          padding: 0.5rem 1rem;
          text-align: left;
          font-size: 0.9rem;
          color: #374151; /* gray-700 */
          background-color: white;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .menu-item:hover {
          background-color: #f3f4f6; /* gray-100 */
        }
        .menu-item.logout {
          color: #dc2626; /* red-600 */
          border-top: 1px solid #f3f4f6;
          margin-top: 0.25rem;
          padding-top: 0.75rem;
        }
      `}</style>

      {/* Barra de Navegação */}
      <nav className="bg-white shadow-md w-full h-16 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">Viagem+</h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-indigo-600 transition-colors p-2 hidden sm:flex items-center gap-1 font-medium" onClick={() => navigate("/home")}>
              <Home size={18} /> Home
            </button>
            <button className="text-gray-600 hover:text-indigo-600 transition-colors p-2 flex items-center gap-1 font-medium" onClick={() => navigate("/my-trips")}>
              <Plane size={18} /> Minhas Viagens
            </button>
            
            {/* Menu de Usuário */}
            <div className="relative" ref={menuRef}>
              <button
                className={`flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors border-2 ${isMenuOpen ? "bg-indigo-700 border-indigo-700" : "bg-indigo-600 border-indigo-600 hover:bg-indigo-700"}`}
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                title="Abrir menu do usuário"
              >
                <UserCircle size={24} />
              </button>

              {isMenuOpen && (
                <div className="menu-popup" role="menu">
                  <button
                    className="menu-item flex items-center gap-2"
                    onClick={() => {
                      setIsMenuOpen(false)
                      navigate("/user-profile")
                    }}
                  >
                    <UserCircle size={16} /> Ver Perfil
                  </button>
                  <button className="menu-item logout flex items-center gap-2" onClick={handleLogout}>
                    <Plane size={16} className="-rotate-90" /> Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
        
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center gap-3">
            <Plane className="text-indigo-600" size={36} /> Planejar Nova Viagem
        </h1>
        <p className="text-gray-500 mb-8">Preencha os detalhes da sua próxima aventura. Os dados serão salvos quando você conectar seu backend.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
          {/* Formulário de Criação de Viagem */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="form-group">
                  <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 mb-1">Nome da Viagem *</label>
                  <input
                    id="tripName"
                    type="text"
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="Ex: Férias no Rio"
                    className="placeholder:text-gray-400"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">Destino *</label>
                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ex: Rio de Janeiro, Brasil"
                    className="placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
                  <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Término *</label>
                  <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descrição (Opcional)</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Adicione notas sobre sua viagem, o que espera fazer, etc."
                  rows="4"
                  className="placeholder:text-gray-400"
                />
              </div>

              {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">{error}</div>}
              {success && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">{success}</div>}

              <button type="submit" className="w-full p-3 mt-4 bg-indigo-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/50">
                <Plane size={20} /> Criar Viagem
              </button>
            </form>
          </div>

          {/* Dicas de Planejamento */}
          <div className="lg:col-span-1 bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100 h-fit">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Dicas para Planejar</h3>
            <ul className="space-y-4">
              {[
                { icon: MapPin, title: 'Escolha seu destino', description: 'Pense em lugares que você sempre quis visitar.' },
                { icon: Calendar, title: 'Defina as datas', description: 'Escolha a melhor época para visitar e verifique a disponibilidade.' },
                { icon: DollarSign, title: 'Defina orçamento', description: 'Saiba quanto pretende gastar em passagens, hospedagem e atividades.' },
                { icon: Package, title: 'Crie lista de coisas', description: 'Nunca mais esqueça o que levar ao montar sua lista de bagagem.' }
              ].map((tip, index) => (
                <li key={index} className="flex gap-4 items-start p-3 bg-indigo-50/50 rounded-lg">
                  <div className="p-2 bg-indigo-100 rounded-full text-indigo-600 flex-shrink-0">
                    <tip.icon size={20} />
                  </div>
                  <div>
                    <strong className="text-gray-800 text-base">{tip.title}</strong>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}