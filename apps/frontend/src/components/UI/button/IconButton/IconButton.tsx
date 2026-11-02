import type { ReactNode } from 'react';
import BaseButton from '../BaseButton/BaseButton';
import type { BaseButtonProps } from '../BaseButton/BaseButton';
import styles from './IconButton.module.scss';
export type IconButtonProps = Omit<BaseButtonProps, 'children' | 'aria-label' | 'fullWidth'> & {
    children: ReactNode;
    label: string;
};
function IconButton({ children, label, variant = 'secondary', className = '', ...props }: IconButtonProps) {
    return (<BaseButton {...props} variant={variant} aria-label={label} className={[styles.button, className].filter(Boolean).join(" ")}>
            <span className={styles.icon} aria-hidden="true">
                {children}
            </span>
        </BaseButton>);
}
export default IconButton;
