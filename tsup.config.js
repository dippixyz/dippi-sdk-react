import { defineConfig } from "tsup";
// import tsconfig from "./tsconfig.json";

export default defineConfig((options) => ({
  entry: [
    "./src/index.tsx",
    "./src/output.css" // add tailwind CSS directives file
  ],
  dts:{
    entry: [
        "./src/index.tsx",
    ]
  },
  format: ["esm", "cjs"],
  name: "dippi-react-sdk",
  external: [
    "react",
    "react-dom"
  ]
// ...
}));