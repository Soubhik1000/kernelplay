export class SceneManager {
  constructor() {
    this.scenes = {};
    this.currentScene = null;
  }

  addScene(scene) {
    this.scenes[scene.name] = scene;
    return scene;
  }

  removeScene(name) {
    delete this.scenes[name];
  }

  startScene(name) {
    const scene = this.scenes[name];
    if (!scene) {
      console.warn(`Scene "${name}" not found`);
      return;
    }
    this.currentScene = scene;
    if (scene.init) scene.init();
  }

  update(dt) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(dt);
    }
  }

  render() {
    if (this.currentScene && this.currentScene.render) {
      this.currentScene.render();
    }
  }
}
