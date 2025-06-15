
/// <reference types="vite/client" />

// Manually declare types for Web APIs that might not be in the default TS lib.

// Part of the WebCodecs API, needed for useWebcamStream.
interface VideoFrame extends CanvasImageSource {
  readonly displayWidth: number;
  readonly displayHeight: number;
  close(): void;
}

// Part of the Insertable Streams for MediaStreamTrack API, needed for useWebcamStream.
declare class MediaStreamTrackProcessor<T = VideoFrame> {
  constructor(init: { track: MediaStreamTrack });
  readonly readable: ReadableStream<T>;
}
