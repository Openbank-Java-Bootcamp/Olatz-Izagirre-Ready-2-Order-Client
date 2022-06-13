import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function NewOrderPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [itemsId, setItemsId] = useState([]);
  const [order, setOrder] = useState([]);
  const [orders, setOrders] = useState([]);

  const { tableId } = useParams();

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

  const getVisibleItems = () => {
    axios
      .get(`${API_URL}/api/orderItems/visibles`)
      .then((response) => {
        setOrderItems(response.data);
      })
      .catch((error) => console.log(error));
  };

  const sendToKitchen = () => {
    const requestBody = { tableId, itemsId };
    console.log(requestBody);
    const storedToken = localStorage.getItem("authToken");
    axios
      .post(`${API_URL}/api/foodOrders`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        getOrders();
      })
      .catch((error) => console.log(error));
  };

  const getOrders = () => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/foodOrders/eatingTables/${tableId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.log(error));
  };

  const isOngoing = () => {
    let value = false;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].status !== "PAID") {
        value = true;
      }
    }
    return value;
  };

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

  console.log(orders);

  return (
    <div>
      {orders && !isOrdered() && (
        <div>
          <h1>Menu</h1>
          {orderItems.map((orderItem) => (
            <div key={orderItem.id}>
              <img src={orderItem.image} alt={orderItem.name} height="100px" />
              <h1>{orderItem.name}</h1>
              <p>{orderItem.description}</p>
              <h3>{orderItem.price} €</h3>
              <button onClick={() => selectItem(orderItem)}>ADD</button>
            </div>
          ))}
          <div>
            <h1>ORDER</h1>
            {order &&
              order.map((orderItem, index) => (
                <div key={index}>
                  <h1>{orderItem.name}</h1>
                  <button onClick={() => deselectItem(index)}>DELETE</button>
                </div>
              ))}

            <button onClick={() => sendToKitchen()}>SEND</button>
          </div>
        </div>
      )}
      {orders && isOngoing() && (
        <div>
          {orders.map((order, index) => {
            if (order.status === "ORDERED") {
              return (
                <div key={index}>
                  {/* <Link to={`/orders/${order.id}`}> */}
                    <h1>ORDER {order.id}</h1>
                    <h2>{order.status}</h2>
                    {order.orderItems.map((item, i) => (
                      <div key={i}>
                        <h1>{item.name}</h1>
                      </div>
                    ))}
                  {/* </Link> */}
                </div>
              );
            } else if (order.status === "COOKED" || order.status === "SERVED") {
              return (
                <div key={index}>
                  <h1>ORDER {order.id}</h1>
                  <h2>{order.status}</h2>
                  {order.orderItems.map((item, i) => (
                    <div key={i}>
                      <h1>{item.name}</h1>
                    </div>
                  ))}
                </div>
              );
            }
          })}

          {/* <button onClick={() => update()}>EDIT</button> */}
        </div>
      )}
    </div>
  );
}
export default NewOrderPage;
