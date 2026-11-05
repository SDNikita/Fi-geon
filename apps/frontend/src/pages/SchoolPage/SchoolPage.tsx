import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import Button from "../../components/UI/button/Button/Button";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
import styles from "./SchoolPage.module.scss";
import RadioCard from '../../components/UI/inputs/RadioCard/RadioCard';

import dragonIcon from '../../assets/school-dragon.svg'
import tigerIcon from '../../assets/school-tiger.svg';
import snakeIcon from '../../assets/school-snake.svg';
import eagleIcon from '../../assets/school-eagle.svg';

const schools = [
    {
      value: "dragon",
      title: "Дракон",
      description: "Сила и стойкость",
      icon:dragonIcon,
    },
    {
      value: "tiger",
      title: "Тигр",
      description: "Мощные атаки",
      icon:tigerIcon,
    },
    {
      value: "snake",
      title: "Змея",
      description: "Гибкость и точность",
      icon:snakeIcon,
    },
    {
      value: "eagle",
      title: "Небесный орёл",
      description: "Скорость и баланс",
      icon:eagleIcon,
    },
  ];

function SchoolPage() {
  const navigate = useNavigate();
const [school, setSchool] = useState('dragon');
  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <div className={styles.content}>
          <SectionHeader
            className={styles.intro}
            titleClassName={styles.heading}
            level={1}
            title="Выбери школу"
            description="Каждая школа — свой стиль боя. Найди тот, что подходит тебе."
          />

          <div className={styles.selection}>
            <p className={styles.schoolLabel}>Школа ученика</p>
            <div className={styles.schools}>
                {schools.map((item) => (
                    <RadioCard
                        key={item.value}
                        icon={<img src={item.icon} alt="" />}
                        name="school"
                        value={item.value}
                        title={item.title}
                        description={item.description}
                        checked={school === item.value}
                        onChange={setSchool}
                    />
                ))}
            </div>
          </div>


          <div className={styles.actions}>
            <Button size="lg" fullWidth onClick={() => navigate("/")}>
              Продолжить
            </Button>
          </div>
          <div className={styles.footerText}>
            <span>Школу можно сменить позже</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SchoolPage;
