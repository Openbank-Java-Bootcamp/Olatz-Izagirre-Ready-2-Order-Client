import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function ChefOrdersPage() {
  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  //Get all the orders that need to be cooked from the database
  const getOrders = () => {
    const storedToken = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/foodOrders/status/ordered`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.log(error));
  };

  //Change the status of an order from ordered to cooked in the database when the order is prepared
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

  return (
    <div className="center_align">
      <button className="back" onClick={() => navigate(`/resume`)}>
      {"<"}
      </button>
      <h2>ORDERS TO PREPARE</h2>
      <div className="align">
        <div className="foods">
          {/* Show all the orders that need to be cooked */}
          {orders &&
            orders.map((order) => (
              <div key={order.id} className="food">
                <h3>Table : {order.eatingTable.id}</h3>
                <form className="chef_orders">
                  {order.orderItems.map((item, index) => (
                    <div key={index}>
                      <h4>
                        <input type="checkbox" />
                        {item.name}
                      </h4>
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
