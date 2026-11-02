import { useId } from 'react';
import BaseInput from '../BaseInput/BaseInput';
import type { BaseInputProps } from '../BaseInput/BaseInput';
import styles from './Input.module.scss';
export type InputProps = BaseInputProps & {
    label: string;
    hint?: string;
    error?: string;
};
function Input({ label, hint, error, id, className = '', 'aria-describedby': describedBy, ...props }: InputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const message = error || hint;
    const messageId = `${inputId}-message`;
    const description = [
        describedBy,
        message ? messageId : undefined,
    ].filter(Boolean).join(' ') || undefined;
    return (<div className={styles.field} data-slot="input-field">
            <label className={styles.label} htmlFor={inputId}>
                {label}
            </label>

            <BaseInput {...props} id={inputId} className={className} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={description}/>

            {message && (<span id={messageId} className={error
                ? [styles.message, styles.messageError].join(" ") : styles.message}>
                    {message}
                </span>)}
        </div>);
}
export default Input;
