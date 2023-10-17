import React from "react";
import { Route, Redirect } from "react-router-dom";
// used to define the types of component properties
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

// "middleware"
// Every time Componet MyRoute is called, the current state is recorded in the console
export default function MyRoute({ component: Component, isClosed, ...rest }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const isLoggedIn = useSelector((state) => console.log(state.auth.isLoggedIn));

  if (isClosed && !isLoggedIn) {
    return (
      <Redirect
        to={{ pathname: "/login", state: { prevPath: rest.location.pathname } }}
      />
    );
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...rest} component={Component} />;
}

// defined default property to isClosed.
MyRoute.defaultProps = {
  isClosed: false,
};

// defined properties (PropTypes)
MyRoute.propTypes = {
  // to guarantee that component property must be either a React element or a function.
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired, // Obrigatório
  isClosed: PropTypes.bool,
};
