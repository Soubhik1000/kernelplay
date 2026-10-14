# 🖼️ UI System *(New in v0.4.0)*

[← Back to README](../README.md) · [All docs](./README.md)

---

A full retained-mode UI layer that sits on top of your game canvas — panels, text, buttons, bars, inputs, and world-space labels, all themeable from one place.

## Global Theme

Override any theme value globally — every element inherits it, or reset back to defaults:

```js
game.ui.theme.set({
    primaryColor:    "#e63946",
    fontFamily:      "Press Start 2P, monospace",
    fontSize:        12,
    borderRadius:    4,
    backgroundColor: "#0a0a1a",
});

game.ui.theme.reset();
```

## Core Elements

Every element is created with `game.ui.add(new UIElement({...}))`, positioned with an `anchor` + `offset`, and styled per-instance via a `style` object.

```js
import { UIPanel, UIText, UIButton, UIImage, UIProgressBar, UICheckbox, UISlider, UIInputField } from "./ui/index.js";

// Panel — container / background box
const panel = game.ui.add(new UIPanel({
    anchor: "center", width: 300, height: 200,
    style: { surfaceColor: "#1a1a2e", borderColor: "#e63946", borderWidth: 2, borderRadius: 12 },
}));

// Text — label, update .text anytime
const label = game.ui.add(new UIText({
    text: "Score: 0", anchor: "topLeft", offset: { x: 20, y: 20 },
    style: { textColor: "#ffffff", fontSize: 18, fontWeight: "bold" },
}));
label.text = `Score: ${this.score}`;

// Button — onClick + disabled toggle
const btn = game.ui.add(new UIButton({
    label: "Play", anchor: "center", width: 160, height: 48,
    style: { primaryColor: "#4a90e2", hoverColor: "#5aa0f2", pressColor: "#3a80d2" },
}));
btn.onClick = () => game.sceneManager.startScene("Game");
btn.disabled = true;

// Image — sprite / icon
const icon = game.ui.add(new UIImage({
    src: "./assets/health_icon.png", anchor: "topLeft", offset: { x: 10, y: 10 }, width: 32, height: 32,
}));

// Progress Bar — health / loading, fills in any of 4 directions
const healthBar = game.ui.add(new UIProgressBar({
    value: 1.0, direction: "left", anchor: "topLeft", offset: { x: 20, y: 20 }, width: 200, height: 20,
    style: { progressTrackColor: "#333350", progressFillColor: "#e74c3c", borderRadius: 10 },
}));
healthBar.setValue(this.health / this.maxHealth);

// Checkbox — toggle option
const sfxToggle = game.ui.add(new UICheckbox({
    label: "Sound Effects", checked: true, anchor: "center", offset: { x: 0, y: -20 }, width: 200, height: 30,
}));
sfxToggle.onChange = (checked) => game.audio.setSFXVolume(checked ? 1 : 0);

// Slider — volume / sensitivity
const volumeSlider = game.ui.add(new UISlider({
    value: 0.8, min: 0, max: 1, showValue: true, anchor: "center", offset: { x: 0, y: 40 }, width: 220, height: 30,
}));
volumeSlider.onChange = (value) => game.audio.setMasterVolume(value);

// Input Field — text entry (set password: true for masked input)
const nameField = game.ui.add(new UIInputField({
    placeholder: "Enter your name...", maxLength: 20, anchor: "center", width: 260, height: 42,
}));
nameField.onSubmit = (value) => savePlayerName(value);
```

## UIImageButton — three modes

```js
// 1. Image background + label
new UIImageButton({ src: "./assets/btn.png", label: "Play" })

// 2. Icon only
new UIImageButton({ src: "./assets/settings_icon.png", label: null })

// 3. Sprite-sheet states — different region per state
new UIImageButton({
    src: "./assets/btn_sheet.png",
    states: {
        normal:   { x: 0,   y: 0, w: 160, h: 60 },
        hover:    { x: 160, y: 0, w: 160, h: 60 },
        press:    { x: 320, y: 0, w: 160, h: 60 },
        disabled: { x: 480, y: 0, w: 160, h: 60 },
    }
})
```

