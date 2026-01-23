export class RaycastHit {
  constructor({ entity, point, normal, distance }) {
    this.entity = entity;
    this.point = point;       // { x, y, z }
    this.normal = normal;     // { x, y, z }
    this.distance = distance;
  }
}
