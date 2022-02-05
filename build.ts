import { serve, build } from "esbuild";
// import { sassPlugin } from "./plugin/esbuild-plugin-sass";
import path from 'path';
import sassPlugin from "esbuild-plugin-sass";

const isDev = process.env.NODE_ENV === '"development"';

build({
  define: { "process.env.NODE_ENV": process.env.NODE_ENV as string },
  target: "es2015",
  platform: "browser",
  entryPoints: [path.resolve(__dirname, 'src/index.tsx')],
  outdir: "public",
  bundle: true,
  minify: !isDev,
  sourcemap: isDev,
  treeShaking: true,
  plugins: [sassPlugin()],
  watch: {
    onRebuild(err, result) {
      console.log(JSON.stringify(err?.errors));
      console.log(JSON.stringify(result?.warnings));
    },
  },
}).then(() => {
  console.log("===========================================");
  console.log(`${new Date().toLocaleString()}: watching...`);
}).catch((err) => console.log(`Error: ${JSON.stringify(err)}`));

serve