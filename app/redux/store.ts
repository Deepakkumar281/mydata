import {applyMiddleware, configureStore} from '@reduxjs/toolkit';
import rootReducer from './index';
import thunk from 'redux-thunk';
import {persistStore, persistReducer} from 'reduxjs-toolkit-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const middlewares = [thunk];

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  let store = configureStore({
    reducer: persistedReducer,
    middleware: middlewares,
  });
  let persistor = persistStore(store);
  return {store, persistor};
};
