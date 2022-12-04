import {
  VideoDecoderConfig,
  VideoDecoderInterface,
  VideoDecoderEvent,
} from "./types";
import { ChangeState, FSM, Includes } from "afsm";
export class VideoDecoderHard extends FSM implements VideoDecoderInterface {
  decoder!: VideoDecoder;
  config?: VideoDecoderConfig;
  @ChangeState([FSM.INIT, "closed"], "initialized")
  async initialize() {
    this.decoder = new VideoDecoder({
      output: (frame) => {
        this.emit(VideoDecoderEvent.VideoFrame, frame);
      },
      error: (err) => {
        this.close();
        this.emit(VideoDecoderEvent.Error, err);
      },
    });
  }
  @ChangeState("initialized", "configured")
  configure(config: VideoDecoderConfig): void {
    this.config = config;
    this.decoder.configure({
      codec: config.codec,
      description: config.extraData,
    });
  }
  @Includes("configured")
  decode(packet: EncodedVideoChunkInit): void {
    if (this.decoder.state === "configured")
      this.decoder.decode(new EncodedVideoChunk(packet));
  }
  flush(): void {
    this.decoder.flush();
  }
  @ChangeState([], FSM.INIT)
  reset(): void {
    this.decoder.reset();
  }
  @ChangeState([], "closed", { ignoreError: true })
  close(): void {
    this.decoder.close();
  }
}
