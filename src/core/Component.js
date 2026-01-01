export class Component {
  constructor() {
    this.entity = null; // reference to parent entity
    this.enabled = true;
  }

  init() {}   // called when added to entity
  onAttach() {}
  onStart() {}
  update(dt) {} // called every frame
  render(ctx) {} // called every frame
  lateUpdate(dt) {}
  onDestroy() {}
}
