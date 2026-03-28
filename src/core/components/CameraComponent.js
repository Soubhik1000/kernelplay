// src/components/CameraComponent.js
import { Component } from "../Component.js";

export class CameraComponent extends Component {
  constructor(options = {}) {
    super();
    
    const {
      width = 800,
      height = 600,
      target = null,           // Entity to follow
      followSpeed = 5,         // Lerp speed for smooth follow
      offset = { x: 0, y: 0, z: 0 },  // Offset from target
      bounds = null,           // World boundaries { minX, maxX, minY, maxY }
      zoom = 1,                // Camera zoom level
      isPrimary = true         // Is this the main camera?
    } = options;
    
    this.width = width;
    this.height = height;
    this.target = target;           // Can be set to another entity
    this.followSpeed = followSpeed;
    this.offset = offset;
    this.bounds = bounds;
    this.zoom = zoom;
    this.isPrimary = isPrimary;
    
    // Camera position (independent of entity transform)
    this.position = { x: 0, y: 0, z: 0 };
    
    // Viewport calculations
    this._viewBounds = {
      x: 0,
      y: 0,
      width: width,
      height: height
    };
    
    this._dirty = true;
  }
  
  init() {
    this.transform = this.entity.getComponent("transform");
    
    // Register as primary camera if needed
    if (this.isPrimary && this.entity.scene) {
      this.entity.scene.primaryCamera = this;
    }
  }
  
  update(dt) {
    // Follow target entity
    if (this.target && this.target.active) {
      const targetTransform = this.target.getComponent("transform");
      if (targetTransform) {
        const targetPos = targetTransform.position;
        
        // Smooth follow with lerp
        const lerp = this.followSpeed * dt;
        this.position.x += (targetPos.x + this.offset.x - this.position.x) * lerp;
        this.position.y += (targetPos.y + this.offset.y - this.position.y) * lerp;
        this.position.z += (targetPos.z + this.offset.z - this.position.z) * lerp;
      }
    } else {
      // Use entity's transform if no target
      if (this.transform) {
        this.position.x = this.transform.position.x;
        this.position.y = this.transform.position.y;
        this.position.z = this.transform.position.z;
      }
    }

    // 🔥 ADD THIS - Apply camera shake
    if (this._shakeDuration && this._shakeTime < this._shakeDuration) {
        this._applyShake(dt);
    }
    
    // Apply bounds clamping
    if (this.bounds) {
      const halfWidth = (this.width / this.zoom) / 2;
      const halfHeight = (this.height / this.zoom) / 2;
      
      this.position.x = Math.max(
        this.bounds.minX + halfWidth,
        Math.min(this.bounds.maxX - halfWidth, this.position.x)
      );
      
      this.position.y = Math.max(
        this.bounds.minY + halfHeight,
        Math.min(this.bounds.maxY - halfHeight, this.position.y)
      );
    }
    
    this._updateViewBounds();
  }
  
  _updateViewBounds() {
    const halfWidth = (this.width / this.zoom) / 2;
    const halfHeight = (this.height / this.zoom) / 2;
    
    this._viewBounds.x = this.position.x - halfWidth;
    this._viewBounds.y = this.position.y - halfHeight;
    this._viewBounds.width = this.width / this.zoom;
    this._viewBounds.height = this.height / this.zoom;
    
    this._dirty = false;
  }
  
  get viewBounds() {
    if (this._dirty) this._updateViewBounds();
    return this._viewBounds;
  }
  
  // World to screen conversion
  worldToScreen(worldX, worldY) {
    return {
      x: (worldX - this.viewBounds.x) * this.zoom,
      y: (worldY - this.viewBounds.y) * this.zoom
    };
  }
  
  // Screen to world conversion
  screenToWorld(screenX, screenY) {
    return {
      x: (screenX / this.zoom) + this.viewBounds.x,
      y: (screenY / this.zoom) + this.viewBounds.y
    };
  }
  
  // Check if point is in view
  isInView(x, y) {
    const bounds = this.viewBounds;
    return (
      x >= bounds.x &&
      x <= bounds.x + bounds.width &&
      y >= bounds.y &&
      y <= bounds.y + bounds.height
    );
  }
  
  // Set target to follow
  setTarget(entity) {
    this.target = entity;
  }
  
  // Shake effect
  shake(intensity = 10, duration = 0.3) {
    // console.log("dddd.....");
    
    this._shakeIntensity = intensity;
    this._shakeDuration = duration;
    this._shakeTime = 0;
  }
  
  _applyShake(dt) {
    if (this._shakeTime < this._shakeDuration) {
      this._shakeTime += dt;
      const progress = this._shakeTime / this._shakeDuration;
      const intensity = this._shakeIntensity * (1 - progress);
      
      this.position.x += (Math.random() - 0.5) * intensity;
      this.position.y += (Math.random() - 0.5) * intensity;
    }
  }
}