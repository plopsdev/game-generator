import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';

import gamesReducer from './slices/games';
import generatorReducer from './slices/generator'

const persistedGamesReducer = persistReducer({ key: 'games', version: 1, storage }, gamesReducer);
const persistedGeneratorReducer = persistReducer({ key: 'generator', version: 1, storage }, generatorReducer);

const store = configureStore({
    reducer: {
        gamesReducer : persistedGamesReducer,
        generatorReducer: persistedGeneratorReducer,
        middleware: getDefaultMiddleware({
            serializableCheck: false,
        }),
    },
});

export const persistor = persistStore(store);

export default store;