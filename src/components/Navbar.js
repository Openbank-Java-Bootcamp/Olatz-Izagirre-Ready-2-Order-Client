import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function Navbar() {
  const { isLoggedIn, user, logOutUser, role } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <nav className="Navbar">
      <h2>READY2ORDER</h2>
      <div>
      {isLoggedIn&&
      <Link to="/resume">
        <button>Home</button>
      </Link>}

      {role === "ADMIN" && (
        <>
          <Link to="/signup">
            <button>Employees</button>
          </Link>
          <Link to="/tables">
            <button>Tables</button>
          </Link>
          <Link to="/orders">
            <button>Orders</button>
          </Link>
        </>
      )}
      {role === "CHEF" && (
        <>
          <Link to="/orderItems">
            <button>Food</button>
          </Link>
          <Link to="/chef/orders">
          <button>Orders</button>
          </Link>
        </>
      )}
      {role === "WAITER" && (
        <>
          <Link to="/tables/waiter">
            <button>Tables</button>
          </Link>
          <Link to="/waiter/orders">
            <button>Orders</button>
          </Link>
        </>
      )}
      {isLoggedIn && (
        <>
        <button
            className="btn btn-primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
          <Link to="/">
            <button onClick={logOutUser}>Logout</button>
          </Link>
          <span>{user && <span>Welcome, {user.name}</span>}</span>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Link to="/">
            <button>Home</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </button>
        </>
      )}
      </div>
    </nav>
  );
}

export default Navbar;
