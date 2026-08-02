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

export function resolveAABB2D(a, b, posA, velA){
  // calculate the overlap on both axis
  const dx = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x,b.x); // formula
  const dy =  Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y); // same formula but for y axis

  //1st if there is no actual overlap on either axis exit early

  if (dx <= 0 || dy <= 0) return;

  //2nd find centers to get the correct push direction
  const centerA_x = a.x + a.width / 2;
  const centerB_x = b.x + b.width / 2;
  const centerA_y = a.y + a.height / 2;
  const centerB_y = b.y + b.height / 2;

  //3rd Push out along the SMALLEST overlap axis
  if (dx <= dy){
    // push Left or Right based on center positions
    const sign = centerA_x < centerB_x ? -1 : 1;
    posA.x += dx * sign;
    a.x += dx * sign;  // Update the hitbox position immediately
    if (velA) velA.vx = 0;
  }
  else{
    // Push Up or Down based on center positions
    const sign = centerA_y < centerB_y ? -1 : 1;
    posA.y += dy * sign;
    a.y += dy * sign; //Update the hitbox position immediately
    if (velA) velA.vy = 0;
  }
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
