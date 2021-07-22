import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {firebase} from "../firebase";

export const getGamesForGeneratorThunk = createAsyncThunk(
    'firebase/getGamesForGenerator',
    async() => {
        let gamesList = [];
        const docs = (await firebase.firestore().collection("games").orderBy('name').get()).docs;
        docs.forEach((doc) => {
            let game = doc.data()
            game.id = doc.id; //récupère l'id via firebase (l'id du document)
            game.ratings = [];
            game.average = 0;
            game.iterationsWithout = 0;
            game.probability = 0.00;
            gamesList.push(game);
        })

        let ratingsList = [];
        const notes = (await firebase.firestore().collection("notes").get()).docs;
        notes.forEach((doc) => {
            let rating = doc.data()
            ratingsList.push(rating)
        })

        let payload = {}
        payload['games'] = gamesList
        payload['ratings'] = ratingsList
        
        return payload
    }
)

const generatorSlice = createSlice(
    {
        name: "generator",
        initialState: {
            generatorData: null,
            status: null,
        },
        extraReducers: {
            [getGamesForGeneratorThunk.pending]: (state, _action) => {
                state.status = 'loading'
            },
            [getGamesForGeneratorThunk.fulfilled]: (state, {payload}) => {
                console.log(payload)
                state.status = 'fulfilled'
                state.generatorData = payload
            },
            [getGamesForGeneratorThunk.rejected]: (state, _action) => {
                state.status = 'error'
            }
        }
    },
)

export default generatorSlice.reducer