## UIBitmapText — pixel-font rendering from a sprite sheet

```js
const score = game.ui.add(new UIBitmapText({
    src: "./assets/font.png", text: "SCORE: 0",
    charWidth: 8, charHeight: 8, sheetCols: 16, charOffset: 32,
    scale: 3, spacing: 1, anchor: "topLeft", offset: { x: 20, y: 20 },
    tint: "#ffdd00",
}));

score.setText(`SCORE: ${this.score}`);
score.setTint("#ff0000");
```

## World Space UI

Set `screenSpace: false` and the element's `offset` becomes a world-space position that moves with the camera — great for name tags and boss labels:

```js
const nameTag = game.ui.add(new UIText({
    text: "Boss", screenSpace: false,
    offset: { x: enemy.transform.position.x, y: enemy.transform.position.y - 60 },
    style: { textColor: "#e74c3c", fontSize: 12 },
}));

update(dt) {
    nameTag.offset.x = this.transform.position.x;
    nameTag.offset.y = this.transform.position.y - 60;
}
```

## UILayers *(New in v0.4.1)*

## Default layers — always available, never need to create them:
```js
"World"   order: 0   — world space UI (damage numbers, name tags)
"HUD"     order: 10  — health bars, score, ammo
"Menu"    order: 20  — pause menu, settings
"Overlay" order: 30  — fades, popups, loading screens
```

```js
// default layers — no setup needed
game.ui.add(new UIProgressBar({ ... }), "HUD");
game.ui.add(new UIButton({ ... }),      "Menu");
game.ui.add(new UIText({ ... }),        "Overlay");

// custom layer
game.ui.addLayer("Minimap", 5);
game.ui.add(new UIImage({ ... }), "Minimap");

// control layers
game.ui.hideLayer("Menu");
game.ui.showLayer("Menu");
game.ui.lockLayer("HUD");      // HUD visible but not clickable
game.ui.toggleLayer("Menu");   // pause menu open/close
```

## UIRaycast — skip game input when UI is hit

```js
update(dt) {
    if (Mouse.wasPressed(MouseButton.Left)) {
        if (game.ui.raycast.isUIAt(Mouse.x, Mouse.y)) return; // UI consumed the click
        const hit = this.raycast(worldPos.x, worldPos.y);
    }
}
```

## Find, update & remove elements

```js
const btn = game.ui.find("UIButton");
btn.label = "Restart";
btn.onClick = () => restartGame();

game.ui.remove(btn);
game.ui.clear();   // clear all UI
```

## HUD example — health, score & pause button

```js
class HUD {
    constructor(game) {
        this.ui = game.ui;
        this.healthBar = this.ui.add(new UIProgressBar({
            anchor: "topLeft", offset: { x: 20, y: 20 }, width: 200, height: 18,
            style: { progressFillColor: "#e74c3c" },
        }));
        this.scoreLabel = this.ui.add(new UIText({
            text: "Score: 0", anchor: "topRight", offset: { x: 20, y: 20 },
            style: { fontSize: 16, fontWeight: "bold", textAlign: "right" },
        }));
        const pauseBtn = this.ui.add(new UIButton({
            label: "⏸", anchor: "topRight", offset: { x: 20, y: 60 }, width: 40, height: 40,
        }));
        pauseBtn.onClick = () => game.paused = !game.paused;
    }

    update(player) {
        this.healthBar.setValue(player.health / player.maxHealth);
        this.scoreLabel.text = `Score: ${player.score}`;
    }
}
```

## Anchor reference

```
"topLeft"       "topCenter"       "topRight"
"middleLeft"    "center"          "middleRight"
"bottomLeft"    "bottomCenter"    "bottomRight"
```

`offset: { x, y }` — pixel offset from that anchor point inward.
