import { Component } from "../Component.js";

export class RigidbodyComponent extends Component {
  constructor({
    mass = 1,
    gravityScale = 1,
    isKinematic = false,
    drag = 0.05,
    useGravity = true
  } = {}) {
    super();
    this.mass = mass;
    this.gravityScale = gravityScale;
    this.isKinematic = isKinematic;
    this.drag = drag;
    this.useGravity = useGravity;

    // Pure data — physics engine writes to these
    this.velocity = { x: 0, y: 0, z: 0 };
    this.force = { x: 0, y: 0, z: 0 };
    this.isGrounded = false;
  }

  // Thin wrapper — delegates to physics engine
  addForce(x, y, z = 0, mode = "force") {
    this.entity?.scene?.game?.physics?.addForce(this, x, y, z, mode);
  }

  addImpulse(x, y, z = 0) {
    this.addForce(x, y, z, "impulse");
  }
}