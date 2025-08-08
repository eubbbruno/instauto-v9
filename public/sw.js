// Service Worker para PWA InstaAuto
const CACHE_NAME = 'instauto-v1.0.0'
const OFFLINE_PAGE = '/offline'

// Recursos essenciais para cache
const ESSENTIAL_RESOURCES = [
  '/',
  '/login',
  '/motorista',
  '/oficina-pro',
  '/oficina-free',
  '/images/logo.svg',
  '/manifest.json',
  OFFLINE_PAGE
]

// Recursos estáticos para cache
const STATIC_RESOURCES = [
  '/images/car-3d.png',
  '/images/truck-3d.png',
  '/images/moto-3d.png'
]

// Install event - Cache essential resources
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching essential resources')
        return cache.addAll(ESSENTIAL_RESOURCES)
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('❌ Service Worker install failed:', error)
      })
  )
})

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('✅ Service Worker activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - Network first, then cache
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Skip API requests (handle differently)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle page requests
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handlePageRequest(request))
    return
  }

  // Handle static resources
  event.respondWith(handleStaticRequest(request))
})

// Handle API requests - Network only with offline indicator
async function handleApiRequest(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    console.log('📡 API request failed (offline):', request.url)
    
    // Return a minimal offline response for API calls
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'Você está offline. Algumas funcionalidades podem não estar disponíveis.'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}

// Handle page requests - Network first, then cache, then offline page
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('📄 Page request failed, trying cache:', request.url)
    
    // Try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match(OFFLINE_PAGE)
      if (offlineResponse) {
        return offlineResponse
      }
    }
    
    // Fallback response
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>InstaAuto - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 20px;
            }
            .offline-container {
              max-width: 400px;
            }
            .offline-icon {
              font-size: 4rem;
              margin-bottom: 1rem;
            }
            .offline-title {
              font-size: 1.5rem;
              font-weight: bold;
              margin-bottom: 0.5rem;
            }
            .offline-message {
              opacity: 0.9;
              margin-bottom: 2rem;
            }
            .retry-button {
              background: rgba(255, 255, 255, 0.2);
              border: 2px solid rgba(255, 255, 255, 0.3);
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              cursor: pointer;
              font-size: 1rem;
              transition: all 0.3s ease;
            }
            .retry-button:hover {
              background: rgba(255, 255, 255, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">📡</div>
            <h1 class="offline-title">Você está offline</h1>
            <p class="offline-message">
              Verifique sua conexão com a internet e tente novamente.
            </p>
            <button class="retry-button" onclick="window.location.reload()">
              Tentar Novamente
            </button>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  }
}

// Handle static resources - Cache first, then network
async function handleStaticRequest(request) {
  // Try cache first
  const cachedResponse = await caches.match(request)
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('🖼️ Static resource failed:', request.url)
    throw error
  }
}

// Push notification event
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received')
  
  let data = {}
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data = { title: 'InstaAuto', body: event.data.text() }
    }
  }
  
  const options = {
    title: data.title || 'InstaAuto',
    body: data.body || 'Nova notificação',
    icon: '/images/logo.svg',
    badge: '/icons/icon-72x72.png',
    data: data.data || {},
    actions: [
      {
        action: 'open',
        title: 'Abrir App',
        icon: '/icons/open-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/icons/dismiss-action.png'
      }
    ],
    tag: data.tag || 'general',
    renotify: true,
    requireInteraction: data.urgent || false,
    vibrate: data.urgent ? [200, 100, 200] : [100],
    timestamp: Date.now()
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action)
  
  event.notification.close()
  
  if (event.action === 'dismiss') {
    return
  }
  
  // Get the URL to open
  let urlToOpen = '/'
  
  if (event.notification.data) {
    urlToOpen = event.notification.data.url || '/'
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus()
            if (urlToOpen !== '/') {
              client.navigate(urlToOpen)
            }
            return
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Background sync event (for offline actions)
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag)
  
  if (event.tag === 'send-message') {
    event.waitUntil(syncMessages())
  } else if (event.tag === 'sync-data') {
    event.waitUntil(syncOfflineData())
  }
})

// Sync offline messages
async function syncMessages() {
  try {
    // Get offline messages from IndexedDB
    const offlineMessages = await getOfflineMessages()
    
    for (const message of offlineMessages) {
      try {
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message)
        })
        
        if (response.ok) {
          await removeOfflineMessage(message.id)
          console.log('✅ Offline message synced:', message.id)
        }
      } catch (error) {
        console.log('❌ Failed to sync message:', message.id, error)
      }
    }
  } catch (error) {
    console.error('❌ Sync messages failed:', error)
  }
}

// Sync general offline data
async function syncOfflineData() {
  try {
    console.log('🔄 Syncing offline data...')
    
    // Here you would implement syncing of:
    // - Offline form submissions
    // - Cached user actions
    // - Updated profile data
    // etc.
    
    console.log('✅ Offline data synced')
  } catch (error) {
    console.error('❌ Sync offline data failed:', error)
  }
}

// Helper functions for IndexedDB operations
async function getOfflineMessages() {
  // Implement IndexedDB operations
  return []
}

async function removeOfflineMessage(messageId) {
  // Implement IndexedDB removal
  return true
}

// Update notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

console.log('🚀 InstaAuto Service Worker loaded successfully')
