import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";

function IsAdmin({ children }) {
  const { isLoggedIn, isLoading, role } = useContext(AuthContext);

  if (isLoading) return <p>Loading ...</p>;

  if (!isLoggedIn || role !== "ADMIN") {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}

export default IsAdmin;
