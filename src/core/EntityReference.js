// EntityReference.js
export class EntityReference {
  constructor(entityId = null) {
    this.entityId = entityId;  // Store ID, not direct reference
    this._resolved = null;      // Cached entity reference
  }
  
  // Resolve ID to actual entity
  resolve(scene) {
    if (this._resolved && this._resolved.id === this.entityId) {
      return this._resolved;
    }
    
    this._resolved = scene.findById(this.entityId);
    return this._resolved;
  }
  
  // Get the entity (auto-resolve)
  get(scene) {
    return this.resolve(scene);
  }
  
  // Serialize to JSON
  toJSON() {
    return { entityId: this.entityId };
  }
  
  // Deserialize from JSON
  static fromJSON(data) {
    return new EntityReference(data.entityId);
  }
}