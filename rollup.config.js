import { exec } from "child_process";
import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { sveltePreprocess } from "svelte-preprocess";
import os from "os";
import fs from "fs";

const production = !process.env.ROLLUP_WATCH;
const buildEnv = process.env.BUILD_ENV;

function serve() {
  return {
    name: 'serve',
    writeBundle() {
      if (production) {
        try {
          const manifestSource = path.join('public/manifests', 
            buildEnv === 'firefox' ? 'manifest_firefox.json' : 'manifest_chrome.json');
          const manifestDest = 'public/manifest.json';
          
          fs.copyFileSync(manifestSource, manifestDest);
          console.log(`Manifest copied successfully`);
        } catch (error) {
          console.error('Failed to copy manifest:', error);
        }
      } else {
        const command = os.platform() === "linux"
          ? "brave-browser --reload-extension=public/build"
          : '"/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" --reload-extension=public/build';

        exec(command, (error) => {
          if (error) {
            console.error("Failed to open Brave:", error);
          }
        });
      }
    },
  };
}

function buildConfig(inputFileName, outputFileName) {
  return {
    input: `src/${inputFileName}.ts`,
    output: {
      file: `public/build/${outputFileName}.js`,
      format: "iife",
      name: "app",
      sourcemap: !production,
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production,
          css: true,
        },
        preprocess: sveltePreprocess({
          typescript: {
            tsconfigFile: "./tsconfig.app.json",
          },
        }),
      }),
      typescript({ sourceMap: !production, tsconfig: "./tsconfig.app.json" }),
      resolve({ browser: true, dedupe: ['svelte'] }),
      commonjs(),
    ],
    watch: {
      clearScreen: false,
    },
  };
}

export default [
  buildConfig("popup", "popup"),
  buildConfig("dashboard", "dashboard"),
  {
    input: "src/scripts/background.ts",
    output: {
      format: buildEnv === 'firefox' ? 'iife' : 'es',
      name: "background",
      file: "public/background.js",
      sourcemap: !production,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.background.json",
        sourceMap: !production,
      }),
      commonjs(),
      resolve({ browser: true, preferBuiltins: false }),
      serve()
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/scripts/content.ts",
    output: {
      format: "iife",
      name: "content",
      file: "public/content.js",
      sourcemap: !production,
    },
    plugins: [
      typescript({
        tsconfig: "./tsconfig.background.json",
      }),
      commonjs(),
      resolve({ browser: true, preferBuiltins: false }),
      serve(),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
