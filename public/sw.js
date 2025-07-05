const CACHE_NAME = 'instauto-v1';
const STATIC_CACHE = 'instauto-static-v1';
const DYNAMIC_CACHE = 'instauto-dynamic-v1';

// Arquivos para cache inicial
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/logo-instauto.svg',
  '/offline.html'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Interceptar requisições (Cache Strategy)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições de extensões e outras origens
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Strategy: Cache First para assets estáticos
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(fetchResponse => {
              if (fetchResponse.ok) {
                const responseClone = fetchResponse.clone();
                caches.open(DYNAMIC_CACHE)
                  .then(cache => cache.put(request, responseClone));
              }
              return fetchResponse;
            });
        })
        .catch(() => {
          // Fallback para offline
          if (request.destination === 'image') {
            return new Response(`
              <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="200" fill="#f3f4f6"/>
                <text x="100" y="100" text-anchor="middle" fill="#6b7280">Offline</text>
              </svg>
            `, { headers: { 'Content-Type': 'image/svg+xml' } });
          }
        })
    );
    return;
  }

  // Strategy: Network First para API e páginas dinâmicas
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              // Retornar erro JSON para APIs
              return new Response(
                JSON.stringify({ 
                  error: 'Offline', 
                  message: 'Sem conexão com a internet' 
                }),
                { 
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
    return;
  }

  // Strategy: Stale While Revalidate para páginas
  event.respondWith(
    caches.match(request)
      .then(response => {
        const fetchPromise = fetch(request)
          .then(fetchResponse => {
            if (fetchResponse.ok) {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone));
            }
            return fetchResponse;
          })
          .catch(() => {
            // Fallback para página offline
            if (request.mode === 'navigate') {
              return caches.match('/offline.html') || 
                     new Response('Offline - Verifique sua conexão', { 
                       status: 503, 
                       headers: { 'Content-Type': 'text/html' } 
                     });
            }
          });

        return response || fetchPromise;
      })
  );
});

// Lidar com notificações push
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Instauto', body: event.data.text() };
    }
  }

  const options = {
    title: data.title || 'Instauto',
    body: data.body || 'Nova notificação',
    icon: '/logo-instauto.svg',
    badge: '/logo-instauto.svg',
    tag: data.tag || 'instauto-notification',
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      {
        action: 'view',
        title: 'Ver',
        icon: '/logo-instauto.svg'
      },
      {
        action: 'dismiss',
        title: 'Fechar'
      }
    ],
    data: data.data || {},
    timestamp: Date.now(),
    silent: false,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Instauto', options)
  );
});

// Lidar com cliques em notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  const { action, data } = event;
  
  if (action === 'dismiss') {
    return;
  }

  // Determinar URL baseado no tipo de notificação
  let url = '/';
  if (data && data.type) {
    switch (data.type) {
      case 'payment_approved':
      case 'payment_failed':
      case 'payment_pending':
        url = '/dashboard/financeiro';
        break;
      case 'appointment_confirmed':
      case 'appointment_cancelled':
        url = '/dashboard/agendamentos';
        break;
      case 'diagnostic_completed':
        url = '/motorista/diagnostico';
        break;
      case 'new_message':
        url = '/mensagens';
        break;
      default:
        url = data.url || '/';
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Verificar se já existe uma janela aberta
        const client = clientList.find(c => c.url.includes(self.location.origin));
        
        if (client) {
          // Focar na janela existente e navegar
          return client.focus().then(() => {
            return client.navigate(url);
          });
        } else {
          // Abrir nova janela
          return clients.openWindow(url);
        }
      })
      .catch(error => {
        console.error('Service Worker: Error handling notification click', error);
      })
  );
});

// Lidar com fechamento de notificações
self.addEventListener('notificationclose', (event) => {
  console.log('Service Worker: Notification closed', event);
  
  // Analytics ou tracking aqui se necessário
});

// Background Sync (para quando voltar online)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'sync-notifications') {
    event.waitUntil(syncNotifications());
  }
  
  if (event.tag === 'sync-diagnostics') {
    event.waitUntil(syncDiagnostics());
  }
});

// Sync de notificações quando voltar online
async function syncNotifications() {
  try {
    console.log('Service Worker: Syncing notifications...');
    
    // Buscar notificações pendentes da IndexedDB ou localStorage
    // e tentar enviá-las quando voltar online
    
    const response = await fetch('/api/notifications/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      console.log('Service Worker: Notifications synced successfully');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing notifications', error);
  }
}

// Sync de diagnósticos quando voltar online
async function syncDiagnostics() {
  try {
    console.log('Service Worker: Syncing diagnostics...');
    
    // Implementar sync de diagnósticos offline
    
  } catch (error) {
    console.error('Service Worker: Error syncing diagnostics', error);
  }
}

// Message handling para comunicação com o cliente
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Service Worker: Loaded successfully'); 