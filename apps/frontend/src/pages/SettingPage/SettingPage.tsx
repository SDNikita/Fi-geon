import { useState } from 'react';

import SectionHeader from "../../components/SectionHeader/SectionHeader";
import Checkbox from '../../components/UI/inputs/Checkbox/Checkbox';
import Button from '../../components/UI/button/Button/Button';
import Select from '../../components/UI/inputs/Select/Select';

import  styles from "./SettingPage.module.scss"

import { BellIcon, SpeakerHighIcon,FlipHorizontalIcon,SignOutIcon,GlobeIcon,MoonIcon, ArrowLeftIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';




function SettingPage(){
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [cameraAlternativEnabled, setcameraAlternativEnabled] = useState(false);
    const [theme, setTheme] = useState('system');
    
    return(
        <main>
            <div className={styles.layout}>
                <div className={styles.topbar}>
                    <Link
                        to= "/profile"
                        className={styles.back}
                        aria-label = "Назад в профиль">
                            <ArrowLeftIcon size={24} />
                    </Link>

                    <SectionHeader
                        title = "Настройки"
                        level={1}>
                    </SectionHeader>
                </div>
                

                <div className={styles.content}> 
                    <section className={styles.card}>
                        <h2 className={styles.title}>Внешний вид</h2>
                        <Select
                            label = "Тема"
                            value = {theme}
                            icon = {<MoonIcon size={20}/>}
                            onChange={(event) => setTheme(event.currentTarget.value)}
                            options={[
                                { value: 'system', label: 'Как в системе' },
                                { value: 'dark', label: 'Тёмная' },
                                { value: 'light', label: 'Светлая' },
                            ]}/>

                            <Select
                                label = "Язык"
                                icon = {<GlobeIcon size={20}/>}
                                value = {theme}
                                onChange={(event) => setTheme(event.currentTarget.value)}
                                options={[
                                    { value: 'rus', label: 'Русский' },
                                    { value: 'eng', label: 'Английский' },
                            ]}/>
                    </section>

                    <section className={styles.card}>
                        <h2 className={styles.title}>Звук и уведомления</h2>

                        <Checkbox
                            label='Уведомления'
                            checked = {notificationsEnabled}
                            onChange={(event)=>setNotificationsEnabled(event.currentTarget.checked)}
                            icon={<BellIcon size={20} />}/>


                        <Checkbox
                            label="Звук игры"
                            checked={soundEnabled}
                            onChange={(event) => setSoundEnabled(event.currentTarget.checked)}
                            icon = {<SpeakerHighIcon size={20}/>}/>
                    </section>

                    <section className={styles.card}>
                        <h2 className={styles.title}>Камера</h2>
                        <Checkbox
                            label = "Зеркальное изображение"
                            checked={cameraAlternativEnabled}
                            onChange={(event) => setcameraAlternativEnabled(event.currentTarget.checked)}
                            icon = {<FlipHorizontalIcon size = {20}/>}/>
                    </section>

                    <section className={styles.card}>
                        <h2 className={styles.title}>Аккаунт</h2>
                        <Button
                            variant='ghost'
                            className={styles.logOut}
                            startIcon = {<SignOutIcon size = {20}/>}
                            >Выйти из аккаунта</Button>
                    </section>
                </div>
            </div>
            
        </main>
    );
}

export default SettingPage;