import { Component } from "../Component.js";

export class AudioListener extends Component {
    init() {
        

        // 🔥 register as active listener

        // this.entity.scene.game.audio.listener = this.transform.position;
    }

    onStart() {
        this.camera = this.entity.getComponent("camera");
        // console.log(this.entity);
        this.entity.scene.game.audio.listener = this.camera.position;
    }

    update(dt) {
        // console.log('hi');
        
        // 🔥 keep listener position updated
        // this.entity.scene.game.audio.listener = this.transform.position;
        const audio = this.entity.scene.game.audio;
        const pos = this.camera.position;
        // console.log(pos);

        // 🔥 COPY values (NOT reference)
        audio.listener = {
            x: pos.x,
            y: pos.y
        };
    }
}