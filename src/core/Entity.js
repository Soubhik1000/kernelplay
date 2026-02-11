export class Entity {
  constructor(name = "Entity", tag = "Untagged") {
    this.name = name;
    this.components = {};
    this._componentCache = Object.create(null);
    this.active = true;

    this.tag = tag;
    this.layer = 0; // Default layer
    this.started = false;
  }

  // addComponent(name, component) {
  //   this.components[name] = component;
  //   component.entity = this;

  //   if (component.init) component.init();
  //   if (component.onAttach) {
  //     component.onAttach();
  //   }
  //   return component;
  // }


  addComponent(name, component) {
    this.components[name] = component;
    this._componentCache[name] = component; // 🔥
    component.entity = this;

    if (component.init) component.init();
    if (component.onAttach) component.onAttach();

    return component;
  }


  // If name is passed, return single component
  // If no name, return all components object
  // getComponent(name) {
  //   if (name) return this.components[name];
  //   return this.components; // return all components
  // }

  getComponent(name) {
    // FAST PATH
    let comp = this._componentCache[name];
    if (comp) return comp;

    // fallback to main map
    comp = this.components[name];
    if (comp) {
      this._componentCache[name] = comp;
    }

    return comp;
  }

  removeComponent(name) {
    delete this.components[name];
    delete this._componentCache[name];
  }


  _start() {
    if (this.started) return;
    this.started = true;

    for (const comp of Object.values(this.components)) {
      if (comp.enabled && comp.onStart) {
        comp.onStart();
      }
    }
  }

  update(dt) {
    if (!this.active) return;
    for (const comp of Object.values(this.components)) {
      // Script start hook
      // if (comp._internalStart) comp._internalStart();

      if (comp.update) comp.update(dt);
    }
  }

  lateUpdate(dt) {
    for (const comp of Object.values(this.components)) {
      if (comp.enabled && comp.lateUpdate) {
        comp.lateUpdate(dt);
      }
    }
  }

  destroy() {
    for (const comp of Object.values(this.components)) {
      if (comp.enabled && comp.onDestroy) {
        comp.onDestroy();
      }
    }

    this._destroyed = true;
  }


  render(obj) {
    if (!this.active) return;
    for (const comp of Object.values(this.components)) {
      if (comp.render) comp.render(obj);
    }
  }

  hasTag(tag) {
    return this.tag === tag;
  }

  isLayer(layer) {
    return this.layer === layer;
  }

  reset() {
    this.name = "Entity";
    this.tag = "Untagged";
    this.active = true;
    this.started = false;
    this.layer = 0;
    this._destroyed = false;

    this.components = {};
    this._componentCache = Object.create(null);
  }
}
