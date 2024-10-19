import twindConfig from "./twind.config.ts";
import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";

export default defineConfig({
  plugins: [twindPlugin(twindConfig)],
});
