
/**
 * KernelPlay-JS
 * TypeScript declarations
 */

// ============================================================
// Core
// ============================================================

export declare class Game {
    constructor(config?: any);

    sceneManager: SceneManager;
    canvas: Canvas;
    loop: Loop;

    start(): void;
    stop(): void;
    init(): void;
}

export declare class Loop {
    constructor(...args: any[]);
}

export declare class Time {
    static [key: string]: any;
}

export declare class Scene {
    constructor(name?: string);

    addEntity(entity: Entity): void;
    raycast(x: number, y: number, options?: any): any;
    init(): void;

    [key: string]: any;
}

export declare class SceneManager {
    constructor(...args: any[]);
}

export declare class Canvas {
    constructor(...args: any[]);
}

export declare class Renderer {
    constructor(...args: any[]);
}

export declare const Layers: Record<string, number>;

// ============================================================
// Entity & Components
// ============================================================

export declare class Entity {
    constructor(name?: string);

    id: number;
    name: string;
    tag: string;
    layer: number;
    zIndex: number;
    scene: Scene | null;

    addComponent(name: string, component: any): void;
    getComponent(name: string): any;
    destroy(): void;

    [key: string]: any;
}

export declare class Component {
    entity: Entity;
    scene: Scene;

    constructor(...args: any[]);

    onAttach?(): void;
    onStart?(): void;
    onUpdate?(dt: number): void;
    onDestroy?(): void;

    [key: string]: any;
}

export declare class EntityReference {
    constructor(...args: any[]);
}

export declare class UIReference {
    constructor(...args: any[]);
}

export declare function ref(...args: any[]): any;
export declare function uiRef(...args: any[]): any;

// ============================================================
// Animation
// ============================================================

export declare class AnimatorController {
    constructor(...args: any[]);
}

export declare class AnimationClip {
    constructor(...args: any[]);
}

// ============================================================
// Input
// ============================================================

export declare class Keyboard {
    static isPressed(key: string): boolean;
    static wasPressed(key: string): boolean;

    static [key: string]: any;
}

export declare class Mouse {
    static x: number;
    static y: number;

    static wasPressed(button: number): boolean;

    static [key: string]: any;
}

export declare class Touch {
    static [key: string]: any;
}

export declare class Gamepad {
    static [key: string]: any;
}

export declare const GamepadButton: any;

export declare class Input {
    static [key: string]: any;
}

// ============================================================
// Utilities
// ============================================================

export declare const KeyCode: any;
export declare const MouseButton: any;

/**
 * Anything containing x and y.
 * Supports Vector2 and plain objects.
 */
export interface Vec2Like {
    x: number;
    y: number;
}

/**
 * Anything containing x, y and z.
 * Supports Vector3 and plain objects.
 */
export interface Vec3Like {
    x: number;
    y: number;
    z: number;
}

// ============================================================
// Vector2
// ============================================================

export declare class Vector2 {
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
}

// ============================================================
// Vector3
// ============================================================

export declare class Vector3 {
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
}

// ============================================================
// Math & Helpers
// ============================================================

export declare class Mathf {
    static [key: string]: any;
}

export declare class Random {
    static [key: string]: any;
}

export declare class Cooldown {
    constructor(...args: any[]);
}

export declare class Timer {
    constructor(...args: any[]);
}

export declare function hexToRGB(hex: string): any;
export declare function rgbToHex(...args: any[]): string;

export declare function radToDeg(rad: number): number;
export declare function degToRad(deg: number): number;

export declare function HashString(...args: any[]): any;

export declare class Spritesheet {
    constructor(...args: any[]);
}

// ============================================================
// Built-in Components
// ============================================================

export declare class TransformComponent {
    constructor(options?: any);

    position: Vec3Like;

    [key: string]: any;
}

export declare class BoxRenderComponent {
    constructor(options?: any);
}

export declare class ColliderComponent {
    constructor(options?: any);
}

export declare class ScriptComponent {
    entity: Entity;

    onAttach?(): void;
    onStart?(): void;
    update?(dt: number): void;
    lateUpdate?(dt: number): void;

    onCollision?(other: Entity): void;
    onTriggerEnter?(other: Entity): void;

    [key: string]: any;
}

export declare class CameraComponent {
    constructor(options?: any);
}

export declare class SpriteComponent {
    constructor(options?: any);
}

export declare class AnimatorComponent {
    constructor(options?: any);
}

export declare class ShapeRenderer {
    constructor(options?: any);
}

export declare class AudioSource {
    constructor(options?: any);
}

export declare class AudioListener {
    constructor(options?: any);
}

export declare class FPSCounterComponent {
    constructor(options?: any);
}

// ============================================================
// UI Elements
// ============================================================

export declare class UIElement {
    constructor(...args: any[]);
}

export declare class UICanvas {
    constructor(...args: any[]);
}

export declare class UIText {
    constructor(...args: any[]);
}

export declare class UIBitmapText {
    constructor(...args: any[]);
}

export declare class UIButton {
    constructor(...args: any[]);
}

export declare class UIImage {
    constructor(...args: any[]);
}

export declare class UIImageButton {
    constructor(...args: any[]);
}

export declare class UIPanel {
    constructor(...args: any[]);
}

export declare class UIProgressBar {
    constructor(...args: any[]);
}

export declare class UISlider {
    constructor(...args: any[]);
}

export declare class UICheckbox {
    constructor(...args: any[]);
}

export declare class UIInputField {
    constructor(...args: any[]);
}

export declare class UIJoystick {
    constructor(...args: any[]);
}

export declare class UIRaycast {
    constructor(...args: any[]);
}

export declare class UITheme {
    constructor(...args: any[]);
}

// ============================================================
// Physics
// ============================================================

export declare class RigidbodyComponent {
    constructor(options?: any);

    velocity: Vec2Like;
    isGrounded: boolean;

    addForce(x: number, y: number, mode?: string): void;

    [key: string]: any;
}

export declare class Rigidbody2DComponent {
    constructor(options?: any);

    velocity: Vec2Like;
    isGrounded: boolean;

    addForce(x: number, y: number, mode?: string): void;

    [key: string]: any;
}

export declare class Physics2D {
    static [key: string]: any;
}

export declare class Physics3D {
    static [key: string]: any;
}
