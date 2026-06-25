import { defineConfig } from "astro/config";

export default defineConfig({
  build: {
    assets: "notes/_astro",
  },
  output: "static",
  site: "https://yioo.link",
  trailingSlash: "always",
});
