# 🔐 CORREÇÕES OAUTH - INSTAUTO

## ❌ **PROBLEMAS IDENTIFICADOS**

### 1. **GOOGLE OAuth** ✅
**Problema:** Vai para login ao invés de criar conta
**Status:** RESOLVIDO - Código está correto

### 2. **FACEBOOK OAuth**  
**Problema:** Erro "domínio não incluído nos domínios do app"
**Causa:** Configuração incompleta no Facebook App
**Solução:** Configurar domínios + Termos + Namespace

---

## ✅ **SOLUÇÕES IMPLEMENTADAS**

### 📄 **1. PÁGINA DE TERMOS CRIADA**
- ✅ **URL:** https://www.instauto.com.br/termos
- ✅ **Arquivo:** `src/app/termos/page.tsx`
- ✅ **Estilo:** Amarelo/Azul (conforme paleta)

### 🔍 **2. FACEBOOK - Configuração Completa**

**No Facebook App Dashboard:**

1. **Basic Settings:**
   ```
   App Domains:
   instauto.com.br
   
   Site URL:
   https://www.instauto.com.br
   
   Terms of Service URL:
   https://www.instauto.com.br/termos
   
   Privacy Policy URL:
   https://www.instauto.com.br/politicas
   ```

2. **App Namespace (OBRIGATÓRIO):**
   ```
   Namespace: instauto
   ```
   *(Deve ser único no Facebook)*

3. **Facebook Login Settings:**
   ```
   Valid OAuth Redirect URIs:
   https://rtpejermxgjwkqjcdvwi.supabase.co/auth/v1/callback
   
   Valid Deauthorize Callback URL:
   https://www.instauto.com.br/auth/callback
   ```

4. **Advanced Settings:**
   ```
   Client OAuth Login: Yes
   Web OAuth Login: Yes
   Enforce HTTPS: Yes
   ```

### 🔍 **3. GOOGLE - Configuração**

**No Google Cloud Console:**

1. **Authorized redirect URIs:**
   ```
   https://rtpejermxgjwkqjcdvwi.supabase.co/auth/v1/callback
   ```

2. **Authorized domains:**
   ```
   instauto.com.br
   www.instauto.com.br
   rtpejermxgjwkqjcdvwi.supabase.co
   ```

---

## 🛠️ **PRÓXIMOS PASSOS**

### ✅ **CORES CORRIGIDAS**
- Fundo azul para ambas as páginas
- Cards em amarelo
- Informações em branco

### 📋 **CHECKLIST FACEBOOK:**
- [ ] Configurar App Domains
- [ ] Definir Namespace único
- [ ] Adicionar Terms of Service URL
- [ ] Configurar OAuth Redirect URIs
- [ ] Testar autenticação

### 🎯 **URLs IMPORTANTES:**
- **Site:** https://www.instauto.com.br
- **Termos:** https://www.instauto.com.br/termos  
- **Políticas:** https://www.instauto.com.br/politicas
- **Callback:** https://rtpejermxgjwkqjcdvwi.supabase.co/auth/v1/callback 