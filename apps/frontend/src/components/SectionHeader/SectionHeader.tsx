import type { ReactNode } from 'react';
import styles from './SectionHeader.module.scss';
type SectionHeaderProps = {
    title: ReactNode;
    titleClassName?: string;
    description?: string;
    action?: ReactNode;
    level?: 1 | 2 | 3;
    headingId?: string;
    className?: string;
};
function SectionHeader({
    title,
    titleClassName = '',
    description,
    action,
    level = 2,
    headingId,
    className = '',
}: SectionHeaderProps) {
    const headings = { 1: 'h1', 2: 'h2', 3: 'h3' } as const;
    const Heading = headings[level];

    return (<header className={[styles.header, className].filter(Boolean).join(' ')}>
            <div className={styles.content}>
                <Heading
                    id={headingId}
                    className={[styles.title, styles[`h${level}`], titleClassName].filter(Boolean).join(' ')}
                >
                    {title}
                </Heading>

                {description && (<p className={styles.description}>
                        {description}
                    </p>)}
            </div>

            {action && (<div className={styles.action}>
                    {action}
                </div>)}
        </header>);
}
export default SectionHeader;
