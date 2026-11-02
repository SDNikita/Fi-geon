import { useNavigate } from 'react-router-dom';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import styles from './HomePage.module.scss';
import emblem from '../../assets/mountain-peak.svg';
// import emblem2 from '../../assets/qi-flow.svg';
// import emblem3 from '../../assets/school-seal.svg';
import Button from '../../components/UI/button/Button/Button';

function HomePage() {
    const navigate = useNavigate();
    return (
    <main className={styles.page}>
    <div className={styles.layout}>
        <div className={styles.art}>
            <img
                className={styles.emblem}
                src={emblem}
                alt=""
            />
        </div>

        <div className={styles.content}>
            <SectionHeader
                className={styles.intro}
                level={1}
                titleClassName={styles.brandTitle}
                title={
                    <>
                        <span className={styles.brandName}>Dungeon</span>
                        <span className={styles.brandSubtitle}>Training</span>
                    </>
                }
                description="Твоя тренировка — твоё приключение"
            />

            <div className={styles.actions}>
                <Button size="lg" fullWidth onClick={() => navigate('/training')}>
                    Начать путь
                </Button>

                <div className={styles.login}>
                    <span>Уже есть аккаунт?</span>
                    <Button variant="ghost" size="sm">
                        Войти
                    </Button>
                </div>
            </div>
        </div>
    </div>
</main>);
}
export default HomePage;
