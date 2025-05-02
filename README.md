# AeroAgriculture

A modern web application for agricultural drone management and field analysis built with React, TypeScript, and Vite.

## Project Structure

The project follows a scalable folder structure:

```
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable UI components
│   ├── auth/       # Authentication related components
│   ├── Dashboard/  # Dashboard specific components
│   └── Layout/     # Layout components (Header, Sidebar, etc.)
├── pages/          # Page components that represent routes
│   └── auth/       # Authentication pages (Login, Register)
├── store/          # State management with Zustand
└── utils/          # Utility functions and helpers
```

## Features

- **Authentication System**: Login page with form validation
- **Protected Routes**: Secure access to dashboard and other features
- **Responsive Design**: Works on mobile, tablet, and desktop
- **State Management**: Using Zustand for global state
- **Theme Support**: Light and dark mode with Chakra UI

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
