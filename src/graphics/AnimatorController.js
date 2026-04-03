// AnimatorController.js
// Unity-style Animator Controller — state machine with parameters & transitions.

export class AnimatorController {
  constructor() {
    this.states = {};       // { stateName: { clip, speed, mirror } }
    this.transitions = [];  // [ { from, to, conditions, hasExitTime, exitTime, duration } ]
    this.parameters = {};   // { paramName: { type, value } }  type: "bool"|"float"|"int"|"trigger"
    this.entryState = null;
    this.anyStateTransitions = []; // transitions that apply from ANY state
  }

  // ─── Builder API (chainable) ────────────────────────────────────────

  addState(name, clip, options = {}) {
    this.states[name] = {
      clip,
      speed: options.speed ?? 1,
      mirror: options.mirror ?? false,    // flip sprite horizontally
      tag: options.tag ?? null,
    };
    if (!this.entryState) this.entryState = name;
    return this;
  }

  addParameter(name, type, defaultValue) {
    const defaults = { bool: false, float: 0, int: 0, trigger: false };
    this.parameters[name] = {
      type,
      value: defaultValue ?? defaults[type],
    };
    return this;
  }

  addTransition(from, to, options = {}) {
    this.transitions.push({
      from,                                 // state name or "AnyState"
      to,
      conditions: options.conditions ?? [], // [ { param, op, value } ]
      hasExitTime: options.hasExitTime ?? false,
      exitTime: options.exitTime ?? 1.0,    // normalized (0-1) within clip
      duration: options.duration ?? 0,      // crossfade seconds
      priority: options.priority ?? 0,
    });
    return this;
  }

  // Shorthand: add a transition from AnyState
  addAnyStateTransition(to, options = {}) {
    return this.addTransition("AnyState", to, options);
  }

  // ─── Runtime ────────────────────────────────────────────────────────

  // Check if transitions out of `currentState` are valid given current params
  // Returns the matching transition or null
  evaluateTransitions(currentState, normalizedTime) {
    // Collect candidates: specific + AnyState
    const candidates = this.transitions
      .filter((t) => t.from === currentState || t.from === "AnyState")
      .sort((a, b) => b.priority - a.priority);

    for (const t of candidates) {
      // Don't transition to self unless explicitly allowed
      if (t.to === currentState) continue;

      // Check exit time gate
      if (t.hasExitTime && normalizedTime < t.exitTime) continue;

      // Check all conditions
      if (this._checkConditions(t.conditions)) return t;
    }
    return null;
  }

  _checkConditions(conditions) {
    if (conditions.length === 0) return true;
    for (const cond of conditions) {
      const param = this.parameters[cond.param];
      if (!param) continue;

      const v = param.value;
      switch (cond.op) {
        case "true":    if (!v) return false; break;
        case "false":   if (v) return false; break;
        case ">":       if (!(v > cond.value)) return false; break;
        case "<":       if (!(v < cond.value)) return false; break;
        case ">=":      if (!(v >= cond.value)) return false; break;
        case "<=":      if (!(v <= cond.value)) return false; break;
        case "==":      if (v !== cond.value) return false; break;
        case "!=":      if (v === cond.value) return false; break;
        case "trigger":
          if (!v) return false;
          // consume trigger after use
          param.value = false;
          break;
      }
    }
    return true;
  }

  setParameter(name, value) {
    if (this.parameters[name]) {
      this.parameters[name].value = value;
    }
  }

  setTrigger(name) {
    this.setParameter(name, true);
  }

  resetTrigger(name) {
    this.setParameter(name, false);
  }

  getParameter(name) {
    return this.parameters[name]?.value;
  }

  toJSON() {
    return {
      type: "AnimatorController",
      states: Object.fromEntries(
        Object.entries(this.states).map(([k, v]) => [
          k,
          { ...v, clip: v.clip.toJSON() },
        ])
      ),
      transitions: this.transitions,
      parameters: this.parameters,
      entryState: this.entryState,
    };
  }

  static fromJSON(data, clipFromJSON) {
    const ac = new AnimatorController();
    ac.entryState = data.entryState;
    ac.transitions = data.transitions;
    ac.parameters = data.parameters;
    for (const [name, state] of Object.entries(data.states)) {
      ac.states[name] = { ...state, clip: clipFromJSON(state.clip) };
    }
    return ac;
  }
}