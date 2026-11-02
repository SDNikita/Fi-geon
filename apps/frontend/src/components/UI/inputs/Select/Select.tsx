import { useId } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
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
};
function Select({ label, options, size = 'md', id, className = '', ...props }: SelectProps) {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    return (<div className={fieldStyles.field} data-slot="input-field">
            <label className={fieldStyles.label} htmlFor={selectId}>
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
