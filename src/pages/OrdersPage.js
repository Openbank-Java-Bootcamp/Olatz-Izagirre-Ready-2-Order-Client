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
      <h2>Orders</h2>
      <div className="foods">
      {orders &&
        orders.map((order) => (
          <div key={order.id} className="food">
            <h2>Table : {order.eatingTable.id}</h2>
            <h3>{order.status}</h3>
            <h4>Bill : {order.total} €</h4>
          </div>
        ))}
    </div></div>
  );
}
export default OrdersPage;
