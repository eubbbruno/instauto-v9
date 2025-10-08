// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

// Configuração do Firebase (mesma do cliente)
const firebaseConfig = {
  apiKey: "AIzaSyBvOQhya1uHMZOESMGEF2h2hs6O4AM__aE",
  authDomain: "instauto-v7.firebaseapp.com",
  projectId: "instauto-v7",
  storageBucket: "instauto-v7.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
}

// Inicializar Firebase
firebase.initializeApp(firebaseConfig)

// Obter instância do messaging
const messaging = firebase.messaging()

// Handler para mensagens em background
messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem recebida em background:', payload)

  const notificationTitle = payload.notification?.title || 'InstaAuto'
  const notificationOptions = {
    body: payload.notification?.body || 'Nova notificação',
    icon: payload.notification?.icon || '/images/logo-of.svg',
    badge: '/images/logo-of.svg',
    image: payload.notification?.image,
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Abrir',
        icon: '/images/icons/open.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/images/icons/close.png'
      }
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
    tag: 'instauto-notification'
  }

  return self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handler para cliques na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event)
  
  event.notification.close()

  const action = event.action
  const data = event.notification.data || {}

  // Determinar URL baseada na ação e dados
  let url = '/'
  
  if (data.type === 'message') {
    url = '/mensagens'
  } else if (data.type === 'appointment') {
    url = '/agendamentos'
  } else if (data.type === 'payment') {
    url = '/pagamentos'
  } else if (data.url) {
    url = data.url
  }

  // Abrir ou focar na janela
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Verificar se já existe uma janela aberta
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Se não existe, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

// Handler para fechar notificação
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event)
  
  // Analytics ou logging se necessário
  const data = event.notification.data || {}
  if (data.trackClose) {
    // Enviar evento de fechamento
    fetch('/api/analytics/notification-closed', {
      method: 'POST',
      body: JSON.stringify({
        notificationId: data.id,
        timestamp: new Date().toISOString()
      })
    }).catch(console.error)
  }
})

// Handler para instalação do service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalado')
  self.skipWaiting()
})

// Handler para ativação do service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado')
  event.waitUntil(self.clients.claim())
})

// Handler para sincronização em background (opcional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Função de sincronização em background
async function doBackgroundSync() {
  try {
    // Sincronizar dados offline, enviar mensagens pendentes, etc.
    console.log('Executando sincronização em background')
    
    // Exemplo: enviar mensagens pendentes
    const pendingMessages = await getPendingMessages()
    for (const message of pendingMessages) {
      await sendMessage(message)
    }
  } catch (error) {
    console.error('Erro na sincronização em background:', error)
  }
}

// Funções auxiliares (implementar conforme necessário)
async function getPendingMessages() {
  // Implementar busca de mensagens pendentes no IndexedDB
  return []
}

async function sendMessage(message) {
  // Implementar envio de mensagem
  console.log('Enviando mensagem:', message)
}
