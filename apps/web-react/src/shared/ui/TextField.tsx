import { InputHTMLAttributes, ReactNode } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
};

export function TextField({ label, icon, error, ...inputProps }: TextFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <span className="input-shell">
        {icon}
        <input aria-describedby={error ? `${inputProps.name}-error` : undefined} {...inputProps} />
      </span>
      {error ? (
        <span className="field-error" id={`${inputProps.name}-error`}>
          {error}
        </span>
      ) : null}
    </label>
  );
}
