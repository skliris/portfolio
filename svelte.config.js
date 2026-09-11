import adapter from "@sveltejs/adapter-static";
import { preprocessMeltUI } from "@melt-ui/pp";
import sequence from "svelte-sequential-preprocessor";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "index.html",
      strict: false,
    }),
    paths: {
      base: "/portfolio",
    },
  },
};

export default config;
