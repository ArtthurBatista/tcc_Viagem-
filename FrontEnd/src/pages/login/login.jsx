"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./login.css"

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
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

    
    const users = JSON.parse(localStorage.getItem("users")) || []

    if (isSignUp) {
     
      if (users.some((u) => u.email === email)) {
        setError("Este email já está cadastrado")
        return
      }
     
      const newUser = { id: Date.now(), email, password, trips: [] }
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))
    } else {
     
      const user = users.find((u) => u.email === email && u.password === password)
      if (!user) {
        setError("Email ou senha incorretos")
        return
      }
    }

  
    const user = users.find((u) => u.email === email)
    onLogin(user)
    navigate("/home")
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>✈️ Planejador+</h1>
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
              placeholder="seu@email.com"
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
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            {isSignUp ? "Criar Conta" : "Entrar"}
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
