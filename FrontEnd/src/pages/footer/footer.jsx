"use client"
import "./footer.css"
import { MapPin, Heart, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <div className="brand">
              <MapPin className="icon" />
              <span className="brand-name">Viagem+</span>
            </div>
            <p className="description">
              Planeje suas viagens e aventuras com seus amigos de forma fácil e divertida.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="section-title">Links Rápidos</h3>
            <ul className="quick-links">
              <li><a href="#">Sobre</a></li>
              <li><a href="#">Recursos</a></li>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Privacidade</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="section-title">Contato</h3>
            <div className="contact-item">
              <Mail className="icon" />
              <span>viagem@contato.com</span>
            </div>
            <div className="contact-item">
              <Heart className="icon heart" />
              <span>Feito por Alunos do Senai</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Viagem+. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}