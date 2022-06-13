import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function EditTablesPage(props) {
  const [seats, setSeats] = useState("");
  const [waiter, setWaiter] = useState("");
  const [waiters, setWaiters] = useState([]);
  const [table, setTable] = useState("");

  const { tableId } = useParams();

  const getAllWaiters = () => {
    const stored = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/waiters`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((response) => setWaiters(response.data))
      .catch((error) => console.log(error));
  };

  const getTable = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/eatingTables/${tableId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setTable(response.data))
      .catch((error) => console.log(error));
  };


  useEffect(() => {
    getTable();
    getAllWaiters();
  }, []);

  const handleSeats = (e) => setSeats(e.target.value);
  const handleWaiter = (e) => setWaiter(e.target.value);

  const handleEdit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { seats, waiter };

    const storedToken = localStorage.getItem("authToken");
    // Make an axios request to the API
    // If POST request is successful redirect to login page
    // If the request resolves with an error, set the error message in the state
    axios
      .put(`${API_URL}/api/eatingTables/${tableId}`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        getTable();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Edit Table</h1>
      
      {table &&
      <form onSubmit={handleEdit}>
        <label>Seats:</label>
        <input
          type="number"
          name="seats"
          value={seats || setSeats(table.seats)}
          onChange={handleSeats}
        />

        <label>Waiter:</label>
        <select name="waiter" value={waiter || setWaiter(table.waiter.name)} onChange={handleWaiter}>
          <option>-</option>
          {waiters.map((waiter) => (
            <option value={waiter.name} key={waiter.id}>
              {waiter.name}
            </option>
          ))}
        </select>

        <button type="submit">Edit</button>
      </form>}
      {table && <div>
        <h1>{`Table number : ${table.id}`}</h1>
        <h1>{`Table seats : ${table.seats}`}</h1>
        <h2>{`Waiter : ${table.waiter.name}`}</h2>
      </div>}
    </div>
      
  );
}
export default EditTablesPage;