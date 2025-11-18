"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./login.css"
import { registerClient, loginClient } from "../../api/client"

export default function Login({ onLogin }) {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [usuario, setUsuario] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password || (isSignUp && !usuario)) {
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

    try {
      if (isSignUp) {
        const result = await registerClient({ nome: usuario, email, password })
        // Após cadastro, efetua login automaticamente
        const logged = await loginClient({ email, password })
        onLogin({ id: logged.id, nome: logged.nome, email: logged.email })
      } else {
        const logged = await loginClient({ email, password })
        onLogin({ id: logged.id, nome: logged.nome, email: logged.email })
      }
      navigate("/home")
    } catch (err) {
      setError(err.message || "Ocorreu um erro. Tente novamente.")
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
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="usuario">Usuário</label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Seu nome de usuário"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Endereço de email"
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
          {!isSignUp && (
            <p style={{ marginTop: '10px' }}>
              <button
                type="button"
                className="toggle-btn"
                style={{ color: '#007af5', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => navigate("/recuperar-senha")}
              >
                Esqueci minha senha
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="login-illustration">
        <div className="travel-icon">🗺</div>
        <p>Planeje suas aventuras incríveis</p>
      </div>
    </div>
  )
}
