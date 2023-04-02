import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  output: {
    dir: "./dist",
    entryFileNames: "[name].js",
    format: "es",
    exports: "auto",
  },
  plugins: [
    terser(),
    replace({
      "env.PKG_VERSION": pkg.version,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      moduleResolution: "node",
    }),
  ],
};
