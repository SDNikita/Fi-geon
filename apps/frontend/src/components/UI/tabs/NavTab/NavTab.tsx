import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import type { NavLinkProps } from 'react-router-dom';
import styles from './NavTab.module.scss';
type NavTabProps = Omit<NavLinkProps, 'children' | 'className' | 'style'> & {
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
};
function NavTab({ children, icon, className = '', ...props }: NavTabProps) {
    return (<NavLink {...props} className={({ isActive }) => [
            styles.tab,
            isActive && styles.active,
            className,
        ].filter(Boolean).join(' ')}>
            {icon && (<span className={styles.icon} aria-hidden="true">
                    {icon}
                </span>)}

            <span>{children}</span>
        </NavLink>);
}
export default NavTab;
