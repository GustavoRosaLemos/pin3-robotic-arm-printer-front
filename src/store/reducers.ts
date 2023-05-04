import { combineReducers } from 'redux';
import { loadingReducer } from './loading/loadingReducer';
import { renderReducer } from './render/renderReducer';

const reducers = combineReducers({
  loadingState: loadingReducer,
  renderState: renderReducer,
});

export type RootState = ReturnType<typeof reducers>;

export default reducers;
