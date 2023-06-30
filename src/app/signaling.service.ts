import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SignalingService {

  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });
 
  }

  sendSignal(signal: any) {
    this.socket.emit('signal', signal);
  }

  onSignal(callback: (signal: any) => void) {
    this.socket.on('signal', callback);
  }
}
