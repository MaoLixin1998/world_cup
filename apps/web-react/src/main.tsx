import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";

// React 应用入口：把根组件 App 挂载到 index.html 里的 #root 节点。
// StrictMode 会在开发环境帮助发现潜在副作用，适合学习和早期开发阶段。
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // StrictMode 不会出现在真实页面里，它只是开发时帮我们发现问题。
  <React.StrictMode>
    {/* App 是整个前端的根组件，后续所有页面都从它往下挂。 */}
    <App />
  </React.StrictMode>
);
