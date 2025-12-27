export class Time {
  static delta = 0;
  static fps = 0;
  static _lastFpsTime = 0;
  static _frames = 0;

  static update(delta, time) {
    Time.delta = delta;
    Time._frames++;

    if (time - Time._lastFpsTime >= 1000) {
      Time.fps = Time._frames;
      Time._frames = 0;
      Time._lastFpsTime = time;
    }
  }
}
