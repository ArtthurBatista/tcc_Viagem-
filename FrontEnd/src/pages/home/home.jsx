"use client"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import "./home.css"
import Footer from "../footer/footer"

const popularDestinations = [
  {
    id: 1,
    name: "Ilhas Gregas",
    location: "Santorini, Grécia",
    description: "Casas brancas com cúpulas azuis e pôr do sol inesquecíveis sobre o Mar Egeu",
    image: "/images/santorini.jpg",
  },
  {
    id: 2,
    name: "Alpes Suíços",
    location: "Suíça",
    description: "Montanhas majestosas, trilhas alpinas e paisagens de tirar o fôlego",
    image: "/images/swiss_alps.jpg",
  },
  {
    id: 3,
    name: "Cidade Vibrante",
    location: "Tóquio, Japão",
    description: "Luzes neon, tecnologia de ponta e cultura milenar em harmonia",
    image: "/images/tokyo.jpg",
  },
  {
    id: 4,
    name: "Refúgio Tropical",
    location: "Bali, Indonésia",
    description: "Terraços de arroz verde-esmeralda e templos sagrados na ilha dos deuses",
    image: "/images/bali.jpg",
  },
  {
    id: 5,
    name: "Paraíso Luxuoso",
    location: "Maldivas",
    description: "Vilas sobre a água com o oceano turquesa mais claro do mundo",
    image: "/images/maldives.jpg",
  },
  {
    id: 6,
    name: "Cidade Luz",
    location: "Paris, França",
    description: "Cultura, arte, romance e a icônica Torre Eiffel ao pôr do sol",
    image: "/images/paris.jpg",
  },
]

function PopularDestinationsSection() {
  return (
    <section className="destinations-section">
      <div className="section-header">
        <h3 className="section-title">Destinos Populares</h3>
        <p className="section-subtitle">Explore os lugares mais incríveis do mundo</p>
      </div>
      <div className="destinations-grid">
        {popularDestinations.map((destination) => (
          <div key={destination.id} className="destination-card">
            <div className="destination-image-wrapper">
              <div className="placeholder-image" style={{backgroundImage: `url(${destination.image})`}} title={destination.name}>
              </div>
            </div>
            <div className="destination-info">
              <p className="destination-location">
                <span role="img" aria-label="pin">📍</span> {destination.location}
              </p>
              <h4 className="destination-name">{destination.name}</h4>
              <p className="destination-description">{destination.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const userName = capitalize(user?.email?.split('@')[0]) || 'Usuário'

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleLogout = () => {
    onLogout()
    navigate("/login")
  }

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
          <h1 className="navbar-title"> Viagem+</h1>

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
        
        <PopularDestinationsSection />

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