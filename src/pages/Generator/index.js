import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../Generator/generator.sass';
import { getGamesForGeneratorThunk } from '../../store/slices/generator';
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox';
import Roulette from '../../components/Roulette';
import GameCategory from '../../enums/GameCategory';
import Status from '../../enums/Status';

const Generator = () => {
    const [ lastGames, setLastGames ] = useState([]);

    const [ gamesWithProbability, setGamesWithProbability] = useState([]);
    const [ randomGame, setRandomGame ] = useState({});
    const [ categories, setCategories ] = useState([ GameCategory.MULTIJOUEUR ]);
    const [ generated, setGenerated ] = useState(false);

    const { status, generatorData } = useSelector((state) => state.generatorReducer);
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === 'fulfilled') return;
        dispatch(getGamesForGeneratorThunk());
    }, []);

    useEffect(() => {
        updateGames();
    }, [ categories ]);

    const updateGames = () => {
        const games = generatorData.games.filter(game => categories.includes(game.category));
        
        for (const game of games) {
            const ratings = generatorData.ratings.filter(i => i.gameId === game.id);
            const total = ratings.reduce((acc, curr) => acc += curr.rating, 0);
            game.average = total / ratings.length;
            // Updating the iterations
            if (lastGames.includes(game.name)) game.iterationsWithout++;
        }

        // Sorting by rating
        games.sort((a, b) => b.average - a.average);

        calculateProbabilities(games);
    };

    const calculateProbabilities = games => {
        const sum = games.reduce((acc, curr) => {
            const weightedResult = calculateWeight(curr.average) * curr.average;
            const iterationResult = calculateIterationInfluence(curr.iterationsWithout);
            curr.probability = weightedResult * iterationResult;
            return acc + curr.probability;
        }, 0);

        games.forEach(game => game.probability /= sum);

        setGamesWithProbability(games);
    };

    const calculateWeight = x => {
        return 1/25 * Math.pow(x, 2) + 1;
    };

    const calculateIterationInfluence = x => {
        if (x === 0) return 1;
        return 1 / (1 + Math.exp(-0.5 * (x - 10)));
    };

    const getRandomGame = () => {
        let rand = Math.random();
        for (const game of gamesWithProbability) {
            if (rand < game.probability) {
                setRandomGame(game);
                return game;
            }
            rand -= game.probability;
        }
    };

    const changeCategory = (category, includeCategory) => {
        return setCategories(includeCategory
            ? [ ...categories, category ]
            : categories.filter(c => c !== category)
        );
    };

    const isChecked = category => categories.includes(category);
 
    const addLastGame = (game) => {
        lastGames.unshift(game);
        setLastGames(lastGames.slice(0, 20));
    };

    const generate = () => {
        if (categories.length === 0) return;
        const game = getRandomGame();
        addLastGame(game.name);
        updateGames(); //on réappelle car le pourcentage de chance du jeux qui vient d'être pioché aura diminué
        setGenerated(true);
    } 

    if (status === null || status === Status.LOADING) {
        return (
            <div>
                { Status.LOADING }
            </div>
        );
    };

    if (!generated) {
        return (
            <div>
                <ul>
                    { gamesWithProbability.map(game => (
                            <li key={game.id}>
                                {game.name} : {game.average.toFixed(2)} avec une probabilité de {(game.probability * 100).toFixed(2)} %, itérations : {game.iterationsWithout}
                            </li>
                        )
                    ) }
                </ul>
                { Object.values(GameCategory).map(category => (
                    <Checkbox key={category} startChecked={isChecked(category)} onChange={checked => changeCategory(category, checked)}>{category}</Checkbox>
                )) }
                <Button onClick={generate}>Générer !</Button>
            </div>
        )
        
    } else {
        return (
            <Roulette
                randomGame={randomGame}
                gamesWithProbability={gamesWithProbability}
                setGenerate={setGenerated}
            />
        );
    };
}

export default Generator;
