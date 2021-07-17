import React, {useState, useEffect} from "react";
import {firebase} from "../firebase"

const Generator = () => {

    const [games, setGames] = useState([])
    const [randomGame, setRandomGame] = useState({})

    const fetchGames = async() => {
        let gamesList = [];
        const docs = (await firebase.firestore().collection("games").orderBy('name').get()).docs;
        docs.forEach((doc) => {
            let game = doc.data()
            game.id = doc.id; //récupère l'id via firebase (l'id du document)
            game.ratings = [];
            game.average = 0;
            game.probability = 0.00;
            gamesList.push(game);
        })
        return gamesList
    }

    const fetchRatings = async() => {
        let ratingsList = [];
        const docs = (await firebase.firestore().collection("notes").get()).docs;
        docs.forEach((doc) => {
            let rating = doc.data()
            ratingsList.push(rating)
        })
        return ratingsList
    }

    const gameRatingsBuilder = async() => {
        let ratingsList = await fetchRatings()
        let gamesList = await fetchGames()
        for (let game of gamesList) {
            let ratings = ratingsList.filter(i => i.gameId === game.id)
            let total = 0
            for (let rating of ratings){
                game.ratings.push({uid: rating.uId, rating: rating.rating});
                total += rating.rating;
            }

            game.average = total/ratings.length

        }
        //sort by rating
        gamesList.sort((a, b) => {
            return b.average - a.average
        }) 
        gamesList = probabilityCalculator(gamesList)

        setGames(gamesList)
    }   
    
    const probabilityCalculator = (gamesList) => {
        let mean;
        let standardDeviation;
        let meanProbability;
        let limit;
        let probabilityPerUnit;

        let sum = 0;

        for (let game of gamesList){
            sum += game.average
        }
        mean = sum / gamesList.length

        sum = 0;
        for (let game of gamesList){
            sum += (game.average - mean)*(game.average - mean)
        }

        standardDeviation = sum / gamesList.length

        meanProbability = 1 / gamesList.length
        limit = meanProbability / standardDeviation
        if (mean <2.5){
            probabilityPerUnit = limit / 5-mean
        }
        else {
            probabilityPerUnit = limit / Math.abs(0-mean)
        }
        
        console.log("mean", mean)
        console.log('meanProbability', meanProbability)
        console.log('standard Deviation', standardDeviation)
        console.log('limit', limit)
        console.log('probability per Unit', probabilityPerUnit)
        sum = 0

        for (let game of gamesList){
            game.probability = meanProbability + (game.average - mean) * probabilityPerUnit
            sum += game.probability
        }
        console.log(sum)

        return gamesList
    }

    const randomGenerator = () => {
        let rand = Math.random()
        console.log(rand)
        for (var i = 0; i < games.length; i++){
            var game = games[i]
            if(rand < game.probability) {
                return(game)
            }
            rand -= game.probability
        }
    }


    useEffect(async() => {
        await gameRatingsBuilder()
    }, [])
    console.log(randomGame)
    return(
        <div>
            <ul>
                {games.map(game => {
                    return(
                        <li>{game.name} : {game.average.toFixed(2)} avec une probabilité de {(game.probability * 100).toFixed(2)} %</li>
                    )
                })}
            </ul>
            <button onClick={() => {
                let random = randomGenerator()
                setRandomGame(random)
            } }>Générer !</button>
            {Object.entries(randomGame).length !== 0 && (<p>{randomGame.name}</p>)}
        </div>
    )
}

export default Generator
