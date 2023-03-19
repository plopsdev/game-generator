import React, {useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './generator.sass';
import { getGamesForGeneratorThunk } from '../../store/slices/generator';
import Button from '../../components/Button'
import Checkbox from '../../components/Checkbox';
import Roulette from '../../components/Roulette';
import GameCategory from '../../enums/GameCategory';
import Status from '../../enums/Status';
import GameStats from '../../components/GameStats';

const Generator = () => {
    const [ lastGames, setLastGames ] = useState([]);

    const [ gamesWithProbability, setGamesWithProbability] = useState([]);
    const [ randomGame, setRandomGame ] = useState({});
    const [ categories, setCategories ] = useState([ GameCategory.MULTIJOUEUR ]);
    const [ generated, setGenerated ] = useState(false);

    const { status, generatorData } = useSelector((state) => state.generatorReducer);
    
    const dispatch = useDispatch();

    useEffect(() => {
        if (status === Status.FULFILLED) return;
        dispatch(getGamesForGeneratorThunk());
    }, []);

    useEffect(() => {
        if (status === Status.FULFILLED) updateGames();
    }, [ categories, status ]);

    const updateGames = () => {
        const games = generatorData.games.filter(game => categories.includes(game.category));

        for (let i = 0; i < games.length; i++) {
            const ratings = generatorData.ratings.filter(rating => rating.gameId === games[i].id);
            const total = ratings.reduce((acc, curr) => acc += curr.rating, 0);
            games[i] = { ...games[i], average: total / ratings.length };
        }

        calculateProbabilities(games);
    };

    const calculateProbabilities = games => {
        const sum = games.reduce((acc, curr) => {
            // Updating the iterations
            if (lastGames.includes(curr.name)) curr.iterationsWithout++;
            else curr.iterationsWithout = 0;
            // Updating the probability
            const weightedResult = calculateWeight(curr.average) * curr.average;
            const iterationResult = calculateIterationInfluence(curr.iterationsWithout);
            curr.probability = weightedResult * iterationResult;
            return acc + curr.probability;
        }, 0);

        games.forEach(game => game.probability /= sum);

        // Sorting by probability
        games.sort((a, b) => b.probability - a.probability);

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
                game.iterationsWithout = 0;
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
        const game = getRandomGame();
        addLastGame(game.name);
        calculateProbabilities(gamesWithProbability); //on réappelle car le pourcentage de chance du jeux qui vient d'être pioché aura diminué
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
            <div className="generator">
                <div className="generator__buttons">
                    { Object.values(GameCategory).map(category => (
                        <Checkbox key={category} startChecked={isChecked(category)} onChange={checked => changeCategory(category, checked)}>{category}</Checkbox>
                    )) }
                    <Button disabled={categories.length === 0} onClick={generate}>Générer !</Button>
                </div>
                <div className="generator__games">
                    { gamesWithProbability.map(game => (
                        <GameStats key={game.id} game={game}></GameStats>
                    )) }
                </div>
            </div>
        )
        
    } else {
        return (
            <Roulette
                randomGame={randomGame}
                gamesWithProbability={gamesWithProbability}
                generate={generate}
                setGenerated={setGenerated}
            />
        );
    };
}

export default Generator;
