import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

function WaiterOrdersPage() {
  const [cooked, setCooked] = useState([]);
  const [served, setServed] = useState([]);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const API_URL = "http://localhost:5005";

  //Get all the cooked orders a waiter is responsible for from the database
  const getCooked = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/foodOrders/cooked/waiter`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        params: { name: user.name },
      })
      .then((response) => setCooked(response.data))
      .catch((error) => console.log(error));
  };

  //Get all the served orders a waiter is responsible for from the database
  const getServed = () => {
    const stored = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/foodOrders/served/waiter`, {
        headers: { Authorization: `Bearer ${stored}` },
        params: { name: user.name },
      })
      .then((response) => setServed(response.data))
      .catch((error) => console.log(error));
  };

  //Change the status of an order from cooked to served or from served to paid in the database
  const changeStatus = (id) => {
    const token = localStorage.getItem("authToken");
    const body = null;
    axios
      .patch(`${API_URL}/api/foodOrders/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        getCooked();
        getServed();
      })
      .catch((error) => console.log(error));
  };

  //Show each order detailed
  const showOrders = (orders) => {
    return (
      <div className="newGrid">
        <div className="foods">
          {orders &&
            orders.map((order) => (
              <div key={order.id} className="food">
                <h1>ORDER {order.id}</h1>
                <h2>Table : {order.eatingTable.id}</h2>
                {order.orderItems.map((item, index) => (
                  <div key={index}>
                    {item.name} {item.price} €
                  </div>
                ))}
                <h3>Total : {order.total} €</h3>
                <button onClick={() => changeStatus(order.id)}>
                  {order.status === "COOKED" ? "SERVED" : "PAID"}
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  };

  useEffect(() => {
    getCooked();
    getServed();
  }, []);

  return (
    <div>
      <button
        className="back"
        onClick={() => {
          navigate(`/resume`);
        }}
      >
        {"<"}
      </button>
      <h2>Current orders</h2>
      <div className="row">
        <div className="centered">
          <h2 className="surrounded">Cooked</h2>
          {showOrders(cooked)}
        </div>
        <div className="centered">
          <h2 className="surrounded">Served</h2>
          {showOrders(served)}
        </div>
      </div>
    </div>
  );
}
export default WaiterOrdersPage;
