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

    this.velocity = { x: 0, y: 0, z: 0 };
    this.force = { x: 0, y: 0, z: 0 };

    this.drag = drag;
    this.useGravity = useGravity;
    this.isGrounded = false;
  }

  addForce(x, y, z, mode = "force") {
    if (mode === "impulse") {
      this.velocity.x += x / this.mass;
      this.velocity.y += y / this.mass;
      this.velocity.z += z / this.mass;
    } else {
      this.force.x += x;
      this.force.y += y;
      this.force.z += z;
    }
  }

  integrate(dt, gravity) {
    if (this.isKinematic) return;

    if (this.useGravity) {
      this.force.y -= gravity * this.gravityScale * this.mass;
    }

    const ax = this.force.x / this.mass;
    const ay = this.force.y / this.mass;
    const az = this.force.z / this.mass;

    this.velocity.x += ax * dt;
    this.velocity.y += ay * dt;
    this.velocity.z += az * dt;

    this.velocity.x *= 1 - this.drag * dt;
    this.velocity.y *= 1 - this.drag * dt;
    this.velocity.z *= 1 - this.drag * dt;

    const t = this.entity.getComponent("transform");
    if (t) {
      t.position.x += this.velocity.x * dt;
      t.position.y += this.velocity.y * dt;
      t.position.z += this.velocity.z * dt;
    }

    this.force.x = this.force.y = this.force.z = 0;
  }
}
