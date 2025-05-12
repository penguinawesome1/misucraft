export interface AnimationFrameData {
  imageSrc: string;
  fps: number;
  frameCount: number;
}

export interface KeyAnimation {
  [key: string]: AnimationFrameData
}