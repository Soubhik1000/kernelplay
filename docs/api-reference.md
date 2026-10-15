# 📖 API Reference

Complete method tables for Entity, Scene, SceneManager, and more.

[← Back to README](../README.md) · [All docs](./README.md)

---

## Entity

| Method | Description |
|--------|-------------|
| `addComponent(name, comp)` | Attach a component under a string key |
| `getComponent(name)` | Retrieve attached component by key |
| `removeComponent(name)` | Detach and destroy a component |
| `hasComponent(name)` | Check if component exists |
| `destroy()` | Remove entity from scene at end of frame |

## Scene

| Method | Description |
|--------|-------------|
| `addEntity(entity)` | Add entity to this scene |
| `removeEntity(entity)` | Remove entity from scene |
| `raycast(x, y, options)` | Cast a ray, returns hit info or null |
| `findEntityByTag(tag)` | Find first entity matching tag |
| `findEntitiesByTag(tag)` | Find all entities matching tag |

## SceneManager

| Method | Description |
|--------|-------------|
| `addScene(scene)` | Register a scene |
| `startScene(name)` | Load and start a registered scene |
| `switchScene(name)` | Transition to another scene |

## Links

[![GitHub](https://img.shields.io/badge/GitHub_%E2%86%92-111827?style=for-the-badge)](https://github.com/Soubhik1000/kernelplay)
[![NPM](https://img.shields.io/badge/NPM_%E2%86%92-cc3534?style=for-the-badge)](https://www.npmjs.com/package/kernelplay-js)
[![Live Demo](https://img.shields.io/badge/Live_Demo_%E2%86%92-6366f1?style=for-the-badge)](https://soubhik-rjs.github.io/kernelplay-js-demo/)
[![Examples](https://img.shields.io/badge/Examples_%E2%86%92-8b5cf6?style=for-the-badge)](examples.html)
