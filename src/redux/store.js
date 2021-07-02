import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import storage from 'redux-persist/lib/storage';
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'


const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const persistedReducer = persistReducer(persistConfig, gamesReducer)

const store = configureStore({
  reducer: {
      gamesReducer : persistedReducer,
      middleware: getDefaultMiddleware({
          serializableCheck: {
              ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
      }),
  },
})

export const persistor = persistStore(store)

export default store