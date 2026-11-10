import SectionHeader from '../../../SectionHeader/SectionHeader';
import NavTab  from '../../tabs/NavTab/NavTab';
import styles from './AppNavigation.module.scss';

import Logo from '../../../../assets/mountain-peak.svg'

import { HouseIcon, ChartBarIcon, UserIcon, GearIcon } from '@phosphor-icons/react';
import type { ReactNode } from 'react';


type NavigationItem = {
    to: string;
    label: string;
    icon: ReactNode;
    mobile: boolean;
};


const items: NavigationItem[]=[
    {
        to: '/dungeon',
        label: 'Главная',
        icon: <HouseIcon size={20} />,
        mobile:true
    },
    {
        to: '/progress',
        label: 'Прогресс',
        icon: <ChartBarIcon size = {20}/>,
        mobile:true
    },
    {
        to: '/profile',
        label: 'Профиль',
        icon:<UserIcon size = {20}/>,
        mobile:true
    },
    {
        to: '/settings',
        label: 'Настройки',
        icon:<GearIcon size = {20}/>,
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
                    icon={item.icon}
                    >
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