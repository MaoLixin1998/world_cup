import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";

// React 应用入口：把根组件 App 挂载到 index.html 里的 #root 节点。
// StrictMode 会在开发环境帮助发现潜在副作用，适合学习和早期开发阶段。
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
