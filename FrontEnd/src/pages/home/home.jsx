import { useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { searchImage } from "../../api/images"
import "./home.css"
import Footer from "../footer/footer"
import ChatWidget from "../../components/ChatWidget/ChatWidget"

const amazingFeatures = [
  {
    icon: "📍",
    title: "Planejamento Completo",
    description: "Organize destinos, datas, roteiros e todas as informações da sua viagem em um só lugar.",
    styleClass: "icon-orange"
  },
  {
    icon: "$",
    title: "Controle de Gastos",
    description: "Acompanhe despesas, defina orçamento e mantenha suas finanças de viagem sob controle.",
    styleClass: "icon-blue"
  },
  {
    icon: "📋",
    title: "Listas de Itens",
    description: "Crie checklists completas do que levar e garanta que nada será esquecido.",
    styleClass: "icon-yellow"
  },
  {
    icon: "👥",
    title: "Viagens em Grupo",
    description: "Convide amigos, compartilhe planos e organize viagens colaborativas.",
    styleClass: "icon-royal-blue"
  },
]

const popularDestinations = [
  {
    id: 1,
    name: "Ilhas Gregas",
    location: "Santorini, Grécia",
    description: "Casas brancas com cúpulas azuis e pôr do sol inesquecíveis sobre o Mar Egeu",
    searchTerm: "Santorini Greece",
  },
  {
    id: 2,
    name: "Alpes Suíços",
    location: "Suíça",
    description: "Montanhas majestosas, trilhas alpinas e paisagens de tirar o fôlego",
    searchTerm: "Swiss Alps Mountains",
  },
  {
    id: 3,
    name: "Cidade Vibrante",
    location: "Tóquio, Japão",
    description: "Luzes neon, tecnologia de ponta e cultura milenar em harmonia",
    searchTerm: "Tokyo Japan",
  },
  {
    id: 4,
    name: "Refúgio Tropical",
    location: "Bali, Indonésia",
    description: "Terraços de arroz verde-esmeralda e templos sagrados na ilha dos deuses",
    searchTerm: "Bali Indonesia",
  },
  {
    id: 5,
    name: "Paraíso Luxuoso",
    location: "Maldivas",
    description: "Vilas sobre a água com o oceano turquesa mais claro do mundo",
    searchTerm: "Maldives",
  },
  {
    id: 6,
    name: "Cidade Luz",
    location: "Paris, França",
    description: "Cultura, arte, romance e a icônica Torre Eiffel ao pôr do sol",
    searchTerm: "Paris France",
  },
]

function PopularDestinationsSection() {
  const [destinationImages, setDestinationImages] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});
  const listRef = useRef(null)

  useEffect(() => {
    // Carregar imagens para todos os destinos
    const loadImages = async () => {
      const images = {};
      const loaded = {};
      for (const dest of popularDestinations) {
        try {
          const imageUrl = await searchImage(dest.searchTerm);
          if (imageUrl) {
            images[dest.id] = imageUrl;
          }
        } catch (error) {
          console.error(`Erro ao carregar imagem para ${dest.name}:`, error);
        } finally {
          loaded[dest.id] = true;
        }
      }
      setDestinationImages(images);
      setImagesLoaded(loaded);
    };

    loadImages();
  }, []);

  const scrollByAmount = (dir) => {
    const el = listRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.9) * (dir === 'next' ? 1 : -1)
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="destinations-section">
      <div className="destinations-layout">
        <div className="destinations-left">
          <h2 className="destinations-title-large">Sua Próxima</h2>
          <h2 className="destinations-title-large">Grande Aventura</h2>
          <h2 className="destinations-title-large">Espera <span className="airplane-emoji">✈️</span></h2>
          <p className="destinations-subtitle-text">Cansado da Rotina? Deixe-se inspirado pelos "Destinos Populares" do mundo.</p>
          <p className="destinations-subtitle-text">Clique em qualquer um para ver os detalhes e comece a palmejar sua viagem inesquecível agora mesmo com o Viagem + !!</p>
        </div>

        <div className="destinations-right">
          <button type="button" className="carousel-nav prev" onClick={() => scrollByAmount('prev')} aria-label="Anterior">‹</button>
          <button type="button" className="carousel-nav next" onClick={() => scrollByAmount('next')} aria-label="Próximo">›</button>
          <div className="destinations-carousel" ref={listRef}>
            {popularDestinations.map((destination) => (
              <div key={destination.id} className="destination-card">
                <div className="destination-image-wrapper">
                  <div 
                    className="placeholder-image" 
                    style={{
                      backgroundImage: destinationImages[destination.id] 
                        ? `url(${destinationImages[destination.id]})` 
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }} 
                    title={destination.name}
                  >
                    {!imagesLoaded[destination.id] && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        height: '100%', 
                        color: 'white',
                        fontSize: '14px'
                      }}>
                        Carregando...
                      </div>
                    )}
                  </div>
                  <div className="destination-overlay">
                    <p className="destination-location-overlay">{destination.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AmazingFeaturesSection() {
    return (
        <section className="features-section-custom">
            <div className="section-header">
                <h2 className="section-title-custom">Recursos Incríveis</h2>
                <p className="section-subtitle-custom">Tudo o que você precisa para planejar a viagem perfeita</p>
            </div>
            <div className="features-grid-custom">
                {amazingFeatures.map((feature, index) => (
                    <div key={index} className="feature-card-custom">
                        <div className={`feature-icon-wrapper ${feature.styleClass}`}>
                            {feature.title === "Planejamento Completo" && <span role="img" aria-label="planejamento">📍</span>}
                            {feature.title === "Controle de Gastos" && <span role="img" aria-label="gastos">$</span>}
                            {feature.title === "Listas de Itens" && <span role="img" aria-label="lista">📋</span>}
                            {feature.title === "Viagens em Grupo" && <span role="img" aria-label="grupo">👥</span>}
                        </div>
                        <h4 className="feature-title-custom">{feature.title}</h4>
                        <p className="feature-description-custom">{feature.description}</p>
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
          <h1 className="navbar-title">✈️ Viagem+</h1>

          <div className="nav-links">
            <button className="nav-link-btn" onClick={() => navigate("/my-trips")}>
              ✈️ Minhas Viagens
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

        <AmazingFeaturesSection />

      </main>

      <Footer />
      <ChatWidget />
    </div>
  )
}