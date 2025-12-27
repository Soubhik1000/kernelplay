export class Scene {
  constructor(name = "Scene") {
    this.name = name;
  }

  init() {}    // called when scene starts
  update(dt) {} // called every frame
  render() {}   // called every frame
}
