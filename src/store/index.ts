import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import reducers from './reducers';

export type { RootState } from './reducers';

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
