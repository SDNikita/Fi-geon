import type { ReactNode } from "react";
import BaseButton from "../BaseButton/BaseButton";
import type { BaseButtonProps } from "../BaseButton/BaseButton";
import styles from './Button.module.scss';
type ButtonProps = BaseButtonProps & {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
};
function Button({ children, startIcon, endIcon, className = "", ...props }: ButtonProps) {
    return (<BaseButton {...props} className={[styles.button, className].filter(Boolean).join(" ")}>
      {startIcon && (<span className={styles.icon} aria-hidden="true">
          {startIcon}
        </span>)}

      <span className={styles.label}>{children}</span>

      {endIcon && (<span className={styles.icon} aria-hidden="true">
          {endIcon}
        </span>)}
    </BaseButton>);
}
export default Button;
