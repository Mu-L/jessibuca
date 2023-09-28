import { EventEmitter } from "eventemitter3";
import { Connection } from "./base";
export class DataChannelConnection extends Connection {
  constructor(public dc: RTCDataChannel) {
    super(dc.label);
  }
  async _connect(): Promise<void | ReadableStream<Uint8Array>> {
    return new ReadableStream({
      start: (controller) => {
        this.dc.onclose = () => {
          controller.close();
        };
        this.dc.onerror = (e) => {
          controller.error(e);
        };
        this.dc.onmessage = (evt) => {
          controller.enqueue(evt.data);
        };
      },
    });
  }
  _close() {
    this.dc.close();
  }
  _send(data: ArrayBufferLike | ArrayBufferView | string | Blob) {
    //@ts-ignore
    this.dc.send(data);
  }
}
export class WebRTCStream extends EventEmitter<{ change: [MediaStream], close: []; }>{
  private _mediaStream?: MediaStream;
  public get mediaStream() {
    return this._mediaStream;
  }
  public set mediaStream(value: MediaStream | undefined) {
    this._mediaStream = value;
    if (value) this.emit("change", value);
  }
  audioTransceiver!: RTCRtpTransceiver;
  videoTransceiver!: RTCRtpTransceiver;
  private _videoTrack?: MediaStreamVideoTrack;
  private _audioTrack?: MediaStreamAudioTrack;
  constructor(public id: string, public direction: RTCRtpTransceiverDirection = "recvonly") {
    super();
  }
  set audioTrack(track: MediaStreamAudioTrack | undefined) {
    this._audioTrack = track;
    if (this._mediaStream) {
      const oldTrack = this._mediaStream.getAudioTracks()[0];
      if (oldTrack) this._mediaStream.removeTrack(oldTrack);
    }
    if (track) {
      if (!this._mediaStream) this._mediaStream = new MediaStream([track]);
      else this._mediaStream.addTrack(track);
    }
    if(this._mediaStream) this.emit("change", this._mediaStream);
  }
  get audioTrack() {
    return this._audioTrack || this._mediaStream?.getAudioTracks()[0];
  }
  set videoTrack(track: MediaStreamVideoTrack | undefined) {
    this._videoTrack = track;
    if (this._mediaStream) {
      const oldTrack = this._mediaStream.getVideoTracks()[0];
      if (oldTrack) this._mediaStream.removeTrack(oldTrack);
    }
    if (track) {
      if (!this._mediaStream) this._mediaStream = new MediaStream([track]);
      else this._mediaStream.addTrack(track);
    }
    if(this._mediaStream) this.emit("change", this._mediaStream);
  }
  get videoTrack(): MediaStreamVideoTrack | undefined {
    return this._videoTrack || this._mediaStream?.getVideoTracks()[0];
  }
  close() {
    this.emit("close");
  }
}
export class WebRTCConnection extends Connection {
  webrtc = new RTCPeerConnection(this.options.rtcConfig);
  streams = new Map<string, WebRTCStream>();
  videoTransceiver = new Array<RTCRtpTransceiver>();
  audioTransceiver = new Array<RTCRtpTransceiver>();
  async _connect() {
    const offer = await this.webrtc.createOffer();
    await this.webrtc.setLocalDescription(offer);
    const res = await fetch(this.url, {
      method: "POST",
      body: offer.sdp,
      ...(this.options.requestInit || {}),
    });
    const answer = await res.text();
    await this.webrtc.setRemoteDescription({ type: "answer", sdp: answer });
    this.webrtc.ontrack = ({ track, streams, transceiver }) => {
      console.log(track, streams, transceiver);
      if (streams.length) {
        const info = this.streams.get(streams[0].id);
        if (info && info.direction === "recvonly") {
          info.mediaStream = streams[0];
        }
      }
    };
    return new Promise<void>((resolve, reject) => {
      this.webrtc.onconnectionstatechange = (evt: Event) => {
        switch (this.webrtc.connectionState) {
          case "disconnected":
            this.disconnect(evt);
            break;
          case "connected":
            resolve();
            break;
          case "failed":
            reject(evt);
        }
      };
    });
  }
  addStream(stream: WebRTCStream) {
    if (this.audioTransceiver.length) {
      stream.audioTransceiver = this.audioTransceiver.pop()!;
      stream.audioTransceiver.direction = stream.direction;
    } else {
      stream.audioTransceiver = this.webrtc.addTransceiver(stream.audioTrack || 'audio', {
        direction: stream.direction
      });
    }
    if (this.videoTransceiver.length) {
      stream.videoTransceiver = this.videoTransceiver.pop()!;
      stream.videoTransceiver.direction = stream.direction;
    } else {
      stream.videoTransceiver = this.webrtc.addTransceiver(stream.videoTrack || 'video', {
        direction: stream.direction
      });
    }
    this.streams.set(stream.id, stream);
    return stream;
  }
  deleteStream(id: string) {
    const s = this.streams.get(id);
    if (s) {
      delete s.mediaStream;
      s.audioTransceiver.direction = "inactive";
      s.videoTransceiver.direction = "inactive";
      this.audioTransceiver.push(s.audioTransceiver);
      this.videoTransceiver.push(s.videoTransceiver);
      this.streams.delete(id);
    }
  }
  _close() {
    this.webrtc?.close();
  }
}
