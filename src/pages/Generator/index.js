import React, {useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Roulette from "../../components/Roulette";
import { getGamesForGeneratorThunk } from "../../store/slices/generator";
import '../Generator/generator.sass' 
import { useHistory } from "react-router-dom";
import Button from '../../components/Button'

const Generator = () => {
    const [lastGames, setLastGames] = useState([])

    const [gamesWithProbability, setGamesWithProbability] = useState([])
    const [randomGame, setRandomGame] = useState({})
    const [categories, setCategories] = useState(["Multijoueur"])
    const [generate, setGenerate] = useState(false)
    const [gameRoulette, setGameRoulette] = useState({})

    let history = useHistory()

    const { status, generatorData } = useSelector((state) => state.generatorReducer)
    
    const dispatch = useDispatch()

    const fetchGames = async() => {
        await dispatch(getGamesForGeneratorThunk())
    }

    useEffect(() => {
        if (status !== 'fulfilled'){
            fetchGames()
        }
        // gameRatingsBuilder()
    }, [])

    useEffect(async() => {
        gameRatingsBuilder()
    }, [categories])


    
    const gameRatingsBuilder = async() => {
        let gamesList = []
        for (let category of categories){
            let filteredGames = generatorData.games.filter(game => game.category === category)
            for (let game of filteredGames){
                gamesList.push(game)
            }
        }
        
        for (let game of gamesList) {
            let filteredRatings = generatorData.ratings.filter(i => i.gameId === game.id)
            let total = 0
            for (let rating of filteredRatings){
                game.ratings.push({uid: rating.uId, rating: rating.rating});
                total += rating.rating;
            }

            game.average = total/filteredRatings.length
        }
        //sort by rating
        gamesList.sort((a, b) => {
            return b.average - a.average
        }) 

        //met à jour les itérations
        for (let lastGameIndex in lastGames){
            let gamesListIndex = gamesList.findIndex(game => game.name === lastGames[lastGameIndex])
            gamesList[gamesListIndex].iterationsWithout = parseInt(lastGameIndex) + 1  //on met l'index +1 comme ca quand c'est 0, c'est 100% de chance
        }

        gamesList = probabilityCalculator(gamesList)

        setGamesWithProbability(gamesList)
    }   

    const weightFunction = (x) => {
        let result = 1/25 * Math.pow(x, 2) + 1
        return result
    }

    const lastGamesFunction = (x) => {
        if(x === 0){
            return 1
        }
        else {
            return 1 / (1 + Math.exp(-0.5*(x-10)))
        } 
    }
    
    const probabilityCalculator = (gamesList) => {
        let sum = 0;
        for(let game of gamesList){
            let weightedResult = weightFunction(game.average) * game.average
            let iterationResult = lastGamesFunction(game.iterationsWithout)
            weightedResult = weightedResult * iterationResult
            sum += weightedResult
        }


        for (let game of gamesList){
            let weightedResult = weightFunction(game.average) * game.average
            let iterationResult = lastGamesFunction(game.iterationsWithout)
            console.log(iterationResult)
            weightedResult = weightedResult * iterationResult
            game.probability = weightedResult / sum
        }

        return gamesList
    }

    const randomGenerator = () => {
        let rand = Math.random()
        for (var i = 0; i < gamesWithProbability.length; i++){
            var game = gamesWithProbability[i]
            if(rand < game.probability) {
                return(game)
            }
            rand -= game.probability
            
        }
    }

    const changeCategory = (category) => {
        if (categories.includes(category)){
            let filteredCategories = categories.filter(cat => cat !== category)
            setCategories(filteredCategories)
        }
        else {
            setCategories([...categories, category])
        }
    }

    const lastGamesIterator = (game) => {
        let newList = lastGames
        newList.unshift(game)
        if(Object.entries(lastGames).length === 20){
            newList.pop()
        }
        setLastGames(newList)
    }

    const checkCategory = (category) => {
        return categories.includes(category);
    }

    if (status === null || status === 'loading'){
        return(
            <div>
                loading
            </div>
        )
    }
    if(!generate){
        return (
            <div>
                <ul>
                    {gamesWithProbability.map(game => {
                        return(
                            <li key={game.id}>{game.name} : {game.average.toFixed(2)} avec une probabilité de {(game.probability * 100).toFixed(2)} %, itérations : {game.iterationsWithout}</li>
                        )
                    })}
                </ul>
    
                <Button secondary={checkCategory('Multijoueur')} onClick={() => changeCategory('Multijoueur')}>Multijoueur</Button>
                <Button secondary={checkCategory('Local')} onClick={() => changeCategory('Local')}>Local</Button>
                <Button secondary={checkCategory('Switch')} onClick={() => changeCategory('Switch')}>Switch</Button>
                <Button secondary={checkCategory('Autre')} onClick={() => changeCategory('Autre')}>Autre</Button>
                
                <Button onClick={() => {
                    if(Object.entries(categories).length !== 0){
                        let random = randomGenerator()
                        setRandomGame(random)
                        lastGamesIterator(random.name)
                        gameRatingsBuilder() //on réappelle car le pourcentage de chance du jeux qui vient d'être pioché aura diminué
                        setGenerate(true)
                    }
                } }>Générer !</Button>
            </div>
        )
        
    }
    else {

        return(
            <Roulette
                randomGame = {randomGame}
                gamesWithProbability = {gamesWithProbability}
                setGenerate = {setGenerate}
            />
        )
    }
}

export default Generator
