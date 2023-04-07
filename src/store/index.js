import { configureStore } from '@reduxjs/toolkit';

import gamesReducer from './slices/games';
import generatorReducer from './slices/generator'

const store = configureStore({
    reducer: {
        gamesReducer,
        generatorReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: false
    }),
});

export default store;