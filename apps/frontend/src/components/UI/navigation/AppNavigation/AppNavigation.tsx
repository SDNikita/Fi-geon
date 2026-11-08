import SectionHeader from '../../../SectionHeader/SectionHeader';
import NavTab  from '../../tabs/NavTab/NavTab';
import styles from './AppNavigation.module.scss';

import Logo from '../../../../assets/mountain-peak.svg'


const iconPaths = {
    home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3V10Z',
    progress: 'M5 20v-6M12 20V9M19 20V4',
    profile: 'M20 21v-2a8 8 0 0 0-16 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    settings: 'M4 7h16M4 17h16M8 4v6M16 14v6',
    kit: 'M3 3h7v7H3V3ZM14 3h7v7h-7V3ZM3 14h7v7H3v-7ZM14 14h7v7h-7v-7Z',
};

type NavigationItem = {
    to: string;
    label: string;
    icon: keyof typeof iconPaths;
    mobile: boolean;
};


const items: NavigationItem[]=[
    {
        to: '/dungeon',
        label: 'Главная',
        icon: 'home',
        mobile:true
    },
    {
        to: '/progress',
        label: 'Прогресс',
        icon: 'progress',
        mobile:true
    },
    {
        to: '/profile',
        label: 'Профиль',
        icon: 'profile',
        mobile:true
    },
    {
        to: '/settings',
        label: 'Настройки',
        icon: 'settings',
        mobile:false
    },    
];

function AppNavigation(){
    const level =1;
    const experience = 350;
    const nextLevelExperience = 1000;

   return(
    <nav className={styles.navigation}>

        <SectionHeader  className={styles.header}
            title = "Dungeon Training"
            description = "Путь воина"
            icon ={
                <img src={Logo} alt = ""/>
            }>

        </SectionHeader>
        

        <div className={styles.links}>
            {items.map((item) =>(
                <NavTab
                    key={item.to}
                    to={item.to}
                    className={[styles.link,!item.mobile && styles.desktopOnly,].filter(Boolean).join(' ')}
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.8}
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d={iconPaths[item.icon]} />
                            </svg>
                        }>
                        {item.label}

                </NavTab>
            ))}
        </div>
        
        <div className={styles.bottom}>
            <div className={styles.levelCard}>
                <div className={styles.levelHeading}>
                    <strong>Уровень {level}</strong>
                     <span className={styles.levelIcon}>⚔</span>
                </div>

                <progress
                    className={styles.experienceBar}
                    value={experience}
                    max = {nextLevelExperience}>
                    {experience}/{nextLevelExperience} XP
                </progress>

                <p className={styles.experienceText}>
                    {experience} / {nextLevelExperience} XP
                </p>
            </div>
        </div>

    </nav>
   );
}

export default AppNavigation;