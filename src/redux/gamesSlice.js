import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import firebase from "../firebase"

const ref = firebase.firestore().collection("games");

export const getGamesThunk = createAsyncThunk(
    'firebase/getGames',
    async(_) => {
        let items = [];
        const docs = (await ref.get()).docs;
        docs.forEach((doc) => {
            // let game = doc.data();
            items.push(doc.data());
        });
        console.log(items)
        return items
    }
)

const gamesSlice = createSlice({
    name: "games",
    initialState: {
        data: null,
        status: null
    },
    reducers: {
        updateRating: (state, {payload}) => {
            state.data[payload.index].rating = payload.rating;
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

export const { updateRating } = gamesSlice.actions //to call the actions in the React application

export default gamesSlice.reducer;