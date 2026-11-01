import type { ReactNode } from 'react';
import BaseButton from '../BaseButton/BaseButton';
import type { BaseButtonProps } from '../BaseButton/BaseButton';
import './IconButton.scss';

export type IconButtonProps = Omit<
    BaseButtonProps,
    'children' | 'aria-label' | 'fullWidth'
> & {
    children: ReactNode;
    label: string;
};

function IconButton({
    children,
    label,
    variant = 'secondary',
    className = '',
    ...props
}: IconButtonProps) {
    return (
        <BaseButton
            {...props}
            variant={variant}
            aria-label={label}
            className={`icon-button ${className}`}
        >
            <span className="icon-button__icon" aria-hidden="true">
                {children}
            </span>
        </BaseButton>
    );
}

export default IconButton;