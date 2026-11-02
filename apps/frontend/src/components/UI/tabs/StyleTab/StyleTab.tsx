import BaseTab from '../BaseTab/BaseTab';
import type { BaseTabProps } from '../BaseTab/BaseTab';
import styles from './StyleTab.module.scss';
function StyleTab({ className = '', ...props }: BaseTabProps) {
    return (<BaseTab {...props} className={[styles.tab, className].filter(Boolean).join(" ")}/>);
}
export default StyleTab;
