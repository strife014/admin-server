import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";

function AdminProtectedRoute({ component: Component, Auth, history, res }) {
  console.log(Auth);
  return (
    <Route
      {...res}
      render={(props) =>
        Auth.state.isAuthenticated && Auth.state.userData.myStatus == "home" ? (
          <Component Auth={Auth} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default withRouter(AdminProtectedRoute);
