export class Component {
  constructor() {
    this.entity = null; // reference to parent entity
  }

  init() {}   // called when added to entity
  update(dt) {} // called every frame
  render(ctx) {} // called every frame
}
