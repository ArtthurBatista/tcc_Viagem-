export async function forgotPassword({ email, usuario, novaSenha }) {
  const res = await fetch(`${BASE}/clients/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, usuario, novaSenha }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || data?.message || "Falha ao recuperar senha");
  }
  return await res.json();
}
const BASE = "/api";

export async function registerClient({ usuario, email, password }) {
  const res = await fetch(`${BASE}/clients/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, email, password }),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || data?.message || "Falha ao registrar");
  }
  
  const data = await res.json();
  return data;
}

export async function loginClient({ email, password }) {
  const res = await fetch(`${BASE}/clients/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || data?.message || "Falha no login");
  }
  
  const data = await res.json();
  return data; // { id, nome, email, foto_perfil, message }
}

export async function getClientById(id) {
  const res = await fetch(`${BASE}/clients/${id}`);
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || data?.message || "Falha ao buscar cliente");
  }
  
  const data = await res.json();
  return data; // { id, nome, email, foto_perfil }
}

export async function updateClient(id, payload) {
  const res = await fetch(`${BASE}/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || data?.message || "Falha ao atualizar cliente");
  }
  
  const data = await res.json();
  return data;
}
