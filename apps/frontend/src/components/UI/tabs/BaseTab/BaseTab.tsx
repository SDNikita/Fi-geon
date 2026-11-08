import type { ComponentPropsWithoutRef } from 'react';
import styles from './BaseTab.module.scss';
export type BaseTabProps = Omit<ComponentPropsWithoutRef<'button'>, 'role' | 'aria-selected' | 'aria-controls' | 'tabIndex'> & {
    selected: boolean;
    panelId: string;
    id: string;
    size?: 'sm' | 'md' | 'lg';
    tabIndex?: number;
};
function BaseTab({ children, selected, panelId, size = 'md', type = 'button', className = '', tabIndex = selected ? 0 : -1, ...props }: BaseTabProps) {
    const classes = [
        styles.tab,
        styles[size],
        selected && styles.selected,
        className,
    ].filter(Boolean).join(' ');
    return (<button {...props} type={type} role="tab" aria-selected={selected} aria-controls={panelId} tabIndex={tabIndex} className={classes}>
            {children}
        </button>);
}
export default BaseTab;
