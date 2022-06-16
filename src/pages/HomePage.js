import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5005";

function HomePage() {
  const [orderItems, setOrderItems] = useState([]);

  //Get the menu from the database
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
      {/* Show the menu */}
      <div className="foods_home">
        {orderItems.map((orderItem) => (
          <div key={orderItem.id} className="food_homepage">
            <div className="circular">
            <img src={orderItem.image} alt={orderItem.name} />
            </div>
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
