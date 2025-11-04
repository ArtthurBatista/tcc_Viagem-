"use client"
import { useNavigate } from "react-router-dom"
import "./home.css"
import Footer from "../footer/footer" 

export default function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const username = user?.email?.split("@")[0] ?? ""
  const displayName = username
    ? username.charAt(0).toUpperCase() + username.slice(1)
    : ""

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">✈️ Viagem+</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </nav>

      <main className="home-main">
        <div className="home-header">
          <div className="header-content">
            <h2>Bem-vindo, {displayName}!</h2>
            <p>Organize sua próxima aventura incrível</p>
          </div>
          <div className="header-emoji">🗺</div>
        </div>

        <div className="hero-section">
          <div className="hero-card">
            <div className="hero-icon"></div>
            <h3>Planeje sua Viagem</h3>
            <p>Comece a organizar sua próxima aventura em apenas alguns cliques</p>
            <button className="hero-btn primary-btn" onClick={() => navigate("/plan-trip")}>
              Planejar Agora
            </button>
          </div>

          <div className="hero-card">
            <div className="hero-icon"></div>
            <h3>Minhas Viagens</h3>
            <p>Visualize todas as suas viagens planejadas e edite conforme necessário</p>
            <button className="hero-btn secondary-btn" onClick={() => navigate("/my-trips")}>
              Ver Minhas Viagens
            </button>
          </div>
        </div>

        <div className="features-section">
          <h3>Por que usar o Viagem+?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Controle de Gastos</h4>
              <p>Rastreie todos os seus gastos durante a viagem</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Lista de Coisas</h4>
              <p>Nunca mais esqueça nada com sua lista personalizada</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h4>Fácil de Usar</h4>
              <p>Interface simples e intuitiva para todos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
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
