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
    <div className="right_align">
      <div className="users">
        <table>
          <tr>
            <th>
              <h2>Order</h2>
            </th>
            <th>
              <h2>Table</h2>
            </th>
            <th>
              <h2>Status</h2>
            </th>
            <th>
              <h2>Bill</h2>
            </th>
          </tr>
          {orders &&
            orders.map((order) => (
              <tr key={order.id}>
                <td> {order.id}</td>
                <td> {order.eatingTable.id}</td>
                <td>{order.status}</td>
                <td>{order.total} €</td>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
}
export default OrdersPage;
