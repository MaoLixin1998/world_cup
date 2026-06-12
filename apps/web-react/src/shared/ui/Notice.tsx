import { ReactNode } from "react";

// Notice 是一条带图标的提示信息，比如隐私说明、安全说明。
type NoticeProps = {
  // children 是提示文字；React 里组件标签中间的内容会进入 children。
  children: ReactNode;
  // icon 是提示条左侧的图标。
  icon: ReactNode;
};

/**
 * 通用提示条组件。
 *
 * <p>它只负责结构：左侧图标 + 右侧文字；颜色、边框、间距都交给 CSS。
 */
export function Notice({ children, icon }: NoticeProps) {
  return (
    <p className="privacy-note">
      {icon}
      <span>{children}</span>
    </p>
  );
}
