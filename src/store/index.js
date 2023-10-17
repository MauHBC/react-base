import { persistStore } from "redux-persist";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import persistedReducers from "./modules/reduxPersist";

import rootReducer from "./modules/rootReducer";
import rootSaga from "./modules/rootSaga";

// middleware
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  // persisted reducers in rootReducer
  persistedReducers(rootReducer),
  // apply a middleware in a store
  applyMiddleware(sagaMiddleware),
);

// starting all sagas in rootSaga
sagaMiddleware.run(rootSaga);

// Create a persistor for a given store.
export const persistor = persistStore(store);
export default store;
