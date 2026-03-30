// utils/Spritesheet.js
export class Spritesheet {
  static generateGridFrames(rows, cols, startIndex = 0, count = null) {
    const frames = [];
    const total = count || (rows * cols);
    
    for (let i = 0; i < total; i++) {
      frames.push(startIndex + i);
    }
    
    return frames;
  }
  
  static generateAnimation(config) {
    const {
      startFrame = 0,
      frameCount,
      frameRate = 10,
      loop = true,
      gridWidth,
      frameWidth,
      frameHeight
    } = config;
    
    return {
      frames: this.generateGridFrames(1, frameCount, startFrame),
      frameRate,
      loop,
      gridWidth,
      frameWidth,
      frameHeight
    };
  }
}

// Usage
// import { Spritesheet } from "./utils/Spritesheet.js";

// player.addComponent("animator", new AnimatorComponent({
//   animations: {
//     idle: Spritesheet.generateAnimation({
//       startFrame: 0,
//       frameCount: 4,
//       frameRate: 8,
//       gridWidth: 8,
//       frameWidth: 32,
//       frameHeight: 32
//     }),
//     walk: Spritesheet.generateAnimation({
//       startFrame: 8,
//       frameCount: 6,
//       frameRate: 12,
//       gridWidth: 8,
//       frameWidth: 32,
//       frameHeight: 32
//     })
//   },
//   defaultAnimation: "idle",
//   autoPlay: true
// }));