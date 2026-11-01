import type { ReactNode } from "react";
import BaseButton from "../BaseButton/BaseButton";
import type { BaseButtonProps } from "../BaseButton/BaseButton";
import "./Button.scss";

type ButtonProps = BaseButtonProps & {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

function Button({
  children,
  startIcon,
  endIcon,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <BaseButton {...props} className={`button ${className}`}>
      {startIcon && (
        <span className="button__icon" aria-hidden="true">
          {startIcon}
        </span>
      )}

      <span className="button__label">{children}</span>

      {endIcon && (
        <span className="button__icon" aria-hidden="true">
          {endIcon}
        </span>
      )}
    </BaseButton>
  );
}
export default Button;