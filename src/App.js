import React from "react";
import { Router } from "react-router-dom/cjs/react-router-dom.min";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import store, { persistor } from "./store";
import history from "./services/history";
import GlobalStyle from "./styles/GlobalStyles";
import Header from "./components/Header";
import Routes from "./routes";

function App() {
  return (
    // Provider makes the Redux store available to all child components inside
    // The store is the object that brings together the reducers, middleware and allows access to the application state.
    <Provider store={store}>
      {/* ensure that the application UI is not rendered until the persistent data is retrieved and saved in Redux. */}
      <PersistGate persistor={persistor}>
        {/* history is an object that allows you to manipulate the browser's history stack, navigate to different URLs, and persist state between sessions  */}
        {/* react-router-dom uses this object to synchronize the app's UI with the browser's URL. */}
        <Router history={history}>
          <Header />
          <Routes />
          <GlobalStyle />
          <ToastContainer autoClose={3000} className="toats-container" />
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
