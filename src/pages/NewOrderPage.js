import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function NewOrderPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [itemsId, setItemsId] = useState([]);
  const [order, setOrder] = useState([]);
  const [orders, setOrders] = useState([]);

  const { tableId } = useParams();

  const navigate = useNavigate();

  const selectItem = (item) => {
    const newIds = [...itemsId, item.id];
    setItemsId(newIds);
    const newOrder = [...order, item];
    setOrder(newOrder);
  };

  const deselectItem = (index) => {
    itemsId.splice(index, 1);
    if (itemsId.length > 0) {
      setItemsId(itemsId);
    } else {
      setItemsId([]);
    }
    order.splice(index, 1);
    if (order.length > 0) {
      setOrder(order);
      getOrders();
    } else {
      setOrder([]);
    }
  };

  //Get the menu from the database
  const getVisibleItems = () => {
    axios
      .get(`${API_URL}/api/orderItems/visibles`)
      .then((response) => {
        setOrderItems(response.data);
      })
      .catch((error) => console.log(error));
  };

  //Save the new order in the database
  const sendToKitchen = () => {
    if (itemsId.length !== 0) {
      const requestBody = { tableId, itemsId };
      const storedToken = localStorage.getItem("authToken");
      axios
        .post(`${API_URL}/api/foodOrders`, requestBody, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((response) => {
          getOrders();
        })
        .catch((error) => console.log(error));
    }
  };

  //Get all the current table's orders from the database
  const getOrders = () => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/foodOrders/eatingTables/${tableId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.log(error));
  };

//Check if there's any on going order for the table
  const isOngoing = () => {
    let value = false;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].status !== "PAID") {
        value = true;
      }
    }
    return value;
  };

  //Check if there's any ordered order for the table
  const isOrdered = () => {
    let value = false;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].status === "ORDERED") {
        value = true;
      }
    }
    return value;
  };

  useEffect(() => {
    getVisibleItems();
    getOrders();
  }, []);

  return (
    <div>
      <button
        className="back"
        onClick={() => {
          navigate(`/tables/waiter`);
        }}
      >
        {"<"}
      </button>
      {orders && isOngoing() && (
        <div>
          <div className="row">
            {/* Show all the unpaid orders as a summary */}
            {orders.map((order, index) => {
              if (order.status !== "PAID") {
                return (
                  <div key={index} className="foods">
                    <div className="food">
                      <Link to={`/orders/${order.id}`}>
                        <h2>ORDER {order.id}</h2>
                        <h3>{order.status}</h3>
                      </Link>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      )}
      {/* Show the menu and the option to create a new order if there isn't any ordered order yet */}
      {orders && !isOrdered() && (
        <div className="left_align">
          <div className="order_grid">
            <div className="order">
              <h2>Menu</h2>
              <div className="foods">
                {orderItems.map((orderItem) => (
                  <div key={orderItem.id} className="food">
                    <div className="circular">
                      <img src={orderItem.image} alt={orderItem.name} />
                    </div>
                    <h1>{orderItem.name}</h1>
                    <p>{orderItem.description}</p>
                    <h3>{orderItem.price} €</h3>
                    <button onClick={() => selectItem(orderItem)}>ADD</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <table className="fixed">
                <tr>
                  <th>
                    <h2>NEW ORDER</h2>
                  </th>
                  <th>
                    <button onClick={() => sendToKitchen()}>SEND</button>
                  </th>
                </tr>
                {order &&
                  order.map((orderItem, index) => (
                    <tr key={index}>
                      <td>{orderItem.name}</td>
                      <td>
                        <button onClick={() => deselectItem(index)}>
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default NewOrderPage;
