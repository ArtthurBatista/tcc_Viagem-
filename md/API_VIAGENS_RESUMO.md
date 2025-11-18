# ✅ API de Viagens com Imagens - Configuração Completa!

## 🎯 O Que Foi Criado

### Arquivos Novos:
- ✅ `Backend/routes/viagens.js` - API completa de viagens com upload de imagens
- ✅ `Backend/add-imagem-viagens.sql` - SQL para adicionar campo de imagem
- ✅ `Backend/API_VIAGENS.md` - Documentação completa da API
- ✅ `Backend/test-viagens.ps1` - Script de testes

### Arquivos Atualizados:
- ✅ `Backend/server.js` - Adicionado rota `/viagens` e suporte a arquivos estáticos
- ✅ `Backend/db.js` - Suporte para tabela viagens no modo memória
- ✅ `Backend/package.json` - Instalado `multer` para upload de imagens

---

## 🚀 Como Usar

### 1. Iniciar o Servidor

```powershell
cd c:\Users\DS2A\Desktop\tcc\Backend
node server.js
```

Você verá:
```
🚀 Server funcionando em http://localhost:3001
📍 API de clientes em http://localhost:3001/clients
🗺️  API de viagens em http://localhost:3001/viagens
```

---

## 📝 Endpoints Disponíveis

### Criar Viagem SEM Imagem

```powershell
$body = @{
    cliente_id = 1
    destino = "Paris"
    origem = "São Paulo"
    data_inicio = "2025-06-01"
    data_fim = "2025-06-15"
    orcamento = 5000
    descricao = "Viagem dos sonhos"
    status = "planejada"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/viagens -Method Post -Body $body -ContentType "application/json"
```

### Criar Viagem COM Imagem

```powershell
$form = @{
    cliente_id = "1"
    destino = "Paris"
    origem = "São Paulo"
    data_inicio = "2025-06-01"
    data_fim = "2025-06-15"
    orcamento = "5000"
    descricao = "Viagem dos sonhos"
    status = "planejada"
    imagem = Get-Item "C:\caminho\para\sua\imagem.jpg"
}

Invoke-RestMethod -Uri http://localhost:3001/viagens -Method Post -Form $form
```

### Listar Todas as Viagens

```powershell
Invoke-RestMethod -Uri http://localhost:3001/viagens
```

### Buscar Viagem por ID

```powershell
Invoke-RestMethod -Uri http://localhost:3001/viagens/1
```

### Atualizar Imagem de uma Viagem

```powershell
$form = @{
    imagem = Get-Item "C:\nova-imagem.jpg"
}

Invoke-RestMethod -Uri http://localhost:3001/viagens/1/imagem -Method Patch -Form $form
```

### Deletar Viagem

```powershell
Invoke-RestMethod -Uri http://localhost:3001/viagens/1 -Method Delete
```

---

## 🖼️ Como Funciona o Upload de Imagens

1. **Upload:** Imagens são salvas em `Backend/uploads/`
2. **URL:** A API retorna a URL da imagem: `/uploads/viagem-1234567890.jpg`
3. **Acesso:** Imagens acessíveis em: `http://localhost:3001/uploads/viagem-1234567890.jpg`

---

## 💻 Exemplo no Frontend (React/JavaScript)

```javascript
// Criar viagem com imagem
async function criarViagem(formData) {
  const form = new FormData();
  form.append('cliente_id', 1);
  form.append('destino', 'Paris');
  form.append('origem', 'São Paulo');
  form.append('data_inicio', '2025-06-01');
  form.append('data_fim', '2025-06-15');
  form.append('orcamento', 5000);
  form.append('descricao', 'Viagem dos sonhos');
  form.append('imagem', fileInput.files[0]); // do input type="file"

  const response = await fetch('http://localhost:3001/viagens', {
    method: 'POST',
    body: form
  });

  const data = await response.json();
  console.log('Viagem criada:', data);
  return data;
}

// Exibir imagem
function exibirViagem(viagem) {
  if (viagem.imagem_url) {
    const imagemUrl = `http://localhost:3001${viagem.imagem_url}`;
    return <img src={imagemUrl} alt={viagem.destino} />;
  }
}
```

---

## 🗄️ Banco de Dados

### Modo Memória (Padrão)
- Funciona automaticamente
- Dados salvos em `Backend/data.json`
- Não precisa de MariaDB

### Modo MariaDB
Se quiser usar MariaDB, execute o SQL:

```sql
ALTER TABLE viagens ADD COLUMN imagem_url VARCHAR(500) AFTER descricao;
```

Ou use o arquivo: `Backend/add-imagem-viagens.sql`

---

## 📁 Estrutura de Pastas

```
Backend/
├── uploads/              ← Imagens salvas aqui
├── routes/
│   ├── clients.js
│   └── viagens.js       ← Nova rota
├── server.js            ← Atualizado
├── db.js                ← Atualizado
├── data.json            ← Dados em memória
├── API_VIAGENS.md       ← Documentação
└── test-viagens.ps1     ← Testes
```

---

## ✅ Validações

- **Formatos permitidos:** jpeg, jpg, png, gif, webp
- **Tamanho máximo:** 5MB
- **Campos obrigatórios:** cliente_id, destino, origem, data_inicio, data_fim

---

## 🔄 Status de Viagens

- `planejada` - Viagem ainda não iniciada
- `em_progresso` - Viagem em andamento
- `concluida` - Viagem finalizada
- `cancelada` - Viagem cancelada

---

## 📖 Documentação Completa

Veja `Backend/API_VIAGENS.md` para todos os detalhes!

---

## 🎉 Pronto!

Sua API de viagens está completa e funcionando!

**Para testar:**
1. Inicie o servidor: `node server.js`
2. Use os comandos acima
3. Acesse as imagens em: `http://localhost:3001/uploads/`

**Próximos passos:**
- Integrar com o Frontend
- Criar interface de upload de imagens
- Adicionar galeria de fotos da viagem
