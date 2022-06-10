import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsWaiter({ children }) {
  const { isLoggedIn, isLoading, role } = useContext(AuthContext);

  // If the authentication is still loading
  if (isLoading) return <p>Loading ...</p>;

  if (!isLoggedIn || role !== "WAITER") {
    // If the user is logged in, navigate to home page
    return <Navigate to="/" />;
  }
    else {
    // If the user is not logged in, allow to see the page
    return children;
  }
}

export default IsWaiter;