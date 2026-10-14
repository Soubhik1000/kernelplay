# Sprite Management
Sprite sheets, atlases, and efficient sprite rendering.

[← Back to README](../README.md) · [All docs](./README.md)

---

The `SpriteComponent` is used to render 2D images and sprite sheets in your game. It supports positioning, scaling, rotation, flipping, transparency, and sprite sheet animations.

## 📦 Import

```js
import { SpriteComponent } from "kernelplay-js";
```

## ⚙️ Usage

Attach it to an entity to display an image:

```js
entity.addComponent("renderer", new SpriteComponent({
  image: "./assets/player.png",
  width: 64,
  height: 64
}));
```

## 🧾 Properties

### 🖼️ Image

- `image` (`string | Image`)
  Path to the image or an already loaded `Image` object.

### 📏 Size

- `width` (`number`) – Render width
- `height` (`number`) – Render height

### 🎞️ Sprite Sheet

- `sourceX` (`number`) – X position inside the sprite sheet
- `sourceY` (`number`) – Y position inside the sprite sheet
- `sourceWidth` (`number`) – Width of a frame
- `sourceHeight` (`number`) – Height of a frame

👉 If `sourceWidth` or `sourceHeight` is not set, the full image is used.

### ⚓ Anchor (Pivot)

- `anchor` (`{x, y}`)

Controls the origin point of the sprite:

| Value | Meaning |
|------|--------|
| `{x: 0, y: 0}` | Top-left |
| `{x: 0.5, y: 0.5}` | Center (default) |
| `{x: 1, y: 1}` | Bottom-right |

### 🔄 Flip

- `flipX` (`boolean`) – Flip horizontally
- `flipY` (`boolean`) – Flip vertically

### 🎨 Appearance

- `alpha` (`number`) – Transparency (0 to 1)
- `tint` (`string`) – Color tint *(optional)*

### 🧱 Layering

- `zIndex` (`number`) – Controls render order

## 🎞️ Sprite Sheet Example

```js
const sprite = new SpriteComponent({
  image: "./assets/player_sheet.png",
  sourceWidth: 64,
  sourceHeight: 64,
  width: 50,
  height: 50
});
```

## 🎬 Changing Frames

Use `setFrame()` to display a specific frame from a sprite sheet:

```js
sprite.setFrame(64, 0, 64, 64);
```

## 🔁 Flip Example

```js
sprite.flipX = true; // Mirror character
```

## 👻 Transparency Example

```js
sprite.alpha = 0.5; // 50% transparent
```

## 🎯 Full Example

```js
entity.addComponent("renderer", new SpriteComponent({
  image: "./assets/player_sheet.png",
  sourceWidth: 64,
  sourceHeight: 64,
  width: 50,
  height: 50,
  anchor: { x: 0.5, y: 0.5 },
  alpha: 1,
  flipX: false,
  zIndex: 10
}));
```

## 💡 Tips

- Use sprite sheets for animations (with an animator system)
- Keep `anchor` at `{0.5, 0.5}` for easier rotation
- Match `sourceWidth/Height` with your sprite sheet grid
- Use `flipX` instead of separate left/right sprites
