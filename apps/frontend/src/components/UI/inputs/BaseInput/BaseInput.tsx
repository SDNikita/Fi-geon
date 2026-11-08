import type { ComponentPropsWithoutRef } from 'react';
import styles from './BaseInput.module.scss';
export type InputSize = 'sm' | 'md' | 'lg';
export type BaseInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
    size?: InputSize;
};
function BaseInput({ size = 'md', type = 'text', className = '', ...props }: BaseInputProps) {
    return (
        <input {...props} type={type} className={[styles.input, styles[size], className].filter(Boolean).join(" ")}/>
    );
}
export default BaseInput;
