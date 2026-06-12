import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
};

export function Button({ children, icon, className = "", ...props }: ButtonProps) {
  return (
    <button className={`primary-action ${className}`.trim()} {...props}>
      {icon}
      {children}
    </button>
  );
}
