const BASE = "/api";

function fallbackImage(query) {
  const seed = encodeURIComponent(query || Math.random().toString(36).slice(2));
  return `https://picsum.photos/seed/${seed}/800/600`;
}

// Buscar imagem automaticamente pelo nome do destino
export async function searchImage(query) {
  try {
    const res = await fetch(`${BASE}/images/search?query=${encodeURIComponent(query)}`);
    
    if (!res.ok) {
      throw new Error('Erro ao buscar imagem');
    }
    
    const data = await res.json();
    // Garante retorno válido
    return data?.imageUrl || fallbackImage(query);
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    // Fallback local/externo para sempre exibir algo
    return fallbackImage(query);
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
    if (data?.images) return data.images;
    const base = fallbackImage(query);
    return {
      small: base.replace('/800/600', '/400/300'),
      medium: base,
      large: base.replace('/800/600', '/1200/800'),
      featured: base,
    };
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    const base = fallbackImage(query);
    return {
      small: base.replace('/800/600', '/400/300'),
      medium: base,
      large: base.replace('/800/600', '/1200/800'),
      featured: base,
    };
  }
}
