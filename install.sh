npm install --save-dev eslint@^7.2.0
./node_modules/.bin/eslint --init
# ✔ How would you like to use ESLint? · style
# ✔ What type of modules does your project use? · esm
# ✔ Which framework does your project use? · react
# ✔ Does your project use TypeScript? · No / Yes
# ✔ Where does your code run? · browser
# ✔ How would you like to define a style for your project? · guide
# ✔ Which style guide do you want to follow? · airbnb
# ✔ What format do you want your config file to be in? · JavaScript
# Checking peerDependencies of eslint-config-airbnb@latest

echo 'module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier", "prettier/react"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["react", "prettier"],
  rules: {
    "react/jsx-filename-extension": 0,
    "prettier/prettier": ["error"],
  },
};' > .eslintrc.js

npm install --save-dev eslint-config-react-app
npm install --save-dev eslint-config-prettier eslint-plugin-prettier prettier
git init
npm install --save-dev husky lint-staged

tmp="$(mktemp)"
sed '$d' package.json | sed '$d' > "$tmp"
echo '  },
  "husky": {
      "hooks": {
        "pre-commit": "lint-staged"
      }
  },
  "lint-staged": {
      "src/**/*.js": [
        "eslint --fix",
        "prettier --write",
        "git add"
      ]
  }
}' >> "$tmp"
mv "$tmp" package.json
