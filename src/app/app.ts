import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FcmService } from './services/fcm';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('DeliveryManagment');

  constructor(private fcmService: FcmService) { }

  ngOnInit() {
    this.fcmService.requestPermission();
    this.fcmService.listen();
  }
}
