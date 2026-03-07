import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationStorageService {
  private dbName = 'DeliveryManagementDB';
  private storeName = 'notifications';
  private notifications$ = new BehaviorSubject<any[]>([]);
  private db: IDBDatabase | null = null;

  constructor() {
    this.initDatabase();
  }

  private initDatabase(): void {
    const request = indexedDB.open(this.dbName, 1);

    request.onerror = () => {
      console.error('Database failed to open');
    };

    request.onsuccess = () => {
      this.db = request.result;
      this.loadNotifications();
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('timestamp', 'timestamp', { unique: false });
        objectStore.createIndex('read', 'read', { unique: false });
      }
    };
  }

  saveNotification(notification: any): void {
    if (!this.db) return;

    const notificationData = {
      title: notification.title || notification.notification?.title || 'Notification',
      body: notification.body || notification.notification?.body || '',
      timestamp: new Date().toISOString(),
      read: false,
      data: notification.data || {},
      icon: notification.icon || '/assets/icon.png'
    };

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const objectStore = transaction.objectStore(this.storeName);
    objectStore.add(notificationData);

    transaction.oncomplete = () => {
      this.loadNotifications();
    };
  }

  loadNotifications(): void {
    if (!this.db) {
      setTimeout(() => this.loadNotifications(), 100);
      return;
    }

    const transaction = this.db.transaction([this.storeName], 'readonly');
    const objectStore = transaction.objectStore(this.storeName);
    const request = objectStore.getAll();

    request.onsuccess = () => {
      const allNotifications = request.result.sort((a: any, b: any) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      this.notifications$.next(allNotifications);
    };
  }

  getNotifications(): Observable<any[]> {
    return this.notifications$.asObservable();
  }

  markAsRead(id: number): void {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const objectStore = transaction.objectStore(this.storeName);
    const request = objectStore.get(id);

    request.onsuccess = () => {
      const notification = request.result;
      notification.read = true;
      objectStore.put(notification);
    };

    transaction.oncomplete = () => {
      this.loadNotifications();
    };
  }

  deleteNotification(id: number): void {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const objectStore = transaction.objectStore(this.storeName);
    objectStore.delete(id);

    transaction.oncomplete = () => {
      this.loadNotifications();
    };
  }

  clearAllNotifications(): void {
    if (!this.db) return;

    const transaction = this.db.transaction([this.storeName], 'readwrite');
    const objectStore = transaction.objectStore(this.storeName);
    objectStore.clear();

    transaction.oncomplete = () => {
      this.loadNotifications();
    };
  }

  getUnreadCount(): Observable<number> {
    return new Observable(observer => {
      this.notifications$.subscribe(notifications => {
        const unreadCount = notifications.filter((n: any) => !n.read).length;
        observer.next(unreadCount);
      });
    });
  }
}
