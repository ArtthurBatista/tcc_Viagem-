const BASE = "/api";

// Buscar imagem automaticamente pelo nome do destino
export async function searchImage(query) {
  try {
    const res = await fetch(`${BASE}/images/search?query=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      throw new Error('Erro ao buscar imagem');
    }
    
    const data = await res.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return null;
  }
}

// Buscar múltiplas opções de imagem
export async function searchImageDetailed(query) {
  try {
    const res = await fetch(`${BASE}/images/search-detailed?query=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      throw new Error('Erro ao buscar imagens');
    }
    
    const data = await res.json();
    return data.images;
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    return null;
  }
}
