// BenchmarkScene.js
import { Scene, Entity, Keyboard } from "../../../src/index.js";
import { BoxRenderComponent, ColliderComponent } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";
import { Rigidbody2DComponent } from "../../../src/index.js";

export class BenchmarkScene extends Scene {
    init() {
        this.ctx = this.game.renderer.ctx;

        // 🔥 FPS tracking
        this.fps = 0;
        this.frames = 0;
        this.lastTime = performance.now();

        // 🔥 Stats
        this.entityCount = 5000;
        this.visibleCount = 0;

        console.log(`🔥 Creating ${this.entityCount} entities...`);
        const startTime = performance.now();

        this.createEntities(this.entityCount);

        const endTime = performance.now();
        console.log(`✅ Created in ${(endTime - startTime).toFixed(2)}ms`);
    }

    // BenchmarkScene.js
    createEntities(count) {
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];

        // const p = 1;
        const p = 0.9;
        for (let i = 0; i < count; i++) {
            const entity = new Entity(`Box_${i}`);

            // Random position in large world
            const x = Math.random() * 5000 - 2500;
            const y = Math.random() * 5000 - 2500;

            entity.addComponent("transform", new TransformComponent({
                position: { x, y, z: 0 }
            }));

            const color = colors[Math.floor(Math.random() * colors.length)];

            entity.addComponent("renderer", new BoxRenderComponent({
                color,
                zIndex: Math.floor(Math.random() * 10)
            }));

            // 50% have colliders + physics

            if (Math.random() > p) {
                entity.addComponent("collider", new ColliderComponent({
                    width: 50,
                    height: 50
                }));

                entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
                    mass: 1,
                    gravityScale: 0, // 🔥 Lighter gravity for benchmark
                    drag: 0.1,
                    // useGravity: false
                }));

                // 🔥 Set random velocity
                const rb = entity.getComponent("rigidbody2d");
                rb.velocity.x = (Math.random() - 0.5) * 200;
                rb.velocity.y = (Math.random() - 0.5) * 200;
            }

            this.addEntity(entity);
        }
    }

    update(dt) {
        super.update(dt);

        // 🔥 FPS calculation
        this.frames++;
        const now = performance.now();

        if (now >= this.lastTime + 1000) {
            this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));
            this.frames = 0;
            this.lastTime = now;
        }

        // 🔥 Camera controls
        const speed = 300;
        if (Keyboard.isPressed("ArrowLeft")) this.game.camera.x -= speed * dt;
        if (Keyboard.isPressed("ArrowRight")) this.game.camera.x += speed * dt;
        if (Keyboard.isPressed("ArrowUp")) this.game.camera.y -= speed * dt;
        if (Keyboard.isPressed("ArrowDown")) this.game.camera.y += speed * dt;

        // Exit benchmark
        if (Keyboard.isPressed("Escape")) {
            this.game.sceneManager.startScene("Menu");
        }
    }

    render() {
        const { width, height } = this.game.config;

        // 🔥 Render via parent (uses optimized renderer)
        super.render(this.game.renderer);

        // 🔥 Draw stats overlay
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        this.ctx.fillRect(10, 10, 300, 160);

        this.ctx.fillStyle = "#00FF00";
        this.ctx.font = "16px monospace";
        this.ctx.fillText(`FPS: ${this.fps}`, 20, 35);
        this.ctx.fillText(`Total Entities: ${this.entities.length}`, 20, 60);
        this.ctx.fillText(`Visible: ${this._visibleCount || 0}`, 20, 85);
        this.ctx.fillText(`Physics: ${this._rigidbody2D.length}`, 20, 110);
        // this.ctx.fillText(`Camera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}`, 20, 135);

        this.ctx.fillStyle = "#FFFF00";
        this.ctx.font = "14px monospace";
        this.ctx.fillText("Arrow Keys: Move Camera", 20, height - 40);
        this.ctx.fillText("ESC: Exit Benchmark", 20, height - 20);

        this.ctx.restore();
    }
}