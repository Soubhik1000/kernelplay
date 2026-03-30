import { Component } from "../Component.js";

export class AnimatorComponent extends Component {
  constructor(props = {}) {
    super();
    
    const {
      animations = {},      // { animName: { frames: [...], frameRate: 10, loop: true } }
      defaultAnimation = null,
      autoPlay = true
    } = props;
    
    this.animations = animations;
    this.defaultAnimation = defaultAnimation;
    this.autoPlay = autoPlay;
    
    // State
    this.currentAnimation = null;
    this.currentFrame = 0;
    this.frameTime = 0;
    this.isPlaying = false;
    this.loop = true;
    
    // Callbacks
    this.onAnimationEnd = null;
  }
  
  init() {
    // this.sprite = this.entity.getComponent("sprite");
    this.sprite = this.entity.getComponent("renderer");
    
    if (!this.sprite) {
      console.warn("AnimatorComponent requires SpriteComponent");
      return;
    }
    
    if (this.autoPlay && this.defaultAnimation) {
      this.play(this.defaultAnimation);
    }
  }
  
  update(dt) {
    if (!this.isPlaying || !this.currentAnimation) return;
    
    const anim = this.animations[this.currentAnimation];
    if (!anim) return;
    
    const frameRate = anim.frameRate || 10;
    const frameDuration = 1 / frameRate;
    
    this.frameTime += dt;
    
    if (this.frameTime >= frameDuration) {
      this.frameTime -= frameDuration;
      this.currentFrame++;
      
      // Check if animation finished
      if (this.currentFrame >= anim.frames.length) {
        if (anim.loop !== undefined ? anim.loop : this.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = anim.frames.length - 1;
          this.isPlaying = false;
          
          if (this.onAnimationEnd) {
            this.onAnimationEnd(this.currentAnimation);
          }
          return;
        }
      }
      
      // Update sprite frame
      this._applyFrame();
    }
  }
  
  _applyFrame() {
    const anim = this.animations[this.currentAnimation];
    const frame = anim.frames[this.currentFrame];
    
    if (typeof frame === 'object') {
      // Frame is { x, y, width, height }
      this.sprite.setFrame(frame.x, frame.y, frame.width, frame.height);
    } else {
      // Frame is index in grid
      const gridWidth = anim.gridWidth || 1;
      const frameWidth = anim.frameWidth || this.sprite.width;
      const frameHeight = anim.frameHeight || this.sprite.height;
      
      const col = frame % gridWidth;
      const row = Math.floor(frame / gridWidth);
      
      this.sprite.setFrame(
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight
      );
    }
  }
  
  // Play animation
  play(animationName, reset = true) {
    if (!this.animations[animationName]) {
      console.warn(`Animation "${animationName}" not found`);
      return;
    }
    
    if (this.currentAnimation === animationName && !reset) {
      this.isPlaying = true;
      return;
    }
    
    this.currentAnimation = animationName;
    this.currentFrame = 0;
    this.frameTime = 0;
    this.isPlaying = true;
    
    this._applyFrame();
  }
  
  // Stop animation
  stop() {
    this.isPlaying = false;
  }
  
  // Pause animation
  pause() {
    this.isPlaying = false;
  }
  
  // Resume animation
  resume() {
    this.isPlaying = true;
  }
  
  // Add animation at runtime
  addAnimation(name, config) {
    this.animations[name] = config;
  }
  
  // Check if animation is playing
  isAnimationPlaying(name) {
    return this.isPlaying && this.currentAnimation === name;
  }
  
  toJSON() {
    return {
      type: "AnimatorComponent",
      animations: this.animations,
      defaultAnimation: this.defaultAnimation,
      autoPlay: this.autoPlay
    };
  }
  
  static fromJSON(data) {
    return new AnimatorComponent(data);
  }
}