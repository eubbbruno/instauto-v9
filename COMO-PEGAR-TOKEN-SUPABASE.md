# 🔑 COMO PEGAR O SUPABASE ACCESS TOKEN

## 📍 PASSO A PASSO:

### 1️⃣ Acesse o Supabase Dashboard
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta

### 2️⃣ Clique no seu PERFIL (canto superior direito)
- Clique na sua **foto/avatar** no canto superior direito
- OU clique no seu **nome/email**

### 3️⃣ Vá para Settings
- No menu que abrir, clique em **"Settings"**
- OU **"Configurações"** se estiver em português

### 4️⃣ Acesse Access Tokens
- No menu lateral esquerdo, procure por **"Access Tokens"**
- OU **"Tokens de Acesso"**
- Clique nesta opção

### 5️⃣ Gere um Novo Token
- Clique no botão **"Generate new token"**
- OU **"Gerar novo token"**

### 6️⃣ Configure o Token
- **Nome:** `Cursor MCP Server`
- **Scopes:** Deixe todas as opções marcadas (ou pelo menos READ access)
- Clique em **"Generate token"**

### 7️⃣ COPIE O TOKEN
- ⚠️ **IMPORTANTE:** O token só aparece UMA VEZ!
- **COPIE** todo o token (começa com `sbp_` ou similar)
- **GUARDE** em local seguro

### 8️⃣ Cole no arquivo .cursor/mcp.json
- Substitua `"SEU_TOKEN_AQUI"` pelo token real
- Salve o arquivo

## 🔄 ALTERNATIVA: Usando as chaves do projeto

Se não conseguir o Access Token, você pode usar a **SERVICE_ROLE_KEY** do seu projeto:

1. Vá para o seu projeto: https://supabase.com/dashboard/project/rtpejermxgjwkqjcdvwi
2. Clique em **"Settings"** (engrenagem)
3. Clique em **"API"** 
4. Copie a **"service_role"** key (anon key NÃO serve!)
5. Use essa chave no lugar do Access Token

## ⚠️ IMPORTANTE:
- NUNCA compartilhe essas chaves
- São chaves administrativas com acesso total
- Use apenas para desenvolvimento/debug
