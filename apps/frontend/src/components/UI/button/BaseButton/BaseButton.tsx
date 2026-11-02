import type { ComponentPropsWithoutRef } from "react";
import styles from './BaseButton.module.scss';
export type BaseButtonProps = ComponentPropsWithoutRef<"button"> & {
    variant?: "primary" | "secondary" | "gold" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
};
function BaseButton({ children, variant = "primary", size = "md", fullWidth = false, type = "button", className = "", ...props }: BaseButtonProps) {
    const classes = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        className,
    ].filter(Boolean).join(" ");
    return (<button {...props} type={type} className={classes}>
            {children}
        </button>);
}
export default BaseButton;
