# 🗺️ API de Viagens com Upload de Imagens

## Endpoints Disponíveis

### Base URL
```
http://localhost:3001/viagens
```

---

## 📋 Listar Viagens

### GET `/viagens`

Lista todas as viagens, com filtros opcionais.

**Query Parameters:**
- `cliente_id` (opcional) - Filtrar por ID do cliente
- `status` (opcional) - Filtrar por status (`planejada`, `em_progresso`, `concluida`, `cancelada`)

**Exemplos:**

```powershell
# Listar todas
Invoke-RestMethod -Uri http://localhost:3001/viagens

# Listar viagens de um cliente
Invoke-RestMethod -Uri "http://localhost:3001/viagens?cliente_id=1"

# Listar viagens por status
Invoke-RestMethod -Uri "http://localhost:3001/viagens?status=planejada"

# Combinar filtros
Invoke-RestMethod -Uri "http://localhost:3001/viagens?cliente_id=1&status=planejada"
```

---

## 🔍 Buscar Viagem por ID

### GET `/viagens/:id`

Retorna os detalhes de uma viagem específica.

**Exemplo:**

```powershell
Invoke-RestMethod -Uri http://localhost:3001/viagens/1
```

---

## ➕ Criar Nova Viagem

### POST `/viagens`

Cria uma nova viagem com ou sem imagem.

**Headers:**
```
Content-Type: multipart/form-data
```

**Form Data:**
- `cliente_id` (obrigatório) - ID do cliente
- `destino` (obrigatório) - Cidade de destino
- `origem` (obrigatório) - Cidade de origem
- `data_inicio` (obrigatório) - Data de início (YYYY-MM-DD)
- `data_fim` (obrigatório) - Data de término (YYYY-MM-DD)
- `orcamento` (opcional) - Orçamento da viagem
- `descricao` (opcional) - Descrição da viagem
- `status` (opcional) - Status (`planejada`, `em_progresso`, `concluida`, `cancelada`)
- `imagem` (opcional) - Arquivo de imagem (jpeg, jpg, png, gif, webp, max 5MB)

**Exemplo com PowerShell:**

```powershell
# Sem imagem
$body = @{
    cliente_id = 1
    destino = "Paris"
    origem = "São Paulo"
    data_inicio = "2025-06-01"
    data_fim = "2025-06-15"
    orcamento = 5000
    descricao = "Viagem dos sonhos para Paris"
    status = "planejada"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3001/viagens -Method Post -Body $body -ContentType "application/json"

# Com imagem
$form = @{
    cliente_id = "1"
    destino = "Paris"
    origem = "São Paulo"
    data_inicio = "2025-06-01"
    data_fim = "2025-06-15"
    orcamento = "5000"
    descricao = "Viagem dos sonhos para Paris"
    status = "planejada"
    imagem = Get-Item "C:\caminho\para\imagem.jpg"
}

Invoke-RestMethod -Uri http://localhost:3001/viagens -Method Post -Form $form
```

**Exemplo com JavaScript (Fetch):**

```javascript
const formData = new FormData();
formData.append('cliente_id', 1);
formData.append('destino', 'Paris');
formData.append('origem', 'São Paulo');
formData.append('data_inicio', '2025-06-01');
formData.append('data_fim', '2025-06-15');
formData.append('orcamento', 5000);
formData.append('descricao', 'Viagem dos sonhos');
formData.append('status', 'planejada');
formData.append('imagem', fileInput.files[0]); // arquivo do input type="file"

const response = await fetch('http://localhost:3001/viagens', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data);
```

---

## ✏️ Atualizar Viagem

### PUT `/viagens/:id`

Atualiza uma viagem existente, podendo incluir nova imagem.

**Form Data:** (mesmos campos do POST)

**Exemplo:**

```powershell
$form = @{
    destino = "Londres"
    origem = "São Paulo"
    data_inicio = "2025-07-01"
    data_fim = "2025-07-15"
    orcamento = "6000"
    descricao = "Viagem para Londres atualizada"
    status = "planejada"
    imagem = Get-Item "C:\nova-imagem.jpg"
}

Invoke-RestMethod -Uri http://localhost:3001/viagens/1 -Method Put -Form $form
```

---

## 🖼️ Atualizar Apenas a Imagem

### PATCH `/viagens/:id/imagem`

Atualiza apenas a imagem de uma viagem.

**Form Data:**
- `imagem` (obrigatório) - Arquivo de imagem

**Exemplo:**

```powershell
$form = @{
    imagem = Get-Item "C:\caminho\para\nova-imagem.jpg"
}

Invoke-RestMethod -Uri http://localhost:3001/viagens/1/imagem -Method Patch -Form $form
```

---

## 🗑️ Deletar Viagem

### DELETE `/viagens/:id`

Deleta uma viagem e sua imagem (se existir).

**Exemplo:**

```powershell
Invoke-RestMethod -Uri http://localhost:3001/viagens/1 -Method Delete
```

---

## 🗑️ Remover Imagem da Viagem

### DELETE `/viagens/:id/imagem`

Remove apenas a imagem de uma viagem, mantendo os outros dados.

**Exemplo:**

```powershell
Invoke-RestMethod -Uri http://localhost:3001/viagens/1/imagem -Method Delete
```

---

## 📸 Acessar Imagens

As imagens são armazenadas em `/uploads` e podem ser acessadas diretamente:

```
http://localhost:3001/uploads/viagem-1234567890-123456789.jpg
```

No frontend, você pode usar a URL retornada pela API:

```javascript
const viagem = await fetch('http://localhost:3001/viagens/1').then(r => r.json());
const imagemUrl = `http://localhost:3001${viagem.imagem_url}`;

// Usar no HTML
<img src={imagemUrl} alt={viagem.destino} />
```

---

## 🔒 Validações

- **Imagens:** Apenas jpeg, jpg, png, gif, webp são permitidas
- **Tamanho:** Máximo 5MB por imagem
- **Campos obrigatórios:** cliente_id, destino, origem, data_inicio, data_fim

---

## 📊 Estrutura da Resposta

### Viagem

```json
{
  "id": 1,
  "cliente_id": 1,
  "destino": "Paris",
  "origem": "São Paulo",
  "data_inicio": "2025-06-01",
  "data_fim": "2025-06-15",
  "orcamento": 5000.00,
  "gasto_total": 0.00,
  "descricao": "Viagem dos sonhos para Paris",
  "imagem_url": "/uploads/viagem-1234567890-123456789.jpg",
  "status": "planejada",
  "data_criacao": "2025-11-18T12:00:00.000Z"
}
```

---

## ⚙️ Configuração do Banco de Dados

Execute o SQL para adicionar o campo de imagem:

```sql
ALTER TABLE viagens ADD COLUMN imagem_url VARCHAR(500) AFTER descricao;
```

Ou use o arquivo `add-imagem-viagens.sql`.

---

## 🚀 Iniciar o Servidor

```powershell
cd Backend
node server.js
```

A API estará disponível em `http://localhost:3001/viagens`
