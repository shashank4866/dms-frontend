importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAhSc0EZl-Ah1Af_YErhOx_0hFdBs1BXOI",
  authDomain: "fcm-demo-b8977.firebaseapp.com",
  projectId: "fcm-demo-b8977",
  messagingSenderId: "546938487296",
  appId: "1:546938487296:web:0b7cb06338df8929f28ee5"
});

const messaging = firebase.messaging();

// messaging.onBackgroundMessage(payload => {
//   self.registration.showNotification(
//     payload.notification.title,
//     {
//       body: payload.notification.body
//     }
//   );
// });


// Show background notification
messaging.onBackgroundMessage(payload => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      data: {
        url: payload.data?.url || '/home'
      }
    }
  );
});

// 🔥 Store message in IndexedDB (Background)
function saveNotificationToIndexedDB(payload) {
  const dbName = 'DeliveryManagementDB';
  const storeName = 'notifications';

  const request = indexedDB.open(dbName, 1);

  request.onsuccess = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.close();
      return;
    }

    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);

    const notificationData = {
      title: payload.notification.title || 'Notification',
      body: payload.notification.body || '',
      timestamp: new Date().toISOString(),
      read: false,
      data: payload.data || {},
      icon: payload.notification.icon || '/assets/icon.png'
    };

    objectStore.add(notificationData);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
      const objectStore = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('timestamp', 'timestamp', { unique: false });
      objectStore.createIndex('read', 'read', { unique: false });
    }
  };
}

// Show background notification
messaging.onBackgroundMessage(payload => {
  // Save to IndexedDB
  saveNotificationToIndexedDB(payload);

  // Show browser notification
self.registration.showNotification(
  payload.notification.title,
  {
    body: payload.notification.body,
    icon: "https://dmsfrontend.netlify.app/assets/dmsnotifi.png",
    data: {
      url: payload.data?.url || "/home"
    }
  }
);
});

// 🔥 Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Focus existing tab if open
        for (const client of clientList) {
          if (client.url.includes('/home')) {
            return client.focus();
          }
        }
        // Otherwise open new tab
        return clients.openWindow(targetUrl);
      })
  );
});
