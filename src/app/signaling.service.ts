import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class SignalingService {

  private socket: Socket;

  constructor(private http: HttpClient) {
    let  Url = environment.serverUrl;
    this.socket = io(Url, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });
    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('message', (message) => {
      console.log('Message received:', message);
      // Display the message in the UI
    });
  }

  
  sendSignal(signal: any) {
    this.socket.emit('signal', signal);
  }

  onSignal(callback: (signal: any) => void) {
    this.socket.on('signal', callback);
  }

  SendMessage(json:any,userId:any):Observable<any>
  {
    return this.http.post(`${environment.serverUrl}/message/${userId}`,json);
  }

  GetAllUsers():Observable<any>
  {
    return this.http.get(`${environment.serverUrl}/UserList`);
  }


}
