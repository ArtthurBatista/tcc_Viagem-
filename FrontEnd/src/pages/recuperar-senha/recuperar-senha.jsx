import { useState } from "react"
import { forgotPassword } from "../../api/client"
import { useNavigate } from "react-router-dom"
import "./recuperar-senha.css"

export default function RecuperarSenha() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState("")
  const [email, setEmail] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!usuario || !email || !novaSenha) {
      setError("Preencha todos os campos!")
      return
    }
    if (novaSenha.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.")
      return
    }
    try {
      await forgotPassword({ email, usuario, novaSenha })
      setSuccess("Senha atualizada com sucesso! Faça login com a nova senha.")
    } catch (err) {
      setError(err.message || "Erro ao recuperar senha.")
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo">✈️ Viagem+</div>
        <button className="nav-btn" onClick={() => navigate("/login")}>
          Voltar ao Login
        </button>
      </nav>
      <div className="recuperar-container">
      <div className="recuperar-card">
        <h2>Recuperar Senha</h2>
        <form onSubmit={handleSubmit} className="recuperar-form">
          <div className="form-group">
            <label htmlFor="usuario">Usuário</label>
            <input
              id="usuario"
              type="text"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Seu nome de usuário"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Seu email cadastrado"
            />
          </div>
          <div className="form-group">
            <label htmlFor="novaSenha">Nova Senha</label>
            <input
              id="novaSenha"
              type="password"
              value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              placeholder="Digite a nova senha"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="recuperar-btn">Recuperar Senha</button>
        </form>
      </div>
    </div>
    </>
  )
}
