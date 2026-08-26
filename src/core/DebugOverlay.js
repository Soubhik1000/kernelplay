import { UIPanel, UIText } from "./ui/index.js";
import { Keyboard } from "../input/Keyboard.js";
import { KeyCode } from "../utils/KeyCode.js";
import { Gamepad } from "../input/Gamepad.js";
import { Touch } from "../input/Touch.js";
import { Input } from "../input/Input.js";

export class DebugOverlay {

  // ─── Toggle keys — change these to remap ────────────────────────────────
  // static TOGGLE_KEYS = [KeyCode.F2];
  static TOGGLE_KEYS = [KeyCode.M];
  static TOGGLE_COMBO = { key: KeyCode.D, modifier: "ctrl" }; // Ctrl + D

  // ─── Styles ───────────────────────────────────────────────────────────────
  static #PANEL = {
    width: 220,
    height: 148,
    style: {
      surfaceColor: "rgba(0, 0, 0, 0.79)",
      borderColor: "#1e1e2e",
      borderWidth: 1,
      borderRadius: 10,         // flat — no radius
    },
  };

  static #TITLE = {
    style: {
      fontSize: 12,
      fontWeight: "bolder",
      textColor: "#ffffff",
      fontFamily: "JetBrains Mono, Fira Mono, monospace",
    },
  };

  static #ROW = {
    style: {
      fontSize: 11,
      textColor: "#c8c8d8",
      fontFamily: "JetBrains Mono, Fira Mono, monospace",
    },
  };

  static #ACCENT_GREEN = "#3ddc84";
  static #ACCENT_YELLOW = "#f4c430";
  static #ACCENT_RED = "#e05555";
  static #ACCENT_BLUE = "#6c8fff";
  static #ACCENT_PURPLE = "#9898ff";
  static #MUTED = "#3a3a52";

  // ─── State ────────────────────────────────────────────────────────────────
  #game = null;
  #visible = false;
  #layer = "Debug";
  #panels = {};   // { perf, scene, input, audio }
  #labels = {};   // all UIText refs keyed by id
  #lastAction = "—";

  constructor(game) {
    this.#game = game;
  }

  // ─── Init ─────────────────────────────────────────────────────────────────
  init() {
    console.log("in");

    const ui = this.#game.ui;
    console.log(this.#game);

    // Register a dedicated layer above Overlay so it's always on top
    ui.addLayer(this.#layer, 40);
    // ui.hideLayer(this.#layer);

    this.#buildPerformance(ui);
    // this.#buildScene(ui);
    this.#buildInput(ui);
    this.#buildAudio(ui);
  }

  // ─── Build: Performance (top-left) ────────────────────────────────────────
  #buildPerformance(ui) {
    const PAD_X = 5, PAD_Y = 5;
    const ROW = 18;

    ui.add(new UIPanel({
      anchor: "topCenter",
      offset: { x: PAD_X, y: PAD_Y },
      ...DebugOverlay.#PANEL,
    }), this.#layer);

    // Title
    ui.add(new UIText({
      text: "PERFORMANCE",
      anchor: "topCenter",
      offset: { x: 0, y: 0 },
      ...DebugOverlay.#TITLE,
    }), this.#layer);

    // Row 1 — FPS | Avg | GC Spikes
    this.#labels.perf_fps = ui.add(new UIText({ text: "FPS: —", anchor: "topCenter", offset: { x: PAD_X + 10, y: PAD_Y + 28 }, ...DebugOverlay.#ROW }), this.#layer);
    this.#labels.perf_avgFrame = ui.add(new UIText({ text: "Avg: —", anchor: "topCenter", offset: { x: PAD_X + 90, y: PAD_Y + 28 }, ...DebugOverlay.#ROW }), this.#layer);
    this.#labels.perf_gc = ui.add(new UIText({ text: "GC Spikes: —", anchor: "topCenter", offset: { x: PAD_X + 190, y: PAD_Y + 28 }, ...DebugOverlay.#ROW }), this.#layer);

    // Row 2 — Frame | CPU
    this.#labels.perf_frameTime = ui.add(new UIText({ text: "Frame: —", anchor: "topCenter", offset: { x: PAD_X + 10, y: PAD_Y + 48 }, ...DebugOverlay.#ROW }), this.#layer);
    this.#labels.perf_cpu = ui.add(new UIText({ text: "CPU: —", anchor: "topCenter", offset: { x: PAD_X + 90, y: PAD_Y + 48 }, ...DebugOverlay.#ROW }), this.#layer);
  }

  // ─── Build: Scene (top-right) ─────────────────────────────────────────────
  #buildScene(ui) {
    const PAD_X = 12, PAD_Y = 12;
    const ROW = 18;

    ui.add(new UIPanel({
      anchor: "topRight",
      offset: { x: PAD_X, y: PAD_Y },
      ...DebugOverlay.#PANEL,
    }), this.#layer);

    ui.add(new UIText({
      text: "SCENE",
      anchor: "topRight",
      offset: { x: PAD_X + 10, y: PAD_Y + 10 },
      ...DebugOverlay.#TITLE,
    }), this.#layer);

    const rows = ["entities", "visible", "physics", "scene", "cam"];
    const labels = ["Entities", "Visible", "Physics", "Scene", "Camera"];
    rows.forEach((key, i) => {
      this.#labels[`scene_${key}`] = ui.add(new UIText({
        text: `${labels[i]}: —`,
        anchor: "topRight",
        offset: { x: PAD_X + 10, y: PAD_Y + 26 + i * ROW },
        ...DebugOverlay.#ROW,
      }), this.#layer);
    });
  }

  // ─── Build: Input (bottom-left) ───────────────────────────────────────────
  #buildInput(ui) {
    const PAD_X = 12, PAD_Y = 12;
    const ROW = 18;

    ui.add(new UIPanel({
      anchor: "bottomLeft",
      offset: { x: PAD_X, y: PAD_Y },
      ...DebugOverlay.#PANEL,
    }), this.#layer);

    ui.add(new UIText({
      text: "INPUT",
      anchor: "bottomLeft",
      offset: { x: PAD_X + 10, y: PAD_Y + 10 },
      ...DebugOverlay.#TITLE,
    }), this.#layer);

    const rows = ["device", "axisH", "axisV", "lastAction", "gamepad"];
    const labels = ["Device", "Axis H", "Axis V", "Last Action", "Gamepad"];
    rows.forEach((key, i) => {
      this.#labels[`input_${key}`] = ui.add(new UIText({
        text: `${labels[i]}: —`,
        anchor: "bottomLeft",
        offset: { x: PAD_X + 10, y: PAD_Y + 26 + i * ROW },
        ...DebugOverlay.#ROW,
      }), this.#layer);
    });
  }

  // ─── Build: Audio (bottom-right) ──────────────────────────────────────────
  #buildAudio(ui) {
    const PAD_X = 12, PAD_Y = 12;
    const ROW = 18;

    ui.add(new UIPanel({
      anchor: "bottomRight",
      offset: { x: PAD_X, y: PAD_Y },
      ...DebugOverlay.#PANEL,
    }), this.#layer);

    ui.add(new UIText({
      text: "AUDIO",
      anchor: "bottomRight",
      offset: { x: PAD_X + 10, y: PAD_Y + 10 },
      ...DebugOverlay.#TITLE,
    }), this.#layer);

    const rows = ["bgm", "sfxCount", "masterVol", "sfxVol", "context"];
    const labels = ["BGM", "SFX Active", "Master Vol", "SFX Vol", "Context"];
    rows.forEach((key, i) => {
      this.#labels[`audio_${key}`] = ui.add(new UIText({
        text: `${labels[i]}: —`,
        anchor: "bottomRight",
        offset: { x: PAD_X + 10, y: PAD_Y + 26 + i * ROW },
        ...DebugOverlay.#ROW,
      }), this.#layer);
    });
  }

  // ─── Toggle ───────────────────────────────────────────────────────────────
  #checkToggle() {
    const ui = this.#game.ui;

    // F2 or any key in TOGGLE_KEYS
    const keyToggle = DebugOverlay.TOGGLE_KEYS.some(k => Keyboard.wasPressed(k));

    // Ctrl + D
    const combo = DebugOverlay.TOGGLE_COMBO;
    const comboToggle = combo.modifier === "ctrl"
      ? Keyboard.isPressed(KeyCode.Ctrl) && Keyboard.wasPressed(combo.key)
      : Keyboard.wasPressed(combo.key);

    if (keyToggle || comboToggle) {
      console.log('key');

      this.#visible = !this.#visible;
      // this.#visible ? ui.showLayer(this.#layer) : ui.hideLayer(this.#layer);
      ui.toggleLayer(this.#layer);
    }
  }

  // ─── FPS color ────────────────────────────────────────────────────────────
  #fpsColor(fps) {
    if (fps >= 55) return DebugOverlay.#ACCENT_GREEN;
    if (fps >= 30) return DebugOverlay.#ACCENT_YELLOW;
    return DebugOverlay.#ACCENT_RED;
  }

  // ─── Update ───────────────────────────────────────────────────────────────
  update(dt) {
    // console.log('u');

    this.#checkToggle();
    if (!this.#visible) return;

    const game = this.#game;
    const scene = game.sceneManager?.currentScene;
    const audio = game.audio;
    const perf = game.debugStats ?? {}; // expects your benchmark to expose these

    // ── Performance ──────────────────────────────────────────────────────────
    const fps = perf.fps ?? 0;
    this.#labels.perf_fps.text = `FPS: ${fps}`;
    this.#labels.perf_fps.style.textColor = this.#fpsColor(fps);

    this.#labels.perf_frameTime.text = `Frame: ${(perf.frameTime ?? 0).toFixed(2)}ms`;
    this.#labels.perf_avgFrame.text = `Avg:   ${(perf.avgFrame ?? 0).toFixed(2)}ms`;

    const cpu = perf.cpuUsage ?? 0;
    this.#labels.perf_cpu.style.textColor =
      cpu > 90 ? DebugOverlay.#ACCENT_RED :
        cpu > 70 ? DebugOverlay.#ACCENT_YELLOW :
          DebugOverlay.#ACCENT_GREEN;
    this.#labels.perf_cpu.text = `CPU: ${cpu.toFixed(1)}%`;

    const gc = perf.gcSpikes ?? 0;
    this.#labels.perf_gc.style.textColor = gc > 0
      ? DebugOverlay.#ACCENT_RED
      : DebugOverlay.#MUTED;
    this.#labels.perf_gc.text = `GC Spikes: ${gc}/sec`;

    // ── Scene ─────────────────────────────────────────────────────────────────
    // if (scene) {
    //   this.#labels.scene_entities.text = `Entities: ${scene.entities?.length ?? 0}`;
    //   this.#labels.scene_visible.text = `Visible:  ${scene.visibleCount ?? 0}`;
    //   this.#labels.scene_physics.text = `Physics:  ${scene._rigidbody2D?.length ?? 0}`;
    //   this.#labels.scene_scene.text = `Scene:    ${scene.name ?? "—"}`;

    //   const cam = scene.camera;
    //   this.#labels.scene_cam.text = cam
    //     ? `Cam: (${Math.round(cam.position.x)}, ${Math.round(cam.position.y)})`
    //     : `Cam: —`;
    // }

    // ── Input ─────────────────────────────────────────────────────────────────
    const h = Input.getAxis("horizontal");
    const v = Input.getAxis("vertical");

    // Detect active device
    const gpActive = Gamepad.isConnected() && (
      Math.abs(Gamepad.leftStick().x) > 0.1 ||
      Math.abs(Gamepad.leftStick().y) > 0.1
    );
    const touchActive = Touch.joystickActive();
    const device = gpActive ? "Gamepad" : touchActive ? "Touch" : "Keyboard";

    this.#labels.input_device.text = `Device:   ${device}`;
    this.#labels.input_device.style.textColor =
      device === "Gamepad" ? DebugOverlay.#ACCENT_BLUE :
        device === "Touch" ? DebugOverlay.#ACCENT_PURPLE :
          DebugOverlay.#ACCENT_GREEN;

    this.#labels.input_axisH.text = `Axis H:      ${h.toFixed(3)}`;
    this.#labels.input_axisV.text = `Axis V:      ${v.toFixed(3)}`;
    this.#labels.input_lastAction.text = `Last Action: ${this.#lastAction}`;
    this.#labels.input_gamepad.text = `Gamepad:     ${Gamepad.isConnected() ? "✓" : "✗"}`;
    this.#labels.input_gamepad.style.textColor = Gamepad.isConnected()
      ? DebugOverlay.#ACCENT_GREEN
      : DebugOverlay.#ACCENT_RED;

    // ── Audio ─────────────────────────────────────────────────────────────────
    if (audio) {
      this.#labels.audio_bgm.text = `BGM:        ${audio.bgmTrack ?? "—"}`;
      this.#labels.audio_sfxCount.text = `SFX Active: ${audio.activeSFX ?? 0}`;
      this.#labels.audio_masterVol.text = `Master Vol: ${((audio.masterVolume ?? 1) * 100).toFixed(0)}%`;
      this.#labels.audio_sfxVol.text = `SFX Vol:    ${((audio.sfxVolume ?? 1) * 100).toFixed(0)}%`;
      this.#labels.audio_context.text = `Context:    ${audio.context?.state ?? "—"}`;
      this.#labels.audio_context.style.textColor =
        audio.context?.state === "running" ? DebugOverlay.#ACCENT_GREEN : DebugOverlay.#ACCENT_YELLOW;
    }
  }

  // ─── Track last fired action (call this from Input when an action fires) ──
  trackAction(name) {
    this.#lastAction = name;
  }

  // ─── Visibility helpers ───────────────────────────────────────────────────
  show() { this.#visible = true; this.#game.ui.showLayer(this.#layer); }
  hide() { this.#visible = false; this.#game.ui.hideLayer(this.#layer); }
  toggle() { this.#visible ? this.hide() : this.show(); }
  get isVisible() { return this.#visible; }
}