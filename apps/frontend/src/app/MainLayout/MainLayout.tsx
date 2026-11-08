import { Outlet } from 'react-router-dom';

import AppNavigation from '../../components/UI/navigation/AppNavigation/AppNavigation'
import styles from './MainLayout.module.scss';

function MainLayout() {
    return (
        <div className={styles.shell}>
            <AppNavigation />

            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;