import type { ComponentPropsWithoutRef } from 'react';
import type { InputSize } from '../BaseInput/BaseInput';
import styles from './Checkbox.module.scss';
type CheckboxProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'size' | 'children'> & {
    label: string;
    size?: InputSize;
};
function Checkbox({ label, size = 'md', className = '', disabled, ...props }: CheckboxProps) {
    return (<label className={[styles.checkbox, styles[size]].join(" ")}>
            <input {...props} type="checkbox" disabled={disabled} className={[styles.control, className].filter(Boolean).join(" ")}/>

            <span className={styles.label}>
                {label}
            </span>
        </label>);
}
export default Checkbox;
