export class Entity {
  constructor(name = "Entity") {
    this.name = name;
    this.components = {};
    this.active = true;
  }

  addComponent(name, component) {
    this.components[name] = component;
    component.entity = this;
    if (component.init) component.init();
    return component;
  }

  // If name is passed, return single component
  // If no name, return all components object
  getComponent(name) {
    if (name) return this.components[name];
    return this.components; // return all components
  }

  update(dt) {
    if (!this.active) return;
    for (const comp of Object.values(this.components)) {
      if (comp.update) comp.update(dt);
    }
  }

  render(ctx) {
    if (!this.active) return;
    for (const comp of Object.values(this.components)) {
      if (comp.render) comp.render(ctx);
    }
  }
}
