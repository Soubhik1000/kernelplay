import { Scene } from "../../../src/core/Scene.js";
import { TestPlayer } from "../prefabs/TestPlayer.js"

export class Level2 extends Scene {
  init() {
    this.addEntity(new TestPlayer());
  }
}
