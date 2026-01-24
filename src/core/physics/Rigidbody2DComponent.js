import { Component } from "../Component.js";

export class Rigidbody2DComponent extends Component {
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

    this.velocity = { x: 0, y: 0 };
    this.force = { x: 0, y: 0 };

    this.drag = drag; // linear drag
    this.useGravity = useGravity;
    this.isGrounded = false;
}

addForce(x, y, mode = "force") {
  if (mode === "impulse") {
    this.velocity.x += x / this.mass;
    this.velocity.y += y / this.mass;
  } else {
    this.force.x += x;
    this.force.y += y;
  }
}

integrate(dt, gravity) {
    // console.log("test");
    if (this.isKinematic) return;

    // Apply gravity
    if (this.useGravity) {
      this.force.y += gravity * this.gravityScale * this.mass;
    }

    // Acceleration
    const ax = this.force.x / this.mass;
    const ay = this.force.y / this.mass;

    this.velocity.x += ax * dt;
    this.velocity.y += ay * dt;

    // Drag
    this.velocity.x *= 1 - this.drag * dt;
    this.velocity.y *= 1 - this.drag * dt;

    // Move transform
    const t = this.entity.getComponent("transform");
    if (t) {
      t.position.x += this.velocity.x * dt;
      t.position.y += this.velocity.y * dt;
    }

    // Reset force
    this.force.x = 0;
    this.force.y = 0;
  }
}
