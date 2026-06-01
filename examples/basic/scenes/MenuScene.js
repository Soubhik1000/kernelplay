import { Scene } from "../../../src/index.js";
import { Keyboard } from "../../../src/index.js";
import { UIText } from "../../../src/index.js";
import { UIButton } from "../../../src/index.js";
import { UICheckbox } from "../../../src/index.js";
import { UISlider } from "../../../src/index.js";
import { UIInputField } from "../../../src/index.js";

export class MenuScene extends Scene {
  init() {
    this.ctx = this.game.renderer.ctx; // use Game's single canvas
    console.log(this);

    this.Text = this.game.ui.add(new UIText({
      text: `Press Enter to Start Level 1`,
      anchor: "center",
      offset: { x: 0, y: -70 },
      style: {
        textColor: "#1d1d1d",
        fontSize: 40,
        fontWeight: "bold",
      },
    }));

    const btn = this.game.ui.add(new UIButton({
      label: "Play",
      anchor: "center",
      offset: { x: 0, y: 0 },
      width: 260,
      height: 48,
      zIndex: 1,
      style: {
        primaryColor: "#e81e1e",
        hoverColor: "#e65555",
        pressColor: "#ff0000",
        fontSize: 20,
        fontWeight: "bold",
      },
    }));

    btn.onClick = () => {
      console.log("Play clicked!");
      this.game.sceneManager.startScene("Level1");
    };

  }

  update(dt) {
    if (Keyboard.isPressed("Enter")) {
      this.game.sceneManager.startScene("Level1");
    }
  }

  // render() {
  //   const { width, height } = this.game.config;
  //   this.ctx.clearRect(0, 0, width, height);
  //   this.ctx.fillStyle = "black";
  //   this.ctx.font = "24px Arial";
  //   this.ctx.fillText("Press Enter to Start Level 1", 50, height / 2);
  // }
}