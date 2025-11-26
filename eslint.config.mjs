import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",      // ignore unused vars
      "@typescript-eslint/no-explicit-any": "off",     // allow any
      "react-hooks/rules-of-hooks": "off",             // ignore hooks in callbacks
      "react-hooks/exhaustive-deps": "off",            // skip dependency warnings
      "@next/next/no-img-element": "off",             // allow <img>
      "react/no-unescaped-entities": "off",           // ignore unescaped quotes
    },
  },
];

export default eslintConfig;
