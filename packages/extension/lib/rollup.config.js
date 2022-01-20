import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

// const extensions = [".js", ".jsx", ".ts", ".tsx"];
const input = "src/index.ts";

const plugins = [
  resolve(),
  terser(),
  typescript({
    typescript: require("typescript"),
  }),
];

export default [
  {
    input,
    output: {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
    plugins,
  },
  {
    input,
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    plugins,
  },
];
