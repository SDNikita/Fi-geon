import { useId } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { InputSize } from '../BaseInput/BaseInput';
import inputStyles from '../BaseInput/BaseInput.module.scss';
import fieldStyles from '../Input/Input.module.scss';
import styles from './Select.module.scss';


type SelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
    
};
type SelectProps = Omit<ComponentPropsWithoutRef<'select'>, 'size' | 'children' | 'multiple'> & {
    label: string;
    options: SelectOption[];
    size?: InputSize;
    icon?:ReactNode;
};
function Select({ label, options, size = 'md', id, className = '',icon, ...props }: SelectProps) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (<div className={styles.field} data-slot="input-field">
            <label className={styles.label} htmlFor={selectId}>
                {icon && <span className={styles.icon}>{icon}</span>}
                {label}
            </label>
            <select {...props} id={selectId} className={[inputStyles.input, inputStyles[size], styles.select, className].filter(Boolean).join(" ")}>
                {options.map((option) => (<option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                    </option>))}
            </select>
        </div>);
}
export default Select;
