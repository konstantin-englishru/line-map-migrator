// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// SPA (CSR) режим: клиент рендерит всё сам, на сборке пререндерится только
// HTML-оболочка. `SPA_BUILD=1 npm run build` дополнительно отключает Nitro,
// чтобы получить чистую статику для Nginx на своём сервере.
const staticBuild = process.env['SPA_BUILD'] === "1";

export default defineConfig({
  ...(staticBuild ? { nitro: false as const } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
    // SPA-оболочка нужна только для статической сборки под свой сервер.
    // В обычной (Lovable) сборке она конфликтует с пререндером «/».
    ...(staticBuild
      ? {
          spa: {
            enabled: true,
            prerender: { outputPath: "/index.html" },
          },
        }
      : {}),
  },
});
