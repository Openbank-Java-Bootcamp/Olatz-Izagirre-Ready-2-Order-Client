import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "http://localhost:5005";

function EditOrderPage() {
  const [orderItems, setOrderItems] = useState([]);
  const [itemsId, setItemsId] = useState([]);
  const [order, setOrder] = useState([]);
  const [tableId, setTableId] = useState(null);

  const { orderId } = useParams();

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
    const requestBody = { orderId, tableId, itemsId };
    console.log(requestBody);
    const storedToken = localStorage.getItem("authToken");
    axios
      .put(`${API_URL}/api/foodOrders/${orderId}`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setItemsId([]);
        getOrder();
      })
      .catch((error) => console.log(error));
  };

  const getOrder = () => {
    const token = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/foodOrders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setOrder(response.data.orderItems);
        setTableId(response.data.eatingTable.id);
        const newOrderItems = response.data.orderItems;
        for (let i = 0; newOrderItems.length > i; i++) {
          itemsId.push(newOrderItems[i].id);
          setItemsId(itemsId);
        }

        setItemsId(itemsId);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    getVisibleItems();
    getOrder();
  }, []);

  return (
    <div>
      {order && (
        <div>
          <h1>Edit order</h1>
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
      )}
    </div>
  );
}
export default EditOrderPage;
