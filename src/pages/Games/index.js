import React, {useEffect, useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { getGamesThunk, updateRating } from "../../redux/gamesSlice";
import Rating from '@material-ui/lab/Rating';
import {firebase} from "../../firebase"
import '../Games/games.sass' 
import next from '../../images/next.svg'
import previous from '../../images/previous.svg'
import { useHistory } from "react-router-dom";

const Games = () => {
    const [test, setTest] = useState({})
    let history = useHistory()
    const [index, setIndex] = useState(0)
    const { status, data, uId } = useSelector((state) => state.gamesReducer); //games est le reducer, celui qu'on a nommé dans le store (games: gamesReducer)
    const dispatch = useDispatch()

    const fetchGames = async() => {
        await dispatch(getGamesThunk(uId))
    }

    const onNext = () => {
        test['hello'] = 'world'
        console.log(test)
        setIndex(index+1)
    }

    const onPrevious = () => {
        setIndex(index-1)
    }
    //pour l'instant, si on ne met rien, ca met 0 (valeur imposée de base à rating)
    const onConfirm = async() => {
        let previousNotes = []
        const docs = (await firebase.firestore()
            .collection('notes')
            .where('uId', '==', uId) //si ca existe faut replace en gros
            .get()).docs;

        docs.forEach((doc) => {
            let note = doc.data();
            note.id = doc.id;
            previousNotes.push(note);
        })

        for (let game of data){
            let note = previousNotes.find(note => note.gameId === game.id)
            if (note !== undefined){ //ce jeu avait déjà recu une note de la part de cet utilisateur, il faut écraser les données
                firebase.firestore()
                    .collection('notes')
                    .doc(note.id)
                    .set({
                        gameId: game.id,
                        uId: uId,
                        rating: game.rating || 0
                    })
                    .then(() => {
                        console.log("Salut Dorian :)")
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
            else { //ce jeu n'avait pas encore recu de note, on écrit une nouvelle donnée
                firebase.firestore()
                    .collection('notes')
                    .add({
                        gameId: game.id,
                        uId: uId,
                        rating: game.rating || 0
                    })
                    .then(() => {
                        console.log("Salut Dorian :)")
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }          
        }
        history.push('/confirmation')
    }

    const onRatingChange = (newRating) => {
        dispatch(updateRating({index: index, rating: newRating}))
    }
    
    useEffect(() => {
        if (status !== 'fulfilled'){
            fetchGames()
        }
        
    }, [])
    console.log(data)
    if(uId === null){
        return(
            <h1>Bien essayé Dorian</h1>
        )
    }

    else if(status === null || status === "loading") {
        return (
            <h1>loading</h1>
        );
    }
    return(
        <div className="container">
            <div className="slides">
                <div className="button-container">
                    { index > 0 && (<img className="button" src={previous} onClick = {onPrevious}/>) }
                </div>
                <img className="game-picture" src = {data[index].picture} />
                <div className="button-container">
                    { index < data.length - 1 && (<img className="button" src={next} onClick = {onNext}/>) }
                </div>
                
            </div>
            <div className="details">
                <span className="title">{data[index].name}</span>
                <span className="category"> {data[index].category}</span>
                <p className="description">{data[index].description}</p>
                <Rating
                    name="simple-controlled"
                    value={data[index].rating || 0}
                    onChange={(event, newValue) => {
                        onRatingChange(newValue)
                    }}
                    size="large"
                />
                <button className="confirmation-button" onClick = {onConfirm} >valider ses notes</button>
            </div>
                
            
        </div>

    )
     
}
    


export default Games