import type { ComponentPropsWithoutRef } from "react";
import "./BaseButton.scss";

export type BaseButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "primary" | "secondary" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

function BaseButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  type = "button",
  className = "",
  ...props
}: BaseButtonProps) {
  const classes = [
    "base-button",
    `base-button--${variant}`,
    `base-button--${size}`,
    fullWidth && "base-button--full-width",
    className,
  ].filter(Boolean).join(" ");
  return (
    <button
        {...props}
        type ={type}
        className={classes}>
            {children}
        </button>
  );
}
export default BaseButton;