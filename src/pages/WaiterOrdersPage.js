import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";

function WaiterOrdersPage() {
  const [cooked, setCooked] = useState([]);
  const [served, setServed] = useState([]);

  const { user } = useContext(AuthContext);

  const API_URL = "http://localhost:5005";

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

  useEffect(() => {
    getCooked();
    getServed();
  }, []);

  return (
    <div>
      <h1>Current orders</h1>
      <h2>Cooked</h2>
      {cooked &&
        cooked.map((order) => (
          <div key={order.id}>
            <h3>Table : {order.eatingTable.id}</h3>
            {order.orderItems.map((item, index) => (
              <div key={index}>{item.name} {item.price} €</div>
            ))}
            <h3>Total : {order.total} €</h3>
            <button onClick={() => changeStatus(order.id)}>SERVED</button>
          </div>
        ))}
      <h2>Served</h2>
      {served &&
        served.map((order) => (
          <div key={order.id}>
            <h3>Table : {order.eatingTable.id}</h3>
            {order.orderItems.map((item, index) => (
              <div key={index}>{item.name} {item.price} €</div>
            ))}
            <h3>Total : {order.total} €</h3>
            <button onClick={() => changeStatus(order.id)}>PAID</button>
          </div>
        ))}
    </div>
  );
}
export default WaiterOrdersPage;
