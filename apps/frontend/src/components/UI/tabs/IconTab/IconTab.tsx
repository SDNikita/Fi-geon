import type { ReactNode } from 'react';
import BaseTab from '../BaseTab/BaseTab';
import type { BaseTabProps } from '../BaseTab/BaseTab';
import styles from './IconTab.module.scss';
type IconTabProps = Omit<BaseTabProps, 'children' | 'aria-label'> & {
    icon: ReactNode;
    label: string;
};
function IconTab({ icon, label, className = '', ...props }: IconTabProps) {
    return (<BaseTab {...props} aria-label={label} className={[styles.tab, className].filter(Boolean).join(" ")}>
            <span className={styles.icon} aria-hidden="true">
                {icon}
            </span>
        </BaseTab>);
}
export default IconTab;
