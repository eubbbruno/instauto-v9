// Service Worker para PWA
const CACHE_NAME = 'instauto-v1.0.0'
const STATIC_CACHE_NAME = 'instauto-static-v1'
const DYNAMIC_CACHE_NAME = 'instauto-dynamic-v1'

// URLs para cache estático (recursos essenciais)
const STATIC_ASSETS = [
  '/',
  '/login',
  '/motorista',
  '/oficina-free',
  '/oficina-pro',
  '/manifest.json',
  '/images/logo.svg',
  '/images/logo-instauto.svg'
]

// URLs para cache dinâmico (dados da API)
const API_CACHE_PATTERNS = [
  /\/api\/oficinas/,
  /\/api\/agendamentos/,
  /\/api\/auth/
]

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 SW: Installing service worker...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('📦 SW: Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    }).catch((error) => {
      console.error('❌ SW: Error caching static assets:', error)
    })
  )
  
  // Força a ativação imediata
  self.skipWaiting()
})

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ SW: Activating service worker...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove caches antigos
          if (cacheName !== STATIC_CACHE_NAME && 
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME) {
            console.log('🗑️ SW: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  
  // Assume o controle imediatamente
  self.clients.claim()
})

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Ignorar requisições não-HTTP
  if (!request.url.startsWith('http')) return
  
  // Ignorar requisições do Chrome Extensions
  if (url.protocol === 'chrome-extension:') return
  
  // WebSocket requests
  if (request.url.includes('/api/ws')) {
    return // Não cachear WebSocket
  }
  
  event.respondWith(
    handleRequest(request)
  )
})

// Estratégias de cache
async function handleRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Estratégia: Cache First para assets estáticos
    if (isStaticAsset(request)) {
      return await cacheFirst(request, STATIC_CACHE_NAME)
    }
    
    // Estratégia: Network First para API calls
    if (isApiCall(request)) {
      return await networkFirst(request, DYNAMIC_CACHE_NAME, 5000)
    }
    
    // Estratégia: Stale While Revalidate para páginas
    if (isPageRequest(request)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE_NAME)
    }
    
    // Estratégia: Network Only para tudo mais
    return await fetch(request)
    
  } catch (error) {
    console.error('❌ SW: Request failed:', error)
    return await handleOffline(request)
  }
}

// Cache First - Ideal para assets estáticos
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  const networkResponse = await fetch(request)
  
  if (networkResponse.status === 200) {
    cache.put(request, networkResponse.clone())
  }
  
  return networkResponse
}

// Network First - Ideal para API calls
async function networkFirst(request, cacheName, timeout = 5000) {
  const cache = await caches.open(cacheName)
  
  try {
    // Tentar network com timeout
    const networkResponse = await Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ])
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
    
  } catch (error) {
    console.log('🔄 SW: Network failed, trying cache...')
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    throw error
  }
}

// Stale While Revalidate - Ideal para páginas
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Buscar versão atualizada em background
  const networkResponsePromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)
  
  // Retornar cache imediatamente se disponível
  if (cachedResponse) {
    networkResponsePromise // Não aguardar
    return cachedResponse
  }
  
  // Se não há cache, aguardar network
  return await networkResponsePromise
}

// Handlers para offline
async function handleOffline(request) {
  const url = new URL(request.url)
  
  // Página offline personalizada
  if (isPageRequest(request)) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>InstaAuto - Offline</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: system-ui, sans-serif; 
            text-align: center; 
            padding: 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
          }
          .container {
            max-width: 400px;
            background: rgba(255,255,255,0.1);
            padding: 2rem;
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }
          .logo { font-size: 2rem; margin-bottom: 1rem; }
          .retry-btn {
            background: #fff;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            margin-top: 1rem;
            cursor: pointer;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🚗 InstaAuto</div>
          <h2>Você está offline</h2>
          <p>Verifique sua conexão com a internet e tente novamente.</p>
          <button class="retry-btn" onclick="window.location.reload()">
            Tentar Novamente
          </button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    })
  }
  
  // API offline response
  if (isApiCall(request)) {
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'Você está offline. Tente novamente quando estiver conectado.'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  
  // Fallback genérico
  return new Response('Offline', { status: 503 })
}

// Utilitários de identificação
function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf)$/) ||
         STATIC_ASSETS.includes(url.pathname)
}

function isApiCall(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))
}

function isPageRequest(request) {
  const url = new URL(request.url)
  return request.method === 'GET' && 
         request.headers.get('accept')?.includes('text/html') &&
         !url.pathname.startsWith('/api/')
}

// Mensagens do cliente (para controle do cache)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => {
      event.ports[0].postMessage({ success: true })
    })
  }
  
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then((size) => {
      event.ports[0].postMessage({ size })
    })
  }
})

// Calcular tamanho do cache
async function getCacheSize() {
  const cacheNames = await caches.keys()
  let totalSize = 0
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    
    for (const request of keys) {
      const response = await cache.match(request)
      if (response) {
        const blob = await response.blob()
        totalSize += blob.size
      }
    }
  }
  
  return Math.round(totalSize / 1024 / 1024 * 100) / 100 // MB
}

// Push Notifications
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body || 'Nova notificação do InstaAuto',
    icon: '/images/logo-192.png',
    badge: '/images/badge-72.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'InstaAuto', options)
  )
})

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const data = event.notification.data
  let url = data.url || '/'
  
  // Ações específicas
  if (event.action === 'view_message') {
    url = '/mensagens'
  } else if (event.action === 'view_appointment') {
    url = '/agendamentos'
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Se já existe uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Senão, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

console.log('✅ SW: Service Worker carregado com sucesso!')