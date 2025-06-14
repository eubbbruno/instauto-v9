#!/bin/bash

# 🚀 SCRIPT DE SETUP - INSTAUTO V7 MELHORIAS
# Executa: chmod +x setup-melhorias.sh && ./setup-melhorias.sh

echo "🚀 INICIANDO SETUP DAS MELHORIAS - INSTAUTO V7"
echo "=============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    log_error "package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

log_info "Verificando Node.js e npm..."
node --version || { log_error "Node.js não encontrado. Instale Node.js primeiro."; exit 1; }
npm --version || { log_error "npm não encontrado. Instale npm primeiro."; exit 1; }

# FASE 1: SUPABASE
echo ""
echo "📦 FASE 1: INSTALANDO DEPENDÊNCIAS SUPABASE"
echo "============================================"

log_info "Instalando Supabase..."
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/auth-ui-react @supabase/auth-ui-shared

if [ $? -eq 0 ]; then
    log_success "Supabase instalado com sucesso!"
else
    log_error "Erro ao instalar Supabase"
    exit 1
fi

# FASE 2: MERCADO PAGO
echo ""
echo "💳 FASE 2: INSTALANDO MERCADO PAGO"
echo "=================================="

log_info "Instalando Mercado Pago SDK..."
npm install mercadopago @mercadopago/sdk-react

if [ $? -eq 0 ]; then
    log_success "Mercado Pago instalado com sucesso!"
else
    log_error "Erro ao instalar Mercado Pago"
    exit 1
fi

# FASE 3: FIREBASE (NOTIFICAÇÕES)
echo ""
echo "🔔 FASE 3: INSTALANDO FIREBASE"
echo "=============================="

log_info "Instalando Firebase..."
npm install firebase @firebase/messaging

if [ $? -eq 0 ]; then
    log_success "Firebase instalado com sucesso!"
else
    log_error "Erro ao instalar Firebase"
    exit 1
fi

# FASE 4: GOOGLE MAPS
echo ""
echo "🗺️ FASE 4: INSTALANDO GOOGLE MAPS"
echo "================================="

log_info "Instalando Google Maps..."
npm install @googlemaps/js-api-loader @types/google.maps

if [ $? -eq 0 ]; then
    log_success "Google Maps instalado com sucesso!"
else
    log_error "Erro ao instalar Google Maps"
    exit 1
fi

# FASE 5: OPENAI
echo ""
echo "🤖 FASE 5: INSTALANDO OPENAI"
echo "============================"

log_info "Instalando OpenAI..."
npm install openai @ai-sdk/openai

if [ $? -eq 0 ]; then
    log_success "OpenAI instalado com sucesso!"
else
    log_error "Erro ao instalar OpenAI"
    exit 1
fi

# FASE 6: ANALYTICS
echo ""
echo "📊 FASE 6: INSTALANDO ANALYTICS"
echo "==============================="

log_info "Instalando Analytics..."
npm install gtag @types/gtag mixpanel-browser @types/mixpanel-browser

if [ $? -eq 0 ]; then
    log_success "Analytics instalado com sucesso!"
else
    log_error "Erro ao instalar Analytics"
    exit 1
fi

# FASE 7: MONITORAMENTO
echo ""
echo "🔍 FASE 7: INSTALANDO MONITORAMENTO"
echo "==================================="

log_info "Instalando Sentry..."
npm install @sentry/nextjs

if [ $? -eq 0 ]; then
    log_success "Sentry instalado com sucesso!"
else
    log_error "Erro ao instalar Sentry"
    exit 1
fi

# DEPENDÊNCIAS EXTRAS
echo ""
echo "⚡ INSTALANDO DEPENDÊNCIAS EXTRAS"
echo "================================="

log_info "Instalando dependências extras..."
npm install crypto-js @types/crypto-js date-fns react-hot-toast react-hook-form @hookform/resolvers zod

if [ $? -eq 0 ]; then
    log_success "Dependências extras instaladas!"
else
    log_error "Erro ao instalar dependências extras"
    exit 1
fi

# CRIAR ESTRUTURA DE PASTAS
echo ""
echo "📁 CRIANDO ESTRUTURA DE PASTAS"
echo "=============================="

log_info "Criando pastas necessárias..."

# Criar pastas lib
mkdir -p src/lib/{supabase,mercadopago,firebase,openai,analytics}

# Criar pastas hooks
mkdir -p src/hooks/{supabase,payments,notifications}

# Criar pastas components específicos
mkdir -p src/components/{payments,notifications,maps,ai}

# Criar pastas para APIs
mkdir -p src/app/api/{payments,webhooks,notifications}

log_success "Estrutura de pastas criada!"

# CRIAR ARQUIVO .env.example
echo ""
echo "🔧 CRIANDO ARQUIVO .env.example"
echo "==============================="

cat > .env.example << 'EOF'
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MERCADO PAGO
MERCADOPAGO_ACCESS_TOKEN=TEST-your-access-token
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-your-public-key
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret

# FIREBASE
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# GOOGLE MAPS
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# OPENAI
OPENAI_API_KEY=your_openai_api_key

# ANALYTICS
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# SENTRY
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# OUTROS
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
EOF

log_success "Arquivo .env.example criado!"

# VERIFICAR INSTALAÇÃO
echo ""
echo "✅ VERIFICANDO INSTALAÇÃO"
echo "========================"

log_info "Verificando dependências instaladas..."

# Verificar se as principais dependências foram instaladas
PACKAGES=("@supabase/supabase-js" "mercadopago" "firebase" "@googlemaps/js-api-loader" "openai" "@sentry/nextjs")

for package in "${PACKAGES[@]}"; do
    if npm list "$package" > /dev/null 2>&1; then
        log_success "$package ✓"
    else
        log_error "$package ✗"
    fi
done

# RESUMO FINAL
echo ""
echo "🎉 SETUP CONCLUÍDO!"
echo "=================="
echo ""
log_success "Todas as dependências foram instaladas com sucesso!"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Copie .env.example para .env.local"
echo "2. Configure suas chaves de API"
echo "3. Execute: npm run dev"
echo ""
echo "📚 DOCUMENTAÇÃO:"
echo "- Supabase: supabase-setup.md"
echo "- Mercado Pago: mercadopago-setup.md"
echo "- Roadmap: roadmap-completo.md"
echo ""
log_info "Tempo total de instalação: $(date)"
echo ""
echo "🚀 PRONTO PARA DECOLAR! 🚀" 