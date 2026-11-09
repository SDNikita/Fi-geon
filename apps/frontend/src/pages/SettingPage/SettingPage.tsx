import { useState } from 'react';
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import Checkbox from '../../components/UI/inputs/Checkbox/Checkbox';

import  styles from "./SettingPage.module.scss"

import { BellIcon, SpeakerHighIcon } from '@phosphor-icons/react';




function SettingPage(){
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    return(
        <main>
            <SectionHeader
                title = "Настройки"
                level={1}>

            </SectionHeader>

            <div className={styles.layout}>
                <div className={styles.appearance}>
                    <span className={styles.title}>Внешний вид</span>
                </div>

                <div className={styles.volume}>
                    <span className={styles.title}>Звук и уведомления</span>

                    <Checkbox
                        label='Уведомления'
                        checked = {notificationsEnabled}
                        onChange={(event)=>setNotificationsEnabled(event.currentTarget.checked)}
                        icon={<BellIcon size={20} />}/>


                    <Checkbox
                        label="Звук игры"
                        checked={soundEnabled}
                        onChange={(event) => setSoundEnabled(event.currentTarget.checked)}/>
                        icon = {<SpeakerHighIcon size={20}/>}
                </div>

                <div className={styles.camera}>
                    <span className={styles.title}>Камера</span>
                </div>

                <div className={styles.account}>
                    <span className={styles.title}>Аккаунт</span>
                </div>
            </div>
            
        </main>
    );
}

export default SettingPage;