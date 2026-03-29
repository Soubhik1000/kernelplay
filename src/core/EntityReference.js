// EntityReference.js
export class EntityReference {
  constructor(entityId = null) {
    this.entityId = entityId;
    this._resolved = null;
    this._scene = null;
  }
  
  resolve(scene) {
    if (!scene) return null;
    this._scene = scene;
    
    if (this._resolved && this._resolved.id === this.entityId) {
      return this._resolved;
    }
    
    this._resolved = scene.findById(this.entityId);
    return this._resolved;
  }
  
  get(scene) {
    return this.resolve(scene);
  }
  
  // 🔥 Allow chaining: ref(2).getComponent("transform")
  getComponent(componentName) {
    if (!this._resolved) {
      console.warn(`EntityReference: Cannot get component before resolving`);
      return null;
    }
    return this._resolved.getComponent(componentName);
  }
  
  toJSON() {
    return { entityId: this.entityId };
  }
  
  static fromJSON(data) {
    return new EntityReference(data.entityId);
  }
}

// 🔥 Shorthand helper
export function ref(entityId) {
  return new EntityReference(entityId);
}