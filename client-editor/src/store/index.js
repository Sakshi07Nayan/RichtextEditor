import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';  // Named import instead of default import
import authReducer from './reducres/authReducer';
import { contentReducer } from './reducres/contentReducer';


const rootReducer = combineReducers({
  auth: authReducer,
  content: contentReducer

});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;