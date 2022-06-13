import axios from "axios";
import { useEffect, useState } from "react";


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
  }, []);
  return (
    <div className="right_align">
      <h2>Menu</h2>
      <div className="foods">
      {orderItems.map((orderItem) => (
        <div key={orderItem.id} className="food">
          <img src={orderItem.image} alt={orderItem.name} height="100px" />
          <h3>{orderItem.name}</h3>
          <p>{orderItem.description}</p>
          <h4>{orderItem.price} €</h4>
        </div>
      ))}
    </div>
    </div>
  );
}

export default HomePage;
