import React, {useEffect, useState} from "react";
import ReactStars from "react-rating-stars-component";
import { useSelector, useDispatch } from "react-redux";
import { getGamesThunk, updateRating } from "../redux/gamesSlice";
import Rating from '@material-ui/lab/Rating';

const Games = () => {

    const [index, setIndex] = useState(0)
    const { status, data } = useSelector((state) => state.gamesReducer); //games est le reducer, celui qu'on a nommé dans le store (games: gamesReducer)
    const dispatch = useDispatch()

    const fetchGames = async() => {
        await dispatch(getGamesThunk())
    }

    const onClickNext = () => {
        setIndex(index+1)
    }

    const onClickPrevious = () => {
        setIndex(index-1)
    }

    const onRatingChange = (newRating) => {
        dispatch(updateRating({index: index, rating: newRating}))
    }
    
    useEffect(() => {
        if (status === null){
            fetchGames()
        }
    }, [])

    if (status === null || status === "loading") {
        return (
            <h1>loading</h1>
        );
    }
    return(
        <div>
            <img src = {data[index].picture}/>
            <h1>{data[index].name}</h1>
            <p>{data[index].description}</p>
            <Rating
                name="simple-controlled"
                value={data[index].rating}
                onChange={(event, newValue) => {
                    onRatingChange(newValue)
                }}
            />
            { index > 0 && (<button onClick = {onClickPrevious}>Previous</button>) }
            { index < data.length - 1 && (<button onClick = {onClickNext}>Next</button>) }
        </div>
    )
     
}
    


export default Games