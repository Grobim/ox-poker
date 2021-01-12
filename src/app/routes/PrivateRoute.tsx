import { isEmpty, isLoaded } from "react-redux-firebase";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { useAuth, useProfile } from "../../features/auth";

interface PrivateRouteProps extends RouteProps {
  role?: string;
}

function PrivateRoute({ role, ...rootProps }: PrivateRouteProps) {
  const auth = useAuth();
  const profile = useProfile();

  if (!isLoaded(auth)) {
    return null;
  }

  if (isEmpty(auth) || auth.isAnonymous) {
    const { location } = rootProps;

    return <Redirect to={{ pathname: "/login", state: { from: location } }} />;
  }

  if (!isLoaded(profile)) {
    return null;
  }

  if (role && role !== profile.role) {
    return <div>No permissions</div>;
  }

  return <Route {...rootProps} />;
}

export default PrivateRoute;
