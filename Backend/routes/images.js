const express = require('express');
const router = express.Router();

// Mapeamento de destinos para URLs de imagens (fallback)
const destinationImages = {
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=600&fit=crop',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  'rio': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&h=600&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
  'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&h=600&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
  'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=600&fit=crop',
  'swiss alps': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&h=600&fit=crop',
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

// Buscar imagem automaticamente pelo nome do destino
router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query é obrigatório' });
  }

  try {
    const queryLower = query.toLowerCase();
    
    // Procurar por correspondência parcial no mapeamento
    let imageUrl = null;
    for (const [key, url] of Object.entries(destinationImages)) {
      if (queryLower.includes(key) || key.includes(queryLower)) {
        imageUrl = url;
        break;
      }
    }
    
    // Se não encontrar, usar uma imagem genérica de viagem
    if (!imageUrl) {
      const randomId = Math.floor(Math.random() * 1000);
      imageUrl = `https://picsum.photos/800/600?random=${randomId}`;
    }
    
    res.json({ 
      imageUrl,
      query,
      source: 'unsplash'
    });
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    res.status(500).json({ error: error.message });
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
      const randomId = Math.floor(Math.random() * 1000);
      baseImageUrl = `https://picsum.photos/800/600?random=${randomId}`;
    }
    
    res.json({
      query,
      images: {
        small: baseImageUrl.replace('800', '400').replace('600', '300'),
        medium: baseImageUrl,
        large: baseImageUrl.replace('800', '1200').replace('600', '800'),
        featured: baseImageUrl
      },
      source: 'unsplash'
    });
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
