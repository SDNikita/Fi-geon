import Button from '../../components/UI/button/Button/Button';
import './UiKitPage.scss';

function UiKitPage() {
    return (
        <main className="ui-kit-page">
            <h1>UI-kit</h1>

            <section className="ui-kit-page__section">
                <h2>Кнопки</h2>

                <div className="ui-kit-page__card">
                    <h3>Варианты</h3>

                    <div className="ui-kit-page__row">
                        <Button>Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="gold">Gold</Button>
                    </div>
                </div>

                <div className="ui-kit-page__card">
                    <h3>Размеры</h3>

                    <div className="ui-kit-page__row">
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                    </div>
                </div>

                <div className="ui-kit-page__card">
                    <h3>Состояния</h3>

                    <div className="ui-kit-page__row">
                        <Button>Обычная</Button>
                        <Button disabled>Недоступна</Button>
                    </div>
                </div>
            </section>

            <section className="ui-kit-page__section">
                <h2>Общая шкала размеров</h2>

                <div className="ui-kit-page__card">
                    <h3>Small</h3>

                    <div className="ui-kit-page__row">
                        <Button size="sm">Кнопка</Button>
                    </div>
                </div>

                <div className="ui-kit-page__card">
                    <h3>Medium</h3>

                    <div className="ui-kit-page__row">
                        <Button size="md">Кнопка</Button>
                    </div>
                </div>

                <div className="ui-kit-page__card">
                    <h3>Large</h3>

                    <div className="ui-kit-page__row">
                        <Button size="lg">Кнопка</Button>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default UiKitPage;