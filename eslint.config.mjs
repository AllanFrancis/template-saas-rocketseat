import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      prettier, // plugin do prettier integrado ao ESLint
    },
    rules: {
      // aplica o prettier como uma regra de lint
      "prettier/prettier": [
        "error",
        {
          printWidth: 200, // define o limite de colunas
        },
      ],
      // regra extra do eslint para também avisar se passar do limite
      "max-len": ["error", { code: 200 }],
    },
  },
];

export default eslintConfig;
