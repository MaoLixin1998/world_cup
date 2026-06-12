import { ReactNode } from "react";

type NoticeProps = {
  children: ReactNode;
  icon: ReactNode;
};

export function Notice({ children, icon }: NoticeProps) {
  return (
    <p className="privacy-note">
      {icon}
      <span>{children}</span>
    </p>
  );
}
