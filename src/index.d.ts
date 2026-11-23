// ---- core -------------------------------------------------------------
export class Game {
  constructor(config?: any);
  sceneManager: SceneManager;
  canvas: Canvas;
  loop: Loop;
  start(): void;
  stop(): void;
  init(): void;
  [key: string]: any;
}

export class Loop {
  constructor(...args: any[]);
  [key: string]: any;
}

export class Time {
  static [key: string]: any;
  [key: string]: any;
}

export class Scene {
  constructor(name?: string);
  addEntity(entity: Entity): void;
  raycast(x: number, y: number, options?: any): any;
  init(): void;
  [key: string]: any;
}

export class SceneManager {
  constructor(...args: any[]);
  [key: string]: any;
}

export class Canvas {
  constructor(...args: any[]);
  [key: string]: any;
}

export class Renderer {
  constructor(...args: any[]);
  [key: string]: any;
}

export const Layers: Record<string, number>;

export class Entity {
  constructor(name?: string, tag?: string);
  id: number;
  tag: string;
  layer: number;
  zIndex: number;
  scene: Scene;
  addComponent(name: string, component: any): void;
  getComponent<T = any>(name: string): T;
  destroy(): void;
  [key: string]: any;
}

export class Component {
  entity: Entity;
  constructor(...args: any[]);
  [key: string]: any;
}

export class EntityReference {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIReference {
  constructor(...args: any[]);
  [key: string]: any;
}

export function ref(...args: any[]): any;
export function uiRef(...args: any[]): any;

// ---- animation --------------------------------------------------------
export class AnimatorController {
  constructor(...args: any[]);
  [key: string]: any;
}

export class AnimationClip {
  constructor(...args: any[]);
  [key: string]: any;
}

// ---- input ------------------------------------------------------------
export class Keyboard {
  static isPressed(key: string): boolean;
  static wasPressed(key: string): boolean;
  static [key: string]: any;
  [key: string]: any;
}

export class Mouse {
  static x: number;
  static y: number;
  static wasPressed(button: number): boolean;
  static [key: string]: any;
  [key: string]: any;
}

export class Touch {
  static [key: string]: any;
  [key: string]: any;
}

export class Gamepad {
  static [key: string]: any;
  [key: string]: any;
}

export const GamepadButton: any;

export class Input {
  static [key: string]: any;
  [key: string]: any;
}

// ---- utils ------------------------------------------------------------
export const KeyCode: any;
export const MouseButton: any;

/** Anything with x and y: a Vector2, transform.position, or a plain { x, y } object */
export interface Vec2Like {
  x: number;
  y: number;
}

/** Anything with x, y and z */
export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

export class Vector2 {
  constructor(x?: number, y?: number);
  x: number;
  y: number;

  clone(): Vector2;
  set(x: number, y: number): this;
  length(): number;
  lengthSq(): number;
  angle(): number;
  normalize(): this;

  static add(a: Vec2Like, b: Vec2Like): Vector2;
  static sub(a: Vec2Like, b: Vec2Like): Vector2;
  static scale(v: Vec2Like, s: number): Vector2;
  static normalize(v: Vec2Like): Vector2;
  static distance(a: Vec2Like, b: Vec2Like): number;
  static distanceSq(a: Vec2Like, b: Vec2Like): number;
  static dot(a: Vec2Like, b: Vec2Like): number;
  static lerp(a: Vec2Like, b: Vec2Like, t: number): Vector2;
  static Magnitude(v: Vec2Like): number;
  static MagnitudeSq(v: Vec2Like): number;
  static Reflect(incident: Vec2Like, normal: Vec2Like): Vector2;

  [key: string]: any;
}

export class Vector3 {
  constructor(x?: number, y?: number, z?: number);
  x: number;
  y: number;
  z: number;

  set(x: number, y: number, z: number): this;
  clone(): Vector3;
  length(): number;
  lengthSq(): number;
  normalize(): this;
  add(v: Vec3Like): this;
  sub(v: Vec3Like): this;
  scale(s: number): this;

  static add(a: Vec3Like, b: Vec3Like): Vector3;
  static sub(a: Vec3Like, b: Vec3Like): Vector3;
  static scale(v: Vec3Like, s: number): Vector3;
  static normalize(v: Vec3Like): Vector3;
  static distance(a: Vec3Like, b: Vec3Like): number;
  static distanceSq(a: Vec3Like, b: Vec3Like): number;
  static dot(a: Vec3Like, b: Vec3Like): number;
  static cross(a: Vec3Like, b: Vec3Like): Vector3;
  static lerp(a: Vec3Like, b: Vec3Like, t: number): Vector3;

  [key: string]: any;
}

export class Mathf {
  static [key: string]: any;
  [key: string]: any;
}

export class Random {
  static [key: string]: any;
  [key: string]: any;
}

export class Cooldown {
  constructor(...args: any[]);
  [key: string]: any;
}

export class Timer {
  constructor(...args: any[]);
  [key: string]: any;
}

export function hexToRGB(hex: string): any;
export function rgbToHex(...args: any[]): string;
export function radToDeg(rad: number): number;
export function degToRad(deg: number): number;
export function HashString(...args: any[]): any;

export class Spritesheet {
  constructor(...args: any[]);
  [key: string]: any;
}

// ---- user components --------------------------------------------------
export class TransformComponent extends Component {
  constructor(options?: any);
  position: { x: number; y: number; z?: number };
  [key: string]: any;
}

export class BoxRenderComponent extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class ColliderComponent extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class ScriptComponent extends Component {
  onAttach?(): void;
  onStart?(): void;
  update?(dt: number): void;
  lateUpdate?(dt: number): void;
  onCollision?(other: any): void;
  onTriggerEnter?(other: any): void;
  [key: string]: any;
}

export class CameraComponent extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class SpriteComponent extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class AnimatorComponent extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class ShapeRenderer extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class AudioSource extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class AudioListener extends Component {
  constructor(options?: any);
  [key: string]: any;
}

export class FPSCounterComponent extends Component {
  constructor(options?: any);
  [key: string]: any;
}

// ---- ui ---------------------------------------------------------------
export class UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UICanvas extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIText extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIBitmapText extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIButton extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIImage extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIImageButton extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIPanel extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIProgressBar extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UISlider extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UICheckbox extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIInputField extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIJoystick extends UIElement {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UIRaycast {
  constructor(...args: any[]);
  [key: string]: any;
}

export class UITheme {
  constructor(...args: any[]);
  [key: string]: any;
}

// ---- physics ----------------------------------------------------------
export class RigidbodyComponent extends Component {
  constructor(options?: any);
  velocity: { x: number; y: number };
  isGrounded: boolean;
  addForce(x: number, y: number, mode?: string): void;
  [key: string]: any;
}

export class Rigidbody2DComponent extends Component {
  constructor(options?: any);
  velocity: { x: number; y: number };
  isGrounded: boolean;
  addForce(x: number, y: number, mode?: string): void;
  [key: string]: any;
}