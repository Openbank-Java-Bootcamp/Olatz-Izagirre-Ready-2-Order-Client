import axios from "axios";
import { useEffect, useState } from "react";

// src/pages/HomePage.js
const API_URL = "http://localhost:5005";

function HomePage() {
  const [orderItems, setOrderItems] = useState([]);

  const getVisibleItems = () => {
    axios
      .get(`${API_URL}/api/orderItems/visibles`)
      .then((response) => {
        setOrderItems(response.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getVisibleItems();
  }, [orderItems]);
  return (
    <div>
      <h1>Menu</h1>
      {orderItems.map((orderItem) => (
        <div key={orderItem.id}>
          <img src={orderItem.image} alt={orderItem.name} height="100px" />
          <h1>{orderItem.name}</h1>
          <p>{orderItem.description}</p>
          <h3>{orderItem.price} €</h3>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
