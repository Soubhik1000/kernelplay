# 🎵 AudioSource *(New in v0.3.1)*

[← Back to README](../README.md) · [All docs](./README.md)

---

## Setup — attach to any entity

```js
// Minimal — just a default clip
entity.addComponent("audio", new AudioSource({
    clip:        './assets/jump.mp3',
    volume:      0.8,
    playOnStart: false,
}));

// Named clips — recommended way
entity.addComponent("audio", new AudioSource({
    clips: {
        run:    './assets/run.mp3',
        jump:   './assets/jump.mp3',
        hurt:   './assets/hurt.mp3',
        attack: './assets/sword_swing.mp3',
        death:  './assets/death.mp3',
    },
    volume: 1.0,
}));

// Auto-play on spawn (great for ambient objects)
entity.addComponent("audio", new AudioSource({
    clips: {
        ambient: './assets/fire_crackle.mp3',
    },
    clip:        'ambient',
    loop:        true,
    playOnStart: true,
    volume:      0.6,
}));
```

---


## Pre-load clips (zero delay on first play)

```js
// In your scene's init() — before anything plays
async init() {
    await this.game.audio.loadAll([
        './assets/run.mp3',
        './assets/jump.mp3',
        './assets/hurt.mp3',
        './assets/theme.mp3',
    ]);
}
```

---

## playOneShot — overlapping SFX

```js
// Uses entity's own transform position automatically
this.audio.playOneShot('jump');

// Override volume
this.audio.playOneShot('attack', { volume: 0.7 });

// Raw path still works if no named clips set up
this.audio.playOneShot('./assets/coin.mp3', { volume: 0.5 });

// Custom world position (e.g. explosion at a different spot)
this.audio.playOneShot('explode', { position: { x: 400, y: 300 } });
```

---

## playLoop — looping sounds (idempotent — safe to call every frame)

```js
// Safe to call every frame — won't stack
this.audio.playLoop('run', { volume: 0.5 });

// Stop by name
this.audio.stopLoop('run');

// Check if playing
if (this.audio.isPlaying('run')) {
    this.audio.stopLoop('run');
}

// Multiple loops at once (e.g. engine + wind)
this.audio.playLoop('engine', { volume: 0.6 });
this.audio.playLoop('wind',   { volume: 0.3 });

// Stop one, keep the other
this.audio.stopLoop('engine');

// Stop all loops
this.audio.stopAllLoops();
```

---

## Player controller — run / jump / hurt

```js
update(dt) {
    const isMoving = rb.velocity.x !== 0;

    // Run sound — just two lines, no flags needed
    if (isMoving && rb.isGrounded) {
        this.audio.playLoop('run', { volume: 0.5 });
    } else {
        this.audio.stopLoop('run');
    }

    // Jump
    if (rb.isGrounded && Keyboard.wasPressed(KeyCode.Space)) {
        rb.addForce(0, -600, "impulse");
        this.audio.stopLoop('run');          // cut run sound immediately
        this.audio.playOneShot('jump', { volume: 0.8 });
    }
}

takeDamage() {
    this.audio.playOneShot('hurt', { volume: 1.0 });
}

die() {
    this.audio.stopAll();
    this.audio.playOneShot('death', { volume: 1.0 });
}
```

---

## Background music — via AudioManager directly

```js
// game.audio is your AudioManager instance

// Start BGM — never fades with distance
game.audio.playBGM('./assets/theme.mp3', { loop: true, fadeDuration: 1.5 });

// Switch track with crossfade
game.audio.playBGM('./assets/boss.mp3', { fadeDuration: 2.0 });

// Stop with fade out
game.audio.stopBGM(1.0);

// Volume controls
game.audio.setMasterVolume(0.8);
game.audio.setBGMVolume(0.6);
game.audio.setSFXVolume(1.0);
```

---

## Enemy — ambient spatial sound

```js
// Enemy that crackles — gets quieter as player moves away
entity.addComponent("audio", new AudioSource({
    clips: {
        idle:   './assets/monster_idle.mp3',
        attack: './assets/monster_roar.mp3',
        death:  './assets/monster_death.mp3',
    },
    volume: 0.8,
}));

// In enemy script
onStart() {
    this.audio = this.entity.getComponent("audio");
    this.audio.playLoop('idle'); // starts spatialized at entity position
}

onAttack() {
    this.audio.playOneShot('attack');
}

onDeath() {
    this.audio.stopAll();
    this.audio.playOneShot('death');
    this.entity.destroy();
}
```

---

## Fire / torch — ambient object

```js
entity.addComponent("audio", new AudioSource({
    clips:       { fire: './assets/fire.mp3' },
    clip:        'fire',
    loop:        true,
    playOnStart: true,   // starts automatically on spawn
    volume:      0.7,
}));
// No script needed — just works, fades as player walks away
```

---

## isPlaying — conditional logic

```js
// Don't interrupt attack sound if already playing
if (!this.audio.isPlaying('attack')) {
    this.audio.playOneShot('attack');
}

// Swap ambient tracks on zone change
if (this.audio.isPlaying('forest')) {
    this.audio.stopLoop('forest');
    this.audio.playLoop('cave');
}
```

---

## 🎧 AudioListener — attach to camera entity

```js
// AudioListener goes on the camera so spatial audio
// is always relative to what the player sees

camera.addComponent("listener", new AudioListener());

// AudioManager.update() must run every frame in your game loop
// game.audio.update()  ← add this to your loop if not already there
```

---

## Summary

| Method | What it does |
|---|---|
| `playOneShot(clip, opts)` | One-shot SFX, overlaps fine |
| `playLoop(clip, opts)` | Looping sound, safe to call every frame |
| `stopLoop(clip)` | Stop one loop by name |
| `stopAllLoops()` | Stop all loops, keep one-shots |
| `stopAll()` | Stop everything |
| `isPlaying(clip)` | Check if a loop is active |
| `play()` | Play the default clip (respects loop flag) |
