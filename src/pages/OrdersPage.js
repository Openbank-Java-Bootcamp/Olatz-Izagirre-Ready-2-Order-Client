import axios from "axios";
import { useEffect, useState } from "react";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const API_URL = "http://localhost:5005";

  const getOrders = () => {
    const storedToken = localStorage.getItem("authToken");

    axios
      .get(`${API_URL}/api/foodOrders`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      {orders &&
        orders.map((order) => (
          <div key={order.id}>
            <h2>Table : {order.eatingTable.id}</h2>
            <h3>Status : {order.status}</h3>
            <h4>Bill : {order.total} €</h4>
          </div>
        ))}
    </div>
  );
}
export default OrdersPage;
