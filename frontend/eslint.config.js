import react from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";

export default [
    {
        ignores: ["node_modules/**", "dist/**"],
    },
    {
        files: ["**/*.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                window: "readonly",
                document: "readonly"
            }
        },
        plugins: {
            react,
            "react-hooks": hooks
        },
        settings: {
            react: { version: "detect" }
        },
        rules: {
            "no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^(React|[A-Z])"
            }],
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off",
            "react/jsx-uses-vars": "error",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn"
        }
    }
];
