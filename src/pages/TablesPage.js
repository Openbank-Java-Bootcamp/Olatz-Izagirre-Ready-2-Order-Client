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
    <div className="left_align">
      <div className="tables">
        {tables &&
          tables.map((table) => (
            <Link to={`/tables/${table.id}`} key={table.id} className="table">
              <h2>{`Table number : ${table.id}`}</h2>
              <h2>{`Table seats : ${table.seats}`}</h2>
              <h3>{`Waiter : ${table.waiter.name}`}</h3>
            </Link>
          ))}
      </div>
      <div className="grid align__item">
        <div className="register">
          <h2>New Table</h2>

          <form onSubmit={handleCreate} className="form">
            <label>Seats:</label>
            <div className="form__field">
              <input
                type="number"
                name="seats"
                value={seats}
                onChange={handleSeats}
              />
            </div>

            <label>Waiter:</label>
            <div className="form__field">
              <select name="waiter" value={waiter} onChange={handleWaiter}>
                <option>-</option>
                {waiters.map((waiter) => (
                  <option value={waiter.name} key={waiter.id}>
                    {waiter.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form__field">
              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default TablesPage;
