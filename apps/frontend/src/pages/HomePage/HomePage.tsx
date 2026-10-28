import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div>
            <h1>Dungeon Training</h1>

            <Link to="/training">
                <button>Начать тренировку</button>
            </Link>
        </div>
    );
}

export default HomePage;