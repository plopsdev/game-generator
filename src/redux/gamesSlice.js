import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {firebase} from "../firebase"

;

export const getGamesThunk = createAsyncThunk(
    'firebase/getGames',
    async(uId) => {

        let gamesList = [];
        const docs = (await firebase.firestore().collection("games").orderBy('name').get()).docs;
        docs.forEach((doc) => {
            let game = doc.data()
            game.id = doc.id; //récupère l'id via firebase (l'id du document)
            gamesList.push(game);
        });
        
        let notesList = [];
        const notes = (await firebase.firestore().collection("notes").get()).docs;
        notes.forEach((note) => {
            notesList.push(note.data());
        });
        //moyen d'intégrer le filtre directement dans le foreach pour conserver que les notes qui nous intéressent
        for (let note of notesList){
            if (note.uId === uId){
                for (let index in gamesList){
                    if (gamesList[index].id === note.gameId){
                        gamesList[index].rating = note.rating
                    }
                }
            }
        }
        return gamesList
    }
)

const gamesSlice = createSlice({
    name: "games",
    initialState: {
        data: null,
        status: null,
        uId: null
    },
    reducers: {
        updateRating: (state, {payload}) => {
            state.data[payload.index].rating = payload.rating;
        },
        login: (state, {payload}) => {
            state.uId = payload;
        }
    },
    extraReducers: {
        [getGamesThunk.pending]: (state, action) => {
            state.status = 'loading'
        },
        [getGamesThunk.fulfilled]: (state, action) => {
            state.data = action.payload;
            state.status = 'fulfilled'
        },
        [getGamesThunk.rejected]: (state, _action) => {
            state.status = 'error'
        }
    }
})

export const { updateRating, login } = gamesSlice.actions //to call the actions in the React application

export default gamesSlice.reducer;