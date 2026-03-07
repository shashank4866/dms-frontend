import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationStorageService } from '../../services/notification-storage.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.html',
  styleUrls: ['./notification-center.css'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationCenterComponent implements OnInit {
  @ViewChild('notificationDropdown') notificationDropdown!: ElementRef;

  notifications: any[] = [];
  unreadCount: number = 0;
  showDropdown: boolean = false;

  constructor(private notificationStorage: NotificationStorageService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.notificationStorage.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
    });
  }

  loadNotifications(): void {
    this.notificationStorage.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
    });
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown(): void {
    this.showDropdown = false;
  }

  markAsRead(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationStorage.markAsRead(id);
  }

  deleteNotification(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationStorage.deleteNotification(id);
  }

  clearAll(event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to clear all notifications?')) {
      this.notificationStorage.clearAllNotifications();
    }
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - notificationTime.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}
