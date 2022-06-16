import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function ResumePage() {
  const { role } = useContext(AuthContext);
  return (
    <div className="resume">
      {/* Show different options depending on the role logged in */}
      {role === "ADMIN" && (
        <>
          <Link to="/signup">
            <button>
              <h2>Employees</h2>
            </button>
          </Link>
          <Link to="/tables">
            <button>
              <h2>Tables</h2>
            </button>
          </Link>
          <Link to="/orders">
            <button>
              <h2>Orders</h2>
            </button>
          </Link>
        </>
      )}
      {role === "CHEF" && (
        <>
          <Link to="/orderItems">
            <button>
              <h2>Food</h2>
            </button>
          </Link>
          <Link to="/chef/orders">
            <button>
              <h2>Orders</h2>
            </button>
          </Link>
        </>
      )}
      {role === "WAITER" && (
        <>
          <Link to="/tables/waiter">
            <button>
              <h2>Tables</h2>
            </button>
          </Link>
          <Link to="/waiter/orders">
            <button>
              <h2>Orders</h2>
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
export default ResumePage;
