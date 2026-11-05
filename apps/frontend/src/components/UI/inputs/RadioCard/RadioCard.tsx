import type { ReactNode } from 'react';
import styles from './RadioCard.module.scss';

type RadioCardProps = {
    name: string;
    value: string;
    title: string;
    description: string;
    icon?: ReactNode;
    checked: boolean;
    onChange: (value: string) => void;
};

function RadioCard({
    name,
    value,
    title,
    description,
    icon,
    checked,
    onChange,
}: RadioCardProps) {
    return(
        <label className={styles.card}>
            {icon &&(
                <span className={styles.icon}>
                    {icon}
                </span>)}

                <span className={styles.content}>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.description}>{description}</span>
                </span>

                <input 
                    type="radio"
                    className={styles.radio}
                    name={name}
                    value={value}
                    checked = {checked}
                    onChange={()=>onChange(value)} />
        </label>
    );
}

export default RadioCard;
