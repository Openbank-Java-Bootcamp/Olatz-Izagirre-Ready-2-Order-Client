import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function EditOrderPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [itemsId, setItemsId] = useState([]);
  const [order, setOrder] = useState([]);
  const [tableId, setTableId] = useState(null);
  const [status, setStatus] = useState(null);

  const { orderId } = useParams();

  const navigate = useNavigate();

  //Add an item to the order
  const selectItem = (item) => {
    const newIds = [...itemsId, item.id];
    setItemsId(newIds);
    const newOrder = [...order, item];
    setOrder(newOrder);
  };

  //Delete an item from the order
  const deselectItem = (index) => {
    const items = [...itemsId];
    items.splice(index, 1);
    setItemsId(items);
    order.splice(index, 1);
    setOrder(order);
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

  //Update the order or delete it from the database
  const sendToKitchen = () => {
    const requestBody = { orderId, tableId, itemsId };
    const storedToken = localStorage.getItem("authToken");
    if (itemsId.length > 0) {
      axios
        .put(`${API_URL}/api/foodOrders/${orderId}`, requestBody, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          setOrder([]);
          setItemsId([]);
          getOrder();
          navigate(`/tables/${tableId}/order`);
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .delete(`${API_URL}/api/foodOrders/${orderId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then(() => {
          navigate(`/tables/waiter`);
        })
        .catch((error) => console.log(error));
    }
  };

  //Get the selected order from the database
  const getOrder = () => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/foodOrders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOrder(response.data.orderItems);
        setTableId(response.data.eatingTable.id);
        setStatus(response.data.status);
        const newOrderItems = response.data.orderItems;
        let newItems = [];
        for (let i = 0; newOrderItems.length > i; i++) {
          newItems.push(newOrderItems[i].id);
          setItemsId(newItems);
        }
      })
      .catch((error) => console.log(error));
  };

  //Show an order's details
  const showDetails = () => {
    return (
      <div>
        <div className="center_align">
          <div className="food">
            <h2>ORDER {orderId}</h2>
            <h3>{status}</h3>
            {order.map((item, i) => (
              <div key={i}>
                <h4>{item.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getVisibleItems();
    getOrder();
  }, []);

  return (
    <div>
      <button
        className="back"
        onClick={() => {
          navigate(`/tables/${tableId}/order`);
        }}
      >
        Back
      </button>
      {/* If the status of the selected order equals ORDERED, show the menu and the order in order to edit the selected order */}
      {status === "ORDERED" && (
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
                    <h2>EDIT ORDER</h2>
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
      {/* If the status of the selected order equals COOKED or SERVED, show the details of the selected order  */}
      {status === "COOKED" && showDetails()}
      {status === "SERVED" && showDetails()}
    </div>
  );
}
export default EditOrderPage;
