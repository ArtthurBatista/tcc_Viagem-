const BASE = "/api";

export async function registerClient({ nome, email, password }) {
  const res = await fetch(`${BASE}/clients/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Falha ao registrar");
  }
  return data;
}

export async function loginClient({ email, password }) {
  const res = await fetch(`${BASE}/clients/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Falha no login");
  }
  return data; // { id, nome, email, message }
}

export async function getClientById(id) {
  const res = await fetch(`${BASE}/clients/${id}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Falha ao buscar cliente");
  }
  return data; // { id, nome, email }
}

export async function updateClient(id, payload) {
  const res = await fetch(`${BASE}/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Falha ao atualizar cliente");
  }
  return data;
}
