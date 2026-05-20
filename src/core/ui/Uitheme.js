/**
 * UITheme
 * 
 * Global stylesheet for all UI elements.
 * Every element inherits from this — override per-element by passing
 * style options directly to the element constructor.
 * 
 * Usage:
 *   game.ui.theme.set({ primaryColor: "#4a90e2", fontFamily: "Arial" });
 */
export class UITheme {
    constructor(overrides = {}) {
        this._defaults = {
            // ── Colors ───────────────────────────────────────────
            primaryColor:      "#4a90e2",
            secondaryColor:    "#6c757d",
            backgroundColor:   "#1e1e2e",
            surfaceColor:      "#2a2a3e",
            borderColor:       "#44445a",
            textColor:         "#ffffff",
            textSecondary:     "#aaaacc",
            successColor:      "#2ecc71",
            dangerColor:       "#e74c3c",
            warningColor:      "#f39c12",

            // ── Hover / Press ─────────────────────────────────────
            hoverColor:        "#5aa0f2",
            pressColor:        "#3a80d2",
            disabledColor:     "#444460",
            disabledTextColor: "#666688",

            // ── Typography ────────────────────────────────────────
            fontFamily:        "Arial, sans-serif",
            fontSize:          14,
            fontWeight:        "normal",
            textAlign:         "center",
            textBaseline:      "middle",

            // ── Spacing ───────────────────────────────────────────
            padding:           10,
            borderWidth:       1,
            borderRadius:      6,

            // ── Progress bar ──────────────────────────────────────
            progressTrackColor: "#333350",
            progressFillColor:  "#4a90e2",

            // ── Slider ────────────────────────────────────────────
            sliderTrackColor:   "#333350",
            sliderHandleColor:  "#4a90e2",
            sliderHandleRadius: 8,

            // ── Checkbox ──────────────────────────────────────────
            checkColor:         "#4a90e2",
            checkSize:          18,

            // ── Input ─────────────────────────────────────────────
            inputBackground:    "#16162a",
            inputBorderColor:   "#44445a",
            inputFocusColor:    "#4a90e2",
            cursorColor:        "#ffffff",
            cursorBlinkRate:    530,   // ms
        };

        this._theme = { ...this._defaults, ...overrides };
    }

    /** Update one or more theme values globally. */
    set(overrides = {}) {
        Object.assign(this._theme, overrides);
    }

    /** Reset to built-in defaults. */
    reset() {
        this._theme = { ...this._defaults };
    }

    /**
     * Resolve a style value — element override wins over global theme.
     * @param {string} key
     * @param {object} elementStyle  — per-element overrides (may be null)
     */
    resolve(key, elementStyle = null) {
        if (elementStyle && elementStyle[key] !== undefined) return elementStyle[key];
        return this._theme[key];
    }

    /** Get the full merged style for an element. */
    mergeStyle(elementStyle = {}) {
        return { ...this._theme, ...elementStyle };
    }
}