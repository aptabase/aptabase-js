import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };

const plugins = [
  terser(),
  replace({
    "env.PKG_VERSION": pkg.version,
  }),
  typescript({
    tsconfig: "./tsconfig.json",
    moduleResolution: "node",
  }),
];

const cjs = {
  input: "./src/index.ts",
  output: {
    dir: "./dist",
    entryFileNames: "[name].js",
    format: "cjs",
  },
  plugins,
};

const es = {
  input: "./src/index.ts",
  output: {
    dir: "./dist",
    entryFileNames: "[name].mjs",
    format: "es",
  },
  plugins,
};

export default [cjs, es];
