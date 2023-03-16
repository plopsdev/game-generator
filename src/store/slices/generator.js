import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {firebase} from '../../firebase';

export const getGamesForGeneratorThunk = createAsyncThunk(
    'firebase/getGamesForGenerator',
    async() => {
        let games = [];
        const docs = (await firebase.firestore().collection('games').orderBy('name').get()).docs;
        docs.forEach((doc) => {
            let game = doc.data();
            game.id = doc.id; //récupère l'id via firebase (l'id du document)
            game.ratings = [];
            game.average = 0;
            game.iterationsWithout = 0;
            game.probability = 0.00;
            games.push(game);
        });

        let ratings = [];
        const notes = (await firebase.firestore().collection('notes').get()).docs;
        notes.forEach((doc) => {
            let rating = doc.data();
            ratings.push(rating);
        });
        
        return {
            games,
            ratings,
        };
    }
);

const generatorSlice = createSlice(
    {
        name: 'generator',
        initialState: {
            generatorData: null,
            status: null,
        },
        extraReducers: {
            [getGamesForGeneratorThunk.pending]: (state, _action) => {
                state.status = 'loading';
            },
            [getGamesForGeneratorThunk.fulfilled]: (state, {payload}) => {
                state.status = 'fulfilled';
                state.generatorData = payload;
            },
            [getGamesForGeneratorThunk.rejected]: (state, _action) => {
                state.status = 'error';
            }
        }
    },
);

export default generatorSlice.reducer;