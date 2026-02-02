import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      name: "KernelPlay",
      fileName: (format) => `kernelplay.${format}.js`
    },
    rollupOptions: {
      external: [], // add "three", "pixi.js" if you want them external
      output: {
        globals: {
          three: "THREE"
        }
      }
    },
    minify: "terser",
    sourcemap: true
  }
});
