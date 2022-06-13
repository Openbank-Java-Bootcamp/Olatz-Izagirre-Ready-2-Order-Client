import axios from "axios";
import { useEffect, useState } from "react";


const API_URL = "http://localhost:5005";

function ChefOrdersPage() {
  const [orders, setOrders] = useState([]);

  const getOrders = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .get(`${API_URL}/api/foodOrders/status/ordered`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.log(error));
  };

  const changeStatus = (id) => {
    const stored = localStorage.getItem("authToken");

    const body = null;

    axios
      .patch(`${API_URL}/api/foodOrders/${id}`, body, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((response) => getOrders())
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getOrders();
  }, []);

  console.log(orders);
  return (
    <div>
      <h1>ORDERS TO PREPARE</h1>
      {orders &&
        orders.map((order) => (
          <div key={order.id}>
            <h1>Table : {order.eatingTable.id}</h1>
            <form>
            {order.orderItems.map((item, index) => (
              <div key={index}>
              <input type="checkbox" />{item.name}
              </div>
            ))}
            </form>
            <button onClick={() => changeStatus(order.id)}>DONE</button>
          </div>
        ))}
    </div>
  );
}
export default ChefOrdersPage;
