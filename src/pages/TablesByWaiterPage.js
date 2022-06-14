import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function TablesByWaiterPage() {
  const [tables, setTables] = useState([]);

  const { user } = useContext(AuthContext);

  const getTables = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .get(`${API_URL}/api/waiters/eatingTables`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        params: { name: user.name },
      })
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getTables();
  }, []);

  return (
    <div className="center_align"><h2>TABLES</h2>
    <div className="align">
      <div className="tables">
        
        {tables &&
          tables.map((table) => (
            <Link to={`/tables/${table.id}/order`} key={table.id} className="table">
              <h2>{`Table number : ${table.id}`}</h2>
            </Link>
          ))}
      </div>
    </div></div>
  );
}
export default TablesByWaiterPage;
