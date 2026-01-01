export class LayerMask {
  static contains(mask, layer) {
    return (mask & layer) !== 0;
  }
}
