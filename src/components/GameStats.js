import './GameStats.sass';

const GameStats = ({ game }) => {
    // {game.name} : {game.average.toFixed(2)} avec une probabilité de {(game.probability * 100).toFixed(2)} %, itérations : {game.iterationsWithout}
    const { average, category, iterationsWithout, picture, name, probability } = game;

    return (
        <div className="game-stats">
            <img src={picture} className="game-stats__image"></img>
            <span className="game-stats__probability" >{ (probability * 100).toFixed(2) }%</span>
        </div>
    );
}

export default GameStats;