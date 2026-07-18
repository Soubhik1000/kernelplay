import { Game, Scene, Entity, TransformComponent, BoxRenderComponent, CameraComponent, ScriptComponent, Keyboard, KeyCode} from "kernelplay-js";
import { 
    UIPanel, 
    UIText, 
    UIButton, 
    UIImage, 
    UIProgressBar,
    UICheckbox,
    UISlider,
    UIInputField,
} from "kernelplay-js";

// function base
const game = new Game({width: 800, height: 600, fps: 60});

const camera = new Entity("MainCamera");

camera.addComponent("transform", new TransformComponent({ position: { x: 400, y: 300, z: 0 } }));
camera.addComponent("camera", new CameraComponent({width: game.config.width, height: game.config.height, isPrimary: true}));

const myScript = {
  onStart() {
    console.log(this);
    this.transform = this.entity.getComponent("transform");
    this.speed = 200;
  },
  update(dt) {
    if(Keyboard.isPressed(KeyCode.W) || Keyboard.isPressed(KeyCode.ArrowUp)){
      this.transform.position.y -= this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.S) || Keyboard.isPressed(KeyCode.ArrowDown)){
      this.transform.position.y += this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.A) || Keyboard.isPressed(KeyCode.ArrowLeft)){
      this.transform.position.x -= this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.D) || Keyboard.isPressed(KeyCode.ArrowRight)){
      this.transform.position.x += this.speed*dt;
    }

    // console.log(this.game.playerNameTag.offset.x);
    this.game.playerNameTag.offset.x = this.transform.position.x - 50;
    this.game.playerNameTag.offset.y = this.transform.position.y - 60;
  }
}

const box = new Entity();
box.addComponent("transform", new TransformComponent({ position: { x: 300, y: 200 } }));
box.addComponent("renderer", new BoxRenderComponent({ color: "red" }));
box.addComponent("script", new ScriptComponent(myScript));

const MyScene = new Scene("Main");
MyScene.addEntity(camera);
MyScene.addEntity(box);

// console.log(MyScene);

game.sceneManager.addScene(MyScene);
game.sceneManager.startScene("Main");

const panel = game.ui.add(new UIPanel({
    anchor: "middleRight",
    offset: { x: 10, y: 0 },
    width:  350,
    height: 580,
    zIndex: 0,

    // per-element style overrides
    style: {
        surfaceColor: "#1a1a2e7c",
        // borderColor:  "#e63946",
        borderWidth:  2,
        borderRadius: 12,
    },
}));

game.ui.add(new UIText({
    text:   "Input Example",
    anchor: "topRight",
    offset: { x: 240, y: 10 },
    style: {
        textColor:  "#ffffff",
        fontSize:   17,
        fontWeight: "bolder",
    },
}));

const label = game.ui.add(new UIText({
    text:   "Example Text",
    anchor: "topRight",
    offset: { x: 130, y: 45 },
    style: {
        textColor:  "#000000",
        fontSize:   30,
        fontWeight: "bolder",
    },
}));

const nameField = game.ui.add(new UIInputField({
    placeholder: "Enter your name...",
    value:       "Example Text",
    maxLength:   20,
    anchor:      "topRight",
    offset:      { x: 50, y: 90 },
    width:       260,
    height:      42,
}));

const btn = game.ui.add(new UIButton({
    label:  "Login",
    anchor: "topRight",
    offset: { x: 100, y: 150 },
    width:  160,
    height: 48,
    zIndex: 1,
    style: {
        primaryColor: "#0655b0",
        hoverColor:   "#3a689d",
        pressColor:   "#1f4572",
        fontSize:     16,
        fontWeight:   "bold",
    },
}));

btn.onClick = () => {
    label.text = nameField.value;
};

game.ui.add(new UIText({
    text:   "Health Bar Example",
    anchor: "topRight",
    offset: { x: 220, y: 210 },
    style: {
        textColor:  "#ffffff",
        fontSize:   17,
        fontWeight: "bolder",
    },
}));

const healthBar1 = game.ui.add(new UIProgressBar({
    value:     1.0,          // 1.0 = full
    direction: "left",       // fills left → right
    anchor:    "middleRight",
    offset:    { x: 80, y: 0 },
    width:     200,
    height:    20,
    showText:  false,
    style: {
        progressTrackColor: "#333350",
        progressFillColor:  "#e74c3c",   // red health bar
        borderRadius:       10,
    },
}));

const healthBar2 = game.ui.add(new UIProgressBar({
    value:     1.0,          // 1.0 = full
    direction: "right",       // fills left → right
    anchor:    "middleRight",
    offset:    { x: 80, y: 30 },
    width:     200,
    height:    20,
    showText:  false,
    style: {
        progressTrackColor: "#333350",
        progressFillColor:  "#e74c3c",   // red health bar
        borderRadius:       10,
    },
}));

const healthBar3 = game.ui.add(new UIProgressBar({
    value:     1.0,          // 1.0 = full
    direction: "up",       // fills left → right
    anchor:    "middleRight",
    offset:    { x: 40, y: 0 },
    width:     20,
    height:    100,
    showText:  false,
    style: {
        progressTrackColor: "#333350",
        progressFillColor:  "#e74c3c",   // red health bar
        borderRadius:       10,
    },
}));

const healthBar4 = game.ui.add(new UIProgressBar({
    value:     1.0,          // 1.0 = full
    direction: "down",       // fills left → right
    anchor:    "middleRight",
    offset:    { x: 300, y: 0 },
    width:     20,
    height:    100,
    showText:  false,
    style: {
        progressTrackColor: "#333350",
        progressFillColor:  "#e74c3c",   // red health bar
        borderRadius:       10,
    },
}));

const volumeSlider = game.ui.add(new UISlider({
    value:     1,
    min:       0,
    max:       1,
    showValue: true,
    anchor:    "middleRight",
    offset:    { x: 70, y: 60 },
    width:     220,
    height:    30,
}));

volumeSlider.onChange = (value) => {
    // healthBar.value = value;
    healthBar1.setValue(value);
    healthBar2.setValue(value);
    healthBar3.setValue(value);
    healthBar4.setValue(value);
};

game.ui.add(new UIText({
    text:   "Icon Example",
    anchor: "topRight",
    offset: { x: 245, y: 380 },
    style: {
        textColor:  "#ffffff",
        fontSize:   17,
        fontWeight: "bolder",
    },
}));

const Toggle = game.ui.add(new UICheckbox({
    label:   "Change the Image",
    checked: true,
    anchor:  "middleRight",
    offset:  { x: 60, y: 140 },
    width:   200,
    height:  30,
}));


const icon1 = game.ui.add(new UIImage({
    src: "./assets/Pic1.jpg",
    anchor: "middleRight",
    offset: { x: 125, y: 220 },
    width:  130,
    height: 130,
}));

const icon2 = game.ui.add(new UIImage({
    src: "./assets/Pic2.jpg",
    anchor: "middleRight",
    visible: false,
    offset: { x: 125, y: 220 },
    width:  130,
    height: 130,
}));

Toggle.onChange = (checked) => {
    icon1.visible = checked;
    icon2.visible = !checked;
};

const playerNameTag = game.ui.add(new UIText({
    text:        "Player",
    screenSpace: true,
    offset:      { x: 100, y: 100 },
    style: { textColor: "#e74c3c", fontSize: 20 },
}));

game.playerNameTag = playerNameTag;

game.start();