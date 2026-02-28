// BenchmarkScene.js (Enhanced)
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

        // 🔥 Frame time tracking
        this.frameTime = 0;
        this.avgFrameTime = 0;
        this.frameTimeSamples = [];
        this.maxSamples = 60;

        // 🔥 GC detection
        this.lastFrameTime = 0;
        this.gcSpikes = 0;
        this.gcSpikeThreshold = 16.67 * 3; // 3x normal frame time (50ms)

        // 🔥 CPU usage estimation
        this.cpuUsage = 0;

        // 🔥 Stats
        this.entityCount = 5000;
        this.visibleCount = 0;

        // 🔥 Settings from HTML controls (will be updated)
        this.settings = {
            objectCount: 5000,
            physicsPercentage: 10,
            density: 5000 // spread area
        };

        // 🔥 Create initial entities
        this.rebuildScene();

        // 🔥 Listen for settings changes
        this.setupSettingsListener();
    }

    setupSettingsListener() {
        // Check for settings updates from HTML UI
        window.benchmarkSettings = this.settings;
        
        window.updateBenchmarkSettings = (newSettings) => {
            this.settings = { ...this.settings, ...newSettings };
            this.rebuildScene();
        };
    }

    rebuildScene() {
        console.log(`🔥 Creating ${this.settings.objectCount} entities...`);
        const startTime = performance.now();

        // Clear existing entities
        for (const entity of this.entities) {
            entity.destroy();
        }
        this.entities = [];
        this._rigidbody2D = [];
        this._colliders = [];
        this._renderers = [];

        this.createEntities(this.settings.objectCount);

        const endTime = performance.now();
        console.log(`✅ Created in ${(endTime - startTime).toFixed(2)}ms`);
    }

    createEntities(count) {
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
        const physicsChance = this.settings.physicsPercentage / 100;
        const spread = this.settings.density;

        for (let i = 0; i < count; i++) {
            const entity = new Entity(`Box_${i}`);

            // Random position based on density
            const x = Math.random() * spread - spread / 2;
            const y = Math.random() * spread - spread / 2;

            entity.addComponent("transform", new TransformComponent({
                position: { x, y, z: 0 }
            }));

            const color = colors[Math.floor(Math.random() * colors.length)];

            entity.addComponent("renderer", new BoxRenderComponent({
                color,
                zIndex: Math.floor(Math.random() * 10)
            }));

            // Physics based on percentage
            if (Math.random() < physicsChance) {
                entity.addComponent("collider", new ColliderComponent({
                    width: 50,
                    height: 50
                }));

                entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
                    mass: 1,
                    gravityScale: 0,
                    drag: 0.1
                }));

                const rb = entity.getComponent("rigidbody2d");
                rb.velocity.x = (Math.random() - 0.5) * 200;
                rb.velocity.y = (Math.random() - 0.5) * 200;
            }

            this.addEntity(entity);
        }
    }

    update(dt) {
        const updateStart = performance.now();

        super.update(dt);

        // 🔥 Frame time calculation
        const updateEnd = performance.now();
        this.frameTime = updateEnd - updateStart;

        // 🔥 Average frame time
        this.frameTimeSamples.push(this.frameTime);
        if (this.frameTimeSamples.length > this.maxSamples) {
            this.frameTimeSamples.shift();
        }
        this.avgFrameTime = this.frameTimeSamples.reduce((a, b) => a + b, 0) / this.frameTimeSamples.length;

        // 🔥 GC spike detection
        if (this.lastFrameTime > 0 && this.frameTime > this.gcSpikeThreshold) {
            this.gcSpikes++;
        }
        this.lastFrameTime = this.frameTime;

        // 🔥 CPU usage estimation (frame time / target frame time)
        this.cpuUsage = Math.min(100, (this.frameTime / 16.67) * 100);

        // 🔥 FPS calculation
        this.frames++;
        const now = performance.now();

        if (now >= this.lastTime + 1000) {
            this.fps = Math.round((this.frames * 1000) / (now - this.lastTime));
            this.frames = 0;
            this.lastTime = now;
            
            // Reset GC spike counter every second
            if (this.gcSpikes > 0) {
                console.log(`⚠️ ${this.gcSpikes} GC spikes detected in last second`);
            }
            this.gcSpikes = 0;
        }

        // 🔥 Camera controls
        const speed = 500;
        if (Keyboard.isPressed("ArrowLeft")) this.game.camera.x -= speed * dt;
        if (Keyboard.isPressed("ArrowRight")) this.game.camera.x += speed * dt;
        if (Keyboard.isPressed("ArrowUp")) this.game.camera.y -= speed * dt;
        if (Keyboard.isPressed("ArrowDown")) this.game.camera.y += speed * dt;

        // 🔥 Update visible count
        this.visibleCount = this._visibleCount || 0;

        // Exit benchmark
        if (Keyboard.isPressed("Escape")) {
            this.game.sceneManager.startScene("Menu");
        }
    }

    render() {
        const { width, height } = this.game.config;

        // 🔥 Render via parent (uses optimized renderer)
        super.render(this.game.renderer);

        // 🔥 Draw enhanced stats overlay
        this.ctx.save();
        
        // Background panel
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        this.ctx.fillRect(10, 10, 320, 260);

        // Title
        this.ctx.fillStyle = "#00FFFF";
        this.ctx.font = "bold 18px monospace";
        this.ctx.fillText("PERFORMANCE METRICS", 20, 35);

        // FPS (color coded)
        this.ctx.font = "16px monospace";
        if (this.fps >= 55) {
            this.ctx.fillStyle = "#00FF00"; // Green
        } else if (this.fps >= 30) {
            this.ctx.fillStyle = "#FFFF00"; // Yellow
        } else {
            this.ctx.fillStyle = "#FF0000"; // Red
        }
        this.ctx.fillText(`FPS: ${this.fps}`, 20, 65);

        // Frame time
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(`Frame Time: ${this.frameTime.toFixed(2)}ms`, 20, 90);
        this.ctx.fillText(`Avg Frame: ${this.avgFrameTime.toFixed(2)}ms`, 20, 110);

        // CPU usage
        const cpuColor = this.cpuUsage > 90 ? "#FF0000" : 
                        this.cpuUsage > 70 ? "#FFFF00" : "#00FF00";
        this.ctx.fillStyle = cpuColor;
        this.ctx.fillText(`CPU Usage: ${this.cpuUsage.toFixed(1)}%`, 20, 130);

        // GC spikes
        this.ctx.fillStyle = this.gcSpikes > 0 ? "#FF0000" : "#00FF00";
        this.ctx.fillText(`GC Spikes: ${this.gcSpikes}/sec`, 20, 150);

        // Entity stats
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillText(`Total Entities: ${this.entities.length}`, 20, 175);
        this.ctx.fillText(`Visible: ${this.visibleCount}`, 20, 195);
        this.ctx.fillText(`Physics: ${this._rigidbody2D.length}`, 20, 215);
        
        // Camera position
        this.ctx.fillStyle = "#888888";
        this.ctx.font = "12px monospace";
        this.ctx.fillText(
            `Cam: (${Math.round(this.game.camera.x)}, ${Math.round(this.game.camera.y)})`, 
            20, 
            240
        );

        // Controls
        this.ctx.fillStyle = "#000000";
        this.ctx.font = "14px monospace";
        this.ctx.fillText("Arrow Keys: Move Camera", 20, height - 60);
        this.ctx.fillText("Use HTML Controls to adjust →", 20, height - 40);
        this.ctx.fillText("ESC: Exit Benchmark", 20, height - 20);

        this.ctx.restore();
    }
}