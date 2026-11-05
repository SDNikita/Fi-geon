import { useId, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import IconButton from "../../components/UI/button/IconButton/IconButton";
import MediaButton from "../../components/UI/button/MediaButton/MediaButton";
import Button from "../../components/UI/button/Button/Button";
import styles from './UiKitPage.module.scss';
import Input from "../../components/UI/inputs/Input/Input";
import TextInput from "../../components/UI/inputs/TextInput/TextInput";
import Select from "../../components/UI/inputs/Select/Select";
import Checkbox from "../../components/UI/inputs/Checkbox/Checkbox";
import RadioCard from "../../components/UI/inputs/RadioCard/RadioCard";
import dragonIcon from "../../assets/school-dragon.svg";
import tigerIcon from "../../assets/school-tiger.svg";
import snakeIcon from "../../assets/school-snake.svg";
import eagleIcon from "../../assets/school-eagle.svg";
import BaseTab from "../../components/UI/tabs/BaseTab/BaseTab";
import StyleTab from "../../components/UI/tabs/StyleTab/StyleTab";
import IconTab from "../../components/UI/tabs/IconTab/IconTab";
import NavTab from "../../components/UI/tabs/NavTab/NavTab";
import SectionHeader from "../../components/SectionHeader/SectionHeader";
const modes = [
    {
        value: "story",
        label: "Сюжетный",
        content: "Проходите уровни и открывайте историю ученика.",
    },
    {
        value: "daily",
        label: "Ежедневный",
        content: "Выполняйте испытание дня и получайте награду.",
    },
    {
        value: "endless",
        label: "Бесконечный",
        content: "Побеждайте всё более сильных противников.",
    },
];
const characteristics = [
    { value: "strength", label: "Сила", icon: "力" },
    { value: "endurance", label: "Выносливость", icon: "耐" },
];
const sizes = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
] as const;

const schoolOptions = [
    { value: 'dragon', title: 'Дракон', description: 'Сила и стойкость', icon: dragonIcon },
    { value: 'tiger', title: 'Тигр', description: 'Мощные атаки', icon: tigerIcon },
    { value: 'snake', title: 'Змея', description: 'Гибкость и точность', icon: snakeIcon },
    { value: 'eagle', title: 'Небесный орёл', description: 'Скорость и баланс', icon: eagleIcon },
];

