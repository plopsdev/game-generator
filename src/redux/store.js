import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import generatorReducer from './generatorSlice'
import storage from 'redux-persist/lib/storage';
import {
    persistStore,
    persistReducer,
} from 'redux-persist'


const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const persistedGamesReducer = persistReducer(persistConfig, gamesReducer)
const persistedGeneratorReducer = persistReducer(persistConfig, generatorReducer)

const store = configureStore({
  reducer: {
    //   gamesReducer : persistedGamesReducer,
      generatorReducer: persistedGeneratorReducer,
      middleware: getDefaultMiddleware({
          serializableCheck: false
      }),
  },
})

export const persistor = persistStore(store)

export default store