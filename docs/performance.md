# ⚡ Performance

[← Back to README](../README.md) · [All docs](./README.md)

---

Tested on **i3 7th Gen, 8GB RAM** — a deliberately modest machine:

| Scenario | Objects | Physics | FPS |
|----------|---------|---------|-----|
| Light | 1,000 | 10% | 60 |
| Medium | 5,000 | 10% | 60 |
| Heavy | 10,000 | 10% | 50–60 |
| Extreme | 20,000 | 5% | 30–40 |
| Physics Heavy | 3,000 | 100% | 40–45 |

*On modern hardware (i5 10th gen+), 60 FPS holds even at Extreme.*

**How it stays fast:**
- **Spatial grid** — turns O(n²) collision into O(n), automatically
- **Frustum culling** — skips anything off-screen entirely
- **Object pooling** — spawn 1000+ bullets/sec with zero GC stutters
- **Dirty flag system** — 91% fewer transform recalculations for static objects
- **Batch rendering** — groups draws by color, cuts canvas state changes by 100×