const trainingGoals = [
    { value: 'short', title: 'Короткая тренировка', description: 'Цель — 5 минут' },
    { value: 'regular', title: 'Обычная тренировка', description: 'Цель — 15 минут' },
    { value: 'long', title: 'Продолжительная тренировка', description: 'Цель — 30 минут' },
];
// Обёртка остаётся на странице: отдельный файл TabList не нужен.
function TabList({ label, children }: {
    label: string;
    children: ReactNode;
}) {
    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
            return;
        const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="tab"]:not(:disabled)'));
        const index = tabs.findIndex((tab) => tab === document.activeElement);
        if (index === -1)
            return;
        event.preventDefault();
        let next = index;
        if (event.key === "ArrowRight")
            next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft")
            next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home")
            next = 0;
        if (event.key === "End")
            next = tabs.length - 1;
        tabs[next].focus();
        tabs[next].click();
    }
    return (<div role="tablist" aria-label={label} className={styles.tabs} onKeyDown={handleKeyDown}>
      {children}
    </div>);
}
function UiKitPage() {
    const prefix = useId();
    const [baseTab, setBaseTab] = useState("story");
    const [styleTab, setStyleTab] = useState("story");
    const [iconTab, setIconTab] = useState("strength");
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedSchool, setSelectedSchool] = useState('dragon');
    const [selectedGoal, setSelectedGoal] = useState('regular');
    return (<main className={styles.page}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>Dungeon Training</span>
        <h1>UI-kit</h1>
        <p>Компоненты интерфейса: варианты, размеры и состояния.</p>
        <nav className={styles.contents} aria-label="Разделы UI-kit">
          <a href="#kit-buttons">Кнопки</a>
          <a href="#kit-sizes">Размеры</a>
          <a href="#kit-inputs">Поля ввода</a>
          <a href="#kit-radio">Радиокнопки</a>
          <a href="#kit-tabs">Вкладки</a>
        </nav>
      </header>
      <div className={styles.card}>
        <SectionHeader level={3} title="Только заголовок"/>

        <SectionHeader level={3} title="Характеристики" description="Уровни и опыт каждого упражнения."/>

        <SectionHeader level={3} title="Достижения" description="Твои успехи на пути ученика." action={<Button variant="ghost">Все достижения →</Button>}/>
      </div>
      <section id="kit-buttons" className={styles.section}>
        <h2>Кнопки</h2>

        <div className={styles.card}>
          <h3>Варианты</h3>

          <div className={styles.row}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="gold">Gold</Button>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Размеры</h3>

          <div className={styles.row}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Состояния</h3>

          <div className={styles.row}>
            <Button>Обычная</Button>
            <Button disabled>Недоступна</Button>
          </div>
        </div>
        <div className={styles.card}>
          <h3>Иконки и управление воспроизведением</h3>
          <div className={styles.row}>
            <IconButton label="Добавить">+</IconButton>
            <IconButton label="Закрыть" variant="ghost">
              ×
            </IconButton>
            <IconButton label="Недоступное действие" disabled>
              +
            </IconButton>
            <MediaButton isPlaying={isPlaying} onClick={() => setIsPlaying((value) => !value)}/>
            <span className={styles.note} role="status">
              {isPlaying
            ? "Воспроизведение запущено"
            : "Воспроизведение на паузе"}
            </span>
          </div>
        </div>
      </section>

      <section id="kit-sizes" className={styles.section}>
        <h2>Общая шкала размеров</h2>
        {sizes.map(({ value, label }) => (<div className={styles.card} key={value}>
            <h3>{label}</h3>
            <div className={[styles.row, styles.rowScale].join(" ")}>
              <Button size={value}>Кнопка</Button>
              <IconButton size={value} label={`Добавить, размер ${label}`}>
                +
              </IconButton>
              <TextInput size={value} label={`Поле ${label}`} placeholder="Введите имя"/>
              <Select size={value} label={`Выбор ${label}`} defaultValue="dragon" options={[
                { value: "dragon", label: "Школа Дракона" },
                { value: "tiger", label: "Школа Тигра" },
            ]}/>
              <Checkbox size={value} label="Чекбокс"/>
            </div>
          </div>))}
      </section>
      <section id="kit-inputs" className={styles.section}>
        <h2>Поля ввода</h2>

        <div className={styles.card}>
          <h3>Размеры</h3>

          <div className={[styles.row, styles.rowFields].join(" ")}>
            <TextInput label="Small" size="sm" placeholder="Имя игрока"/>

            <TextInput label="Medium" size="md" placeholder="Имя игрока"/>

            <TextInput label="Large" size="lg" placeholder="Имя игрока"/>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Состояния</h3>

          <div className={[styles.row, styles.rowFields].join(" ")}>
            <TextInput label="Обычное поле" placeholder="Введите имя" hint="От 2 до 20 символов"/>

            <TextInput label="Заполненное поле" defaultValue="Ученик Дракона"/>

            <TextInput label="Ошибка" defaultValue="А" error="Имя слишком короткое"/>

            <TextInput label="Недоступное поле" placeholder="Недоступно" disabled/>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Типы полей</h3>

          <div className={[styles.row, styles.rowFields].join(" ")}>
            <TextInput label="Почта" type="email" placeholder="player@example.com" autoComplete="email"/>

            <TextInput label="Пароль" type="password" placeholder="Введите пароль" autoComplete="new-password"/>

            <Input label="Цель тренировки" type="number" min={1} defaultValue={10}/>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Выпадающий список</h3>

          <div className={styles.row}>
            <Select label="Школа" defaultValue="" options={[
            { value: "", label: "Выберите школу", disabled: true },
            { value: "dragon", label: "Школа Дракона" },
            { value: "tiger", label: "Школа Тигра" },
            { value: "snake", label: "Школа Змеи" },
            { value: "eagle", label: "Школа Орла" },
        ]}/>
          </div>
        </div>

        <div className={styles.card}>
          <h3>Чекбоксы</h3>

          <div className={styles.row}>
            <Checkbox label="Обычный"/>
            <Checkbox label="Выбранный" defaultChecked/>
            <Checkbox label="Недоступный" disabled/>
            <Checkbox label="Выбранный недоступный" defaultChecked disabled/>
          </div>
        </div>
      </section>
      <section id="kit-radio" className={styles.section}>
        <h2>Радиокнопки</h2>

        <div className={styles.card}>
          <h3>Карточки с иконками</h3>
          <p className={styles.note}>В группе можно выбрать только одну школу.</p>

          <div className={styles.radioGrid} role="radiogroup" aria-label="Пример выбора школы">
            {schoolOptions.map((item) => (
              <RadioCard
                key={item.value}
                name={`${prefix}-school`}
                value={item.value}
                title={item.title}
                description={item.description}
                icon={<img className={styles.radioIcon} src={item.icon} alt="" />}
                checked={selectedSchool === item.value}
                onChange={setSelectedSchool}
              />
            ))}
          </div>

          <p className={styles.note} role="status">
            Выбрана школа: {schoolOptions.find((item) => item.value === selectedSchool)?.title}
          </p>
        </div>

        <div className={styles.card}>
          <h3>Карточки без иконок</h3>

          <div className={styles.radioList} role="radiogroup" aria-label="Пример выбора длительности тренировки">
            {trainingGoals.map((item) => (
              <RadioCard
                key={item.value}
                name={`${prefix}-training-goal`}
                value={item.value}
                title={item.title}
                description={item.description}
                checked={selectedGoal === item.value}
                onChange={setSelectedGoal}
              />
            ))}
          </div>

          <p className={styles.note} role="status">
            Выбрано: {trainingGoals.find((item) => item.value === selectedGoal)?.title}
          </p>
        </div>
      </section>

      <section id="kit-tabs" className={styles.section}>
        <h2>Вкладки</h2>

        <div className={styles.card}>
          <h3>С подчёркиванием</h3>

          <TabList label="Пример базовых вкладок">
            {modes.map((mode) => (<BaseTab key={mode.value} id={`${prefix}-base-tab-${mode.value}`} panelId={`${prefix}-base-panel-${mode.value}`} selected={baseTab === mode.value} onClick={() => setBaseTab(mode.value)}>
                {mode.label}
              </BaseTab>))}
          </TabList>

          {modes.map((mode) => (<div key={mode.value} role="tabpanel" id={`${prefix}-base-panel-${mode.value}`} aria-labelledby={`${prefix}-base-tab-${mode.value}`} hidden={baseTab !== mode.value} tabIndex={0}>
              {mode.content}
            </div>))}
        </div>

        <div className={styles.card}>
          <h3>С подложкой</h3>

          <TabList label="Пример вкладок с подложкой">
            {modes.map((mode) => (<StyleTab key={mode.value} id={`${prefix}-style-tab-${mode.value}`} panelId={`${prefix}-style-panel-${mode.value}`} selected={styleTab === mode.value} onClick={() => setStyleTab(mode.value)}>
                {mode.label}
              </StyleTab>))}
          </TabList>

          {modes.map((mode) => (<div key={mode.value} role="tabpanel" id={`${prefix}-style-panel-${mode.value}`} aria-labelledby={`${prefix}-style-tab-${mode.value}`} hidden={styleTab !== mode.value} tabIndex={0}>
              {mode.content}
            </div>))}
        </div>

        <div className={styles.card}>
          <h3>С иконками</h3>

          <TabList label="Характеристики">
            {characteristics.map((item) => (<IconTab key={item.value} id={`${prefix}-icon-tab-${item.value}`} panelId={`${prefix}-icon-panel-${item.value}`} selected={iconTab === item.value} onClick={() => setIconTab(item.value)} label={item.label} icon={item.icon}/>))}
          </TabList>

          {characteristics.map((item) => (<div key={item.value} role="tabpanel" id={`${prefix}-icon-panel-${item.value}`} aria-labelledby={`${prefix}-icon-tab-${item.value}`} hidden={iconTab !== item.value} tabIndex={0}>
              {item.label}
            </div>))}
        </div>

        <div className={styles.card}>
          <h3>Навигация по страницам</h3>

          <nav className={styles.row} aria-label="Пример навигации">
            <NavTab to="/" end>
              Главная
            </NavTab>
            <NavTab to="/training">Тренировка</NavTab>
            <NavTab to="/ui-kit">UI-kit</NavTab>
          </nav>
        </div>
      </section>
    </main>);
}
export default UiKitPage;
