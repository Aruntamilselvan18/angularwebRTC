import { Component, ElementRef, ViewChild } from '@angular/core';
import { CallService, PeerConnectionClientSettings, StreamService } from 'ngx-webrtc';
import { SignalingService } from './signaling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('videoStreamNodePeer1', { static: false }) videoStreamNodePeer1!: ElementRef;
  @ViewChild('videoStreamNodePeer2', { static: false }) videoStreamNodePeer2!: ElementRef;

  constructor(
    public callService: CallService,
    public streamService: StreamService,
    public socket:SignalingService
  ) { }

  async initConnection() {

    const stream = await this.streamService.tryGetUserMedia();
    const settings: PeerConnectionClientSettings = {
      peerConnectionConfig: {
        iceServers: this.callService.defaultServers,
      }
    };
    const pclient1 = await this.callService.createPeerClient(settings);
    const pclient2 = await this.callService.createPeerClient(settings);

    pclient1.addStream(stream);
    pclient2.addStream(stream);

    pclient1.signalingMessage.subscribe((m: any) => {
      pclient2.receiveSignalingMessage(m);
    });

    pclient2.signalingMessage.subscribe((m: any) => {
      pclient1.receiveSignalingMessage(m);
    });


    pclient1.remoteStreamAdded.subscribe((stream: any) => {
      this.streamService.setStreamInNode(this.videoStreamNodePeer1.nativeElement, stream.track);
    });

    pclient2.remoteStreamAdded.subscribe((stream: any) => {
      this.streamService.setStreamInNode(this.videoStreamNodePeer2.nativeElement, stream.track);
    });

    pclient2.startAsCallee();
    pclient1.startAsCaller();

  }


  Hitrequest(){
    let abc= 'abc'
    this.socket.sendSignal(abc);
  }
}
