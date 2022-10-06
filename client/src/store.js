import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'
import { userGigsDetailsReducer, gigReducer, gigDetailReducer } from './reducers/gigReducer.js';
import { dimBackgroundReducer } from './reducers/dimBackgroundReducer.js';
import { gigUserReducer, loginUserReducer, userReducer } from './reducers/userReducers.js';

const reducer = combineReducers({
    gigs: gigReducer,
    dimBackground: dimBackgroundReducer,
    user: userReducer,
    userGigs: userGigsDetailsReducer,
    gigUser: gigUserReducer,
    gigDetail: gigDetailReducer,
    loggedUser: loginUserReducer,
})

let initialsState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialsState,
    composeWithDevTools(applyMiddleware(...middleware))
    // applyMiddleware(...middleware)
);

export default store;
