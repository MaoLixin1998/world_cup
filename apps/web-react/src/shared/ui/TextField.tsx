import { InputHTMLAttributes, ReactNode } from "react";

// TextField 是“带标签、图标、错误提示的输入框”。
// InputHTMLAttributes 让它可以接收普通 input 的属性，例如 value、onChange、placeholder。
type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  // label 是展示给用户看的字段名，例如 UID、昵称。
  label: string;
  // icon 是输入框左侧的小图标。
  icon: ReactNode;
  // error 有值时显示红色错误提示；没有值时不显示。
  error?: string;
};

/**
 * 通用文本输入框。
 *
 * <p>用 label 包住 input 的好处：
 * 用户点击“UID”文字也能聚焦输入框，屏幕阅读器也知道输入框叫什么。
 */
export function TextField({ label, icon, error, ...inputProps }: TextFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-shell">
        {icon}
        {/* aria-describedby 把输入框和错误提示关联起来，方便无障碍工具朗读。 */}
        <input aria-describedby={error ? `${inputProps.name}-error` : undefined} {...inputProps} />
      </span>
      {error ? (
        // id 必须和 aria-describedby 对上，屏幕阅读器才能读到这个错误。
        <span className="field-error" id={`${inputProps.name}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
