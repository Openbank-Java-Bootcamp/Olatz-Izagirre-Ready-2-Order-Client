import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function EditTablesPage() {
  const [seats, setSeats] = useState("");
  const [waiter, setWaiter] = useState("");
  const [waiters, setWaiters] = useState([]);
  const [table, setTable] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

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

  const handleSeats = (e) => {
    setSeats(e.target.value);
    setErrorMessage("");
  };
  const handleWaiter = (e) => {
    setWaiter(e.target.value);
    setErrorMessage("");
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const requestBody = { seats, waiter };

    const storedToken = localStorage.getItem("authToken");
    axios
      .put(`${API_URL}/api/eatingTables/${tableId}`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        getTable();
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

  return (
    <div className="left_align">
      <div className="editTables"></div>
      {table && (
        <div className="editTable">
          <h2>{`Table number : ${table.id}`}</h2>
          <h2>{`Table seats : ${table.seats}`}</h2>
          <h3>{`Waiter : ${table.waiter.name}`}</h3>
        </div>
      )}
      <div className="grid align__item">
        <div className="register">
          <h2>Edit Table</h2>
          {table && (
            <form onSubmit={handleEdit} className="form">
              <label>Seats:</label>
              <div className="form__field">
                <input
                  type="number"
                  name="seats"
                  value={seats || setSeats(table.seats)}
                  onChange={handleSeats}
                />
              </div>
              <label>Waiter:</label>
              <div className="form__field">
                <select
                  name="waiter"
                  value={waiter || setWaiter(table.waiter.name)}
                  onChange={handleWaiter}
                >
                  <option>-</option>
                  {waiters.map((waiter) => (
                    <option value={waiter.name} key={waiter.id}>
                      {waiter.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form__field">
                <button type="submit">Edit</button>
              </div>
              {errorMessage && <p>{errorMessage}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
export default EditTablesPage;
