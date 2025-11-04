"use client"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import "./home.css"
import Footer from "../footer/footer"

export default function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Add capitalize function
  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // Get user's first name from email
  const userName = capitalize(user?.email?.split('@')[0]) || 'Usuário'

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">✈️ Viagem+</h1>

          {/* Ícone de usuário clean */}
          <div className="user-menu" ref={menuRef}>
            <button className="user-btn" onClick={toggleMenu}>
              <span role="img" aria-label="user">👤</span>
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
                  Ver Perfil
                </button>
                <button className="menu-item logout" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="home-main">
        <div className="home-header">
          <div className="header-content">
            <h2>Bem-vindo, {userName}!</h2>
            <p>Organize sua próxima aventura incrível</p>
          </div>
          <div className="header-emoji">🗺</div>
        </div>

        <div className="hero-section">
          <div className="hero-card">
            <h3>Planeje sua Viagem</h3>
            <p>Comece a organizar sua próxima aventura em apenas alguns cliques</p>
            <button
              className="hero-btn primary-btn"
              onClick={() => navigate("/plan-trip")}
            >
              Planejar Agora
            </button>
          </div>

          <div className="hero-card">
            <h3>Minhas Viagens</h3>
            <p>Visualize todas as suas viagens planejadas e edite conforme necessário</p>
            <button
              className="hero-btn secondary-btn"
              onClick={() => navigate("/my-trips")}
            >
              Ver Minhas Viagens
            </button>
          </div>
        </div>

        <div className="features-section">
          <h3>Por que usar o Viagem+?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>Controle de Gastos</h4>
              <p>Rastreie todos os seus gastos durante a viagem</p>
            </div>
            <div className="feature-card">
              <h4>Lista de Coisas</h4>
              <p>Nunca mais esqueça nada com sua lista personalizada</p>
            </div>
            <div className="feature-card">
              <h4>Fácil de Usar</h4>
              <p>Interface simples e intuitiva para todos</p>
            </div>
            <div className="feature-card">
              <h4>Editar a Qualquer Hora</h4>
              <p>Atualize seus planos a qualquer momento</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
