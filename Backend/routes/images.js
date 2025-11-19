const express = require('express');
const router = express.Router();

// Mapeamento de destinos para URLs de imagens (preferência)
const destinationImages = {
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
  'paris france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
  'tokyo japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  'rio': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
  'bali indonesia': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
  'santorini greece': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
  'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
  'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
  'swiss alps': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
  'swiss alps mountains': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
  'switzerland': 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=800&h=600&fit=crop',
  'greece': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&h=600&fit=crop',
  'italy': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=600&fit=crop',
  'venice': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
  'barcelona': 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=600&fit=crop',
  'iceland': 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&h=600&fit=crop',
  'norway': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop',
  'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
};

function picsumSeeded(query, w = 800, h = 600) {
  const seed = encodeURIComponent((query || 'viagem') + '-tcc');
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

function unsplashSource(query, w = 800, h = 600) {
  // Unsplash Source não requer chave e retorna uma imagem por tema
  const q = encodeURIComponent(`${query || 'travel'}`);
  return `https://source.unsplash.com/${w}x${h}/?${q}`;
}

function normalize(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // remove acentos
    .replace(/[^a-z0-9\s]/g, ' ') // remove pontuação
    .replace(/\s+/g, ' ') // normaliza espaços
    .trim();
}

// Buscar imagem automaticamente pelo nome do destino
router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query é obrigatório' });
  }

  try {
    const queryLower = query.toLowerCase();
    const qn = normalize(query);
    
    // Procurar por correspondência parcial no mapeamento
    let imageUrl = null;
    for (const [key, url] of Object.entries(destinationImages)) {
      const kn = normalize(key);
      if (qn.includes(kn) || kn.includes(qn)) {
        imageUrl = url;
        break;
      }
    }
    
    // Se não encontrar, usar um fallback determinístico por query
    if (!imageUrl) {
      // Preferência: Unsplash Source por tema; caso indisponível, Picsum seed
      imageUrl = unsplashSource(query, 800, 600) || picsumSeeded(query, 800, 600);
    }
    
    res.json({ 
      imageUrl,
      query,
      source: imageUrl.includes('unsplash') ? 'unsplash' : 'picsum'
    });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    // Fallback final em caso de qualquer erro no servidor
    return res.json({
      imageUrl: picsumSeeded(query, 800, 600),
      query,
      source: 'picsum-fallback'
    });
  }
});

// Rota alternativa com mais opções
router.get('/search-detailed', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query é obrigatório' });
  }

  try {
    const queryLower = query.toLowerCase();
    let baseImageUrl = null;
    
    // Procurar por correspondência parcial
    for (const [key, url] of Object.entries(destinationImages)) {
      if (queryLower.includes(key) || key.includes(queryLower)) {
        baseImageUrl = url;
        break;
      }
    }
    
    if (!baseImageUrl) {
      // Usar Unsplash Source com múltiplos tamanhos; fallback para Picsum seed
      baseImageUrl = unsplashSource(query, 800, 600);
    }
    
    res.json({
      query,
      images: {
        small: baseImageUrl.includes('unsplash') ? unsplashSource(query, 400, 300) : picsumSeeded(query, 400, 300),
        medium: baseImageUrl,
        large: baseImageUrl.includes('unsplash') ? unsplashSource(query, 1200, 800) : picsumSeeded(query, 1200, 800),
        featured: baseImageUrl
      },
      source: baseImageUrl.includes('unsplash') ? 'unsplash' : 'picsum'
    });
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    // Fallback final com tamanhos diferentes
    return res.json({
      query,
      images: {
        small: picsumSeeded(query, 400, 300),
        medium: picsumSeeded(query, 800, 600),
        large: picsumSeeded(query, 1200, 800),
        featured: picsumSeeded(query, 800, 600),
      },
      source: 'picsum-fallback'
    });
  }
});

module.exports = router;
