import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5005";

function TablesPage(props) {
  const [seats, setSeats] = useState("");
  const [waiter, setWaiter] = useState("");
  const [waiters, setWaiters] = useState([]);
  const [tables, setTables] = useState([]);

  const getAllWaiters = () => {
    const stored = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/waiters`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((response) => setWaiters(response.data))
      .catch((error) => console.log(error));
  };

  const getAllTables = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/eatingTables`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setTables(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllWaiters();
  }, []);

  useEffect(() => {
    getAllTables();
  }, []);

  const handleSeats = (e) => setSeats(e.target.value);
  const handleWaiter = (e) => setWaiter(e.target.value);

  const handleCreate = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { seats, waiter };

    const storedToken = localStorage.getItem("authToken");
    // Make an axios request to the API
    // If POST request is successful redirect to login page
    // If the request resolves with an error, set the error message in the state
    axios
      .post(`${API_URL}/api/eatingTables`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setSeats("");
        setWaiter(waiters[0]);
        getAllTables();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>New Table</h1>

      <form onSubmit={handleCreate}>
        <label>Seats:</label>
        <input
          type="number"
          name="seats"
          value={seats}
          onChange={handleSeats}
        />

        <label>Waiter:</label>
        <select name="waiter" value={waiter} onChange={handleWaiter}>
          <option>-</option>
          {waiters.map((waiter) => (
            <option value={waiter.name} key={waiter.id}>
              {waiter.name}
            </option>
          ))}
        </select>

        <button type="submit">Create</button>
      </form>
      <div>
        {tables &&
          tables.map((table) => (
            <Link to={`/tables/${table.id}`} key={table.id}>
                <h1>{`Table number : ${table.id}`}</h1>
              <h1>{`Table seats : ${table.seats}`}</h1>
              <h2>{`Waiter : ${table.waiter.name}`}</h2>
            </Link>
          ))}
      </div>
    </div>
  );
}
export default TablesPage;
