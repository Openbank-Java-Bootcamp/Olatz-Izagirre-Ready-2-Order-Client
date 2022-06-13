import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function ResumePage() {
  const { isLoggedIn, isLoading, role } = useContext(AuthContext);
  return (
    <div>
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
    </div>
  );
}
export default ResumePage;
