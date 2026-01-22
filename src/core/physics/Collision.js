export function AABB(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function AABB3D(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y &&
    a.z < b.z + b.depth &&
    a.z + a.depth > b.z
  );
}

export function getOverlap(a, b) {
  const overlapX =
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);

  const overlapY =
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);

  return { overlapX, overlapY };
}


export function resolveAABB3D(a, b, posA, velA) {
  const dx =
    Math.min(a.x + a.width, b.x + b.width) -
    Math.max(a.x, b.x);

  const dy =
    Math.min(a.y + a.height, b.y + b.height) -
    Math.max(a.y, b.y);

  const dz =
    Math.min(a.z + a.depth, b.z + b.depth) -
    Math.max(a.z, b.z);

  // Push out along smallest axis
  if (dx <= dy && dx <= dz) {
    posA.x += posA.x < b.x ? -dx : dx;
    if (velA) velA.vx = 0;
  } else if (dy <= dz) {
    posA.y += posA.y < b.y ? -dy : dy;
    if (velA) velA.vy = 0;
  } else {
    posA.z += posA.z < b.z ? -dz : dz;
    if (velA) velA.vz = 0;
  }
}
