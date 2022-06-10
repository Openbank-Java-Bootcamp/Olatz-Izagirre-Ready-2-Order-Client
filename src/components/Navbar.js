import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser, role } = useContext(AuthContext);


  return (
    <nav className="Navbar">
      <Link to="/">
        <button>Home</button>
      </Link>

      {role=="ADMIN" && (
        <>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link></>)}
          {isLoggedIn && (
        <>
          <Link to="/">
            <button onClick={logOutUser}>Logout</button>
          </Link>
          <span>{user && user.name}</span>
          <span>{user && role}</span>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
