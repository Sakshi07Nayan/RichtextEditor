import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';  // Named import instead of default import
import authReducer from './reducres/authReducer';


const rootReducer = combineReducers({
  auth: authReducer,

});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;