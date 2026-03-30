import { Component } from "../Component.js";

export class AudioListener extends Component {
    init() {
        this.transform = this.entity.getComponent("transform");

        // 🔥 register as active listener
        this.entity.scene.game.audio.listener = this.transform.position;
    }

    update() {
        // 🔥 keep listener position updated
        this.entity.scene.game.audio.listener = this.transform.position;
    }
}