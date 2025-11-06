"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./login.css"

async function apiSignUp(email, password) {
  // Substitua este bloco pela sua chamada HTTP real (ex: fetch, axios)
  return { id: Date.now(), email, password, trips: [] }; 
}

async function apiLogin(email, password) {
  // Substitua este bloco pela sua chamada HTTP real (ex: fetch, axios)
  return { id: 1, email, password, trips: [] }; 
}

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor, preencha todos os campos")
      return
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("As senhas não correspondem")
        return
      }
      if (password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres")
        return
      }
    }

    setIsLoading(true);

    try {
      let user;
      
      if (isSignUp) {
        user = await apiSignUp(email, password);
      } else {
        user = await apiLogin(email, password);
      }

      onLogin(user);
      navigate("/home");

    } catch (err) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>✈️ Viagem+</h1>
          <p>{isSignUp ? "Crie sua conta" : "Bem-vindo de volta"}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Endereço de email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Aguarde..." : (isSignUp ? "Criar Conta" : "Entrar")}
          </button>
        </form>

        <div className="login-toggle">
          <p>
            {isSignUp ? "Já tem conta?" : "Não tem conta?"}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError("")
              }}
              disabled={isLoading}
            >
              {isSignUp ? "Faça Login" : "Crie agora"}
            </button>
          </p>
        </div>
      </div>

      <div className="login-illustration">
        <div className="travel-icon">🗺</div>
        <p>Planeje suas aventuras incríveis</p>
      </div>
    </div>
  )
}