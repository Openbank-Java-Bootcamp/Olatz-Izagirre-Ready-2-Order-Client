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
    <div className="center_align">
      <h2>ORDERS TO PREPARE</h2>
      <div className="align">
        <div className="foods">
          {orders &&
            orders.map((order) => (
              <div key={order.id} className="food">
                <h3>Table : {order.eatingTable.id}</h3>
                <form>
                  {order.orderItems.map((item, index) => (
                    <div key={index}>
                      <h4><input type="checkbox" />
                      {item.name}</h4>
                    </div>
                  ))}
                </form>
                <button onClick={() => changeStatus(order.id)}>DONE</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
export default ChefOrdersPage;
