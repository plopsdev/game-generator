import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../Generator/generator.sass';
import { getGamesForGeneratorThunk } from '../../store/slices/generator';
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox';
import Roulette from '../../components/Roulette';

const Generator = () => {
    const [ lastGames, setLastGames ] = useState([]);

    const [ gamesWithProbability, setGamesWithProbability] = useState([]);
    const [ randomGame, setRandomGame ] = useState({});
    const [ categories, setCategories ] = useState(['Multijoueur']);
    const [ generate, setGenerate ] = useState(false);

    const { status, generatorData } = useSelector((state) => state.generatorReducer);
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === 'fulfilled') return;
        dispatch(getGamesForGeneratorThunk());
    }, []);

    useEffect(() => {
        gameRatingsBuilder();
    }, [ categories ]);

    const gameRatingsBuilder = () => {
        const games = generatorData.games.filter(game => categories.includes(game.category));
        
        for (const game of games) {
            const ratings = generatorData.ratings.filter(i => i.gameId === game.id);
            const total = ratings.reduce((acc, curr) => acc += curr.rating, 0);
            game.average = total / ratings.length;
        }

        // Sorting by rating
        games.sort((a, b) => b.average - a.average);

        // Updating the iterations
        for (const name of lastGames) {
            const game = games.find(game => game.name === name);
            game.iterationsWithout++;
        }

        probabilityCalculator(games);
        setGamesWithProbability(games);
    }   

    const weightFunction = x => {
        return 1/25 * Math.pow(x, 2) + 1;
    }

    const lastGamesFunction = x => {
        if (x === 0) return 1;
        return 1 / (1 + Math.exp(-0.5 * (x - 10)));
    }
    
    const probabilityCalculator = games => {
        const sum = games.reduce((acc, curr) => {
            const weightedResult = weightFunction(curr.average) * curr.average;
            const iterationResult = lastGamesFunction(curr.iterationsWithout);
            curr.probability = weightedResult * iterationResult;
            return acc + curr.probability;
        }, 0);

        games.forEach(game => game.probability /= sum);
    }

    const randomGenerator = () => {
        let rand = Math.random();
        for (var i = 0; i < gamesWithProbability.length; i++) {
            var game = gamesWithProbability[i];
            if(rand < game.probability) {
                return game;
            }
            rand -= game.probability;
            
        }
    }

    const changeCategory = category => {
        if (categories.includes(category)) {
            return setCategories(categories.filter(c => c !== category));
        }
        setCategories([ ...categories, category ]);
    }

    const lastGamesIterator = (game) => {
        let newList = lastGames;
        newList.unshift(game);
        if (Object.entries(lastGames).length === 20) {
            newList.pop();
        }
        setLastGames(newList);
    }

    if (status === null || status === 'loading') {
        return(
            <div>
                loading
            </div>
        );
    }
    if (!generate) {
        return (
            <div>
                <ul>
                    {gamesWithProbability.map(game => {
                        return(
                            <li key={game.id}>{game.name} : {game.average.toFixed(2)} avec une probabilité de {(game.probability * 100).toFixed(2)} %, itérations : {game.iterationsWithout}</li>
                        );
                    })}
                </ul>

                <Checkbox startChecked onChange={() => changeCategory('Multijoueur')}>Multijoueur</Checkbox>
                <Checkbox onChange={() => changeCategory('Local')}>Local</Checkbox>
                <Checkbox onChange={() => changeCategory('Switch')}>Switch</Checkbox>
                <Checkbox onChange={() => changeCategory('Autre')}>Autre</Checkbox>

                <Button onClick={() => {
                    if(Object.entries(categories).length !== 0){
                        let random = randomGenerator();
                        setRandomGame(random);
                        lastGamesIterator(random.name);
                        gameRatingsBuilder(); //on réappelle car le pourcentage de chance du jeux qui vient d'être pioché aura diminué
                        setGenerate(true);
                    }
                } }>Générer !</Button>
            </div>
        )
        
    }
    else {

        return(
            <Roulette
                randomGame={randomGame}
                gamesWithProbability={gamesWithProbability}
                setGenerate={setGenerate}
            />
        );
    }
}

export default Generator;
