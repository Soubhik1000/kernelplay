# Game Configuration

[← Back to README](../README.md) · [All docs](./README.md)

---

## Using a CSS selector

```js
const game = new MyGame({
  width: 800,
  height: 600,
  container: "#game-container",
});
```

```html
<div id="game-container"></div>
```

The engine will find the element using the selector and append the game canvas to it.

---

Configure your game's rendering, update, and physics loops independently using the engine initialization object.

```js
const game = new MyGame({
  width: 800,
  height: 600,
  fps: 60,
  calcRate: 60,
  fixedRate: 60,
});
```

## Configuration Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| **`fps`** | `number` | Target frames per second for rendering visual updates. |
| **`calcRate`** | `number` | Frequency per second for standard game logic updates. |
| **`fixedRate`** | `number` | Frequency per second for physics and deterministic updates (fixed delta time). |

---

## Loop Rate Modifiers

Dynamically alter or query the execution frequencies of your rendering, standard logic calculation, and fixed physics loops during runtime.

### `setFPS(fps)`
Sets the target frames per second for rendering visual updates.
* **Arguments:** `fps` (`number`) — The target frames per second.

### `getFPS()`
Retrieves the current target frames per second for rendering.
* **Returns:** `number` — The target frames per second rounded to the nearest integer.

### `setcalcRate(rate)`
Sets the frequency per second for executing standard game logic updates.
* **Arguments:** `rate` (`number`) — The target updates per second.

### `getcalcRate()`
Retrieves the current target frequency for standard game logic updates.
* **Returns:** `number` — The updates per second rounded to the nearest integer.

### `setfixedRate(rate)`
Sets the frequency per second for executing physics and deterministic updates.
* **Arguments:** `rate` (`number`) — The target fixed updates per second.

### `getfixedRate()`
Retrieves the current target frequency for physics and deterministic updates.
* **Returns:** `number` — The fixed updates per second rounded to the nearest integer.
