import { ButtonHTMLAttributes, ReactNode } from "react";

// ButtonHTMLAttributes 代表普通 button 支持的所有属性，例如 type、disabled、onClick。
// 这里再额外加一个 icon，让按钮左侧可以放足球图标。
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
};

/**
 * 项目里的通用主按钮。
 *
 * <p>children 是按钮文字；icon 是可选图标；className 允许特殊场景补额外样式。
 */
export function Button({ children, icon, className = "", ...props }: ButtonProps) {
  return (
    // ...props 会把 type、onClick、disabled 等属性原样传给真正的 button。
    <button className={`primary-action ${className}`.trim()} {...props}>
      {icon}
      {children}
    </button>
  );
}
