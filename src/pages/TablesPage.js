import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function TablesPage() {
  const [seats, setSeats] = useState("");
  const [waiter, setWaiter] = useState("");
  const [waiters, setWaiters] = useState([]);
  const [tables, setTables] = useState([]);
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  //Get al the waiters form the database
  const getAllWaiters = () => {
    const stored = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/waiters`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((response) => setWaiters(response.data))
      .catch((error) => console.log(error));
  };

  //Get all the tables from the database
  const getAllTables = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/eatingTables`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setTables(response.data))
      .catch((error) => console.log(error));
  };

  //Handle each of the inputs of the form
  const handleSeats = (e) => {
    setSeats(e.target.value);
    setErrorMessage("");
  };
  const handleWaiter = (e) => {
    setWaiter(e.target.value);
    setErrorMessage("");
  };

  //Handle the form's subsmission
  const handleCreate = (e) => {
    e.preventDefault();
    const requestBody = { seats, waiter };
    const storedToken = localStorage.getItem("authToken");
    axios
      .post(`${API_URL}/api/eatingTables`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setSeats("");
        setWaiter(waiters[0]);
        getAllTables();
      })
      .catch((error) => {
        if (error.response.data.errors) {
          const errorDescription = error.response.data.errors[0].defaultMessage;
          setErrorMessage(errorDescription);
        } else {
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        }
      });
  };

  useEffect(() => {
    getAllWaiters();
    getAllTables();
  }, []);

  return (
    <div className="left_align">
      <button
        className="back_button"
        onClick={() => {
          navigate(`/resume`);
        }}
      >
        Back
      </button>
      <div className="tables">
        {/* Show all the tables */}
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
            {errorMessage && <p>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
export default TablesPage;
