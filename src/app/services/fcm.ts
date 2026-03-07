import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { ToastService } from './toast.service';
import { NotificationStorageService } from './notification-storage.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService {



  constructor(private http: HttpClient, private toast: ToastService, private notificationStorage: NotificationStorageService) {
    initializeApp(environment.firebase);

  }
      BASE = 'https://dms-backend-pm4s.onrender.com';

  notifi: any[] = [];
  requestPermission() {
    // Ask browser for Notification permission first (helps with autoplay policies)
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        const messaging = getMessaging();
        getToken(messaging, {
          vapidKey: 'BOMfvHsjgttyDmOd2taRnZyCjQ3ae8WAuZX0O7olPM_P4UXGgqvnypQNXnjl2Kc3wR-B4bSrusMRhxzV38oOO6g'
        }).then(token => {
          if (token) {
            console.log('FCM Token:', token);
            localStorage.setItem('fcmToken', token);
          }
        }).catch(err => console.error(err));
      } else {
        console.warn('Notification permission not granted:', permission);
      }
    }).catch(err => console.error('Notification permission request failed', err));
  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, payload => {
      console.log('Foreground message:', payload);
      const title = payload?.notification?.['title'] || payload?.data?.['title'] || 'Notification';
      const body = payload?.notification?.['body'] || payload?.data?.['body'] || JSON.stringify(payload);

      // Save to IndexedDB
      this.notificationStorage.saveNotification(payload);

      // Play a short notification sound (uses Web Audio API with an audio-file fallback)
      this.playNotificationSound();

      // Show toast in-app
      this.toast.show(body, title, 7000);
    });
  }

  private playNotificationSound() {
    try {
      // Prefer the user's audio file in assets (space encoded as %20)
      const audioFilePath = '/assets/Notification%20Sound.mp3';
      const audio = new Audio(audioFilePath);
      audio.volume = 1;
      audio.play().catch(() => {
        // If file playback fails (autoplay policy or missing file), fallback to Web Audio beep
        try {
          const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.value = 880; // frequency in Hz
            g.gain.value = 0.2; // volume
            o.connect(g);
            g.connect(ctx.destination);

            const startOscillator = () => {
              o.start();
              // fade out quickly
              g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
              o.stop(ctx.currentTime + 0.5);
            };

            // Some browsers require resuming the context after a user gesture
            if (ctx.state === 'suspended') {
              ctx.resume().then(startOscillator).catch(() => {/* ignore resume errors */ });
            } else {
              startOscillator();
            }
          }
        } catch (e) {
          // ignore fallback errors
        }
      });
    } catch (err) {
      console.error('Error playing notification sound', err);
    }
  }


  sendTokenToBackend(token: string, user_id: any) {
    return this.http.post(`${this.BASE}/save-token`, { user_fcm: token, user_id })
  }
}
