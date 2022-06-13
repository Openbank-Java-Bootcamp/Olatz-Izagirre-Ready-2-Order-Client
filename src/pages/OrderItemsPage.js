import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function OrderItemsPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [chef, setChef] = useState("");

  const { user } = useContext(AuthContext);

  const getAllOrderItems = () => {
    const stored = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/orderItems`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((response) => setOrderItems(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllOrderItems();
    setChef(user.name);
  }, []);

  const handleName = (e) => setName(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handleImage = (e) => setImage(e.target.value);
  const handlePrice = (e) => setPrice(e.target.value);

  const handleCreate = (e) => {
    e.preventDefault();

    const requestBody = { name, description, image, price, chef };

    const storedToken = localStorage.getItem("authToken");

    axios
      .post(`${API_URL}/api/orderItems`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setName("");
        setDescription("");
        setImage("");
        setPrice("");
        getAllOrderItems();
      })
      .catch((error) => console.log(error));
  };

  const toggleVisibility = (id) => {
    const token = localStorage.getItem("authToken");
    const body = null
    axios
      .patch(`${API_URL}/api/orderItems/${id}`,body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => getAllOrderItems())
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Create new item</h1>

      <form onSubmit={handleCreate}>
        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={handleName} />

        <label>Description:</label>
        <textarea
          type="text"
          name="description"
          value={description}
          onChange={handleDescription}
        />

        <label>Image:</label>
        <input type="text" name="image" value={image} onChange={handleImage} />

        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={price}
          onChange={handlePrice}
        />

        <button type="submit">Create</button>
      </form>
      {orderItems.map((orderItem) => (
        <div key={orderItem.id}>
          <img src={orderItem.image} alt={orderItem.name} height="100px" />
          <h1>{orderItem.name}</h1>
          <p>{orderItem.description}</p>
          <h3>{orderItem.price} €</h3>
          <button onClick={() => toggleVisibility(orderItem.id)}>
            {orderItem.visible ? <span>HIDE</span> : <span>SHOW</span>}
          </button>
        </div>
      ))}
    </div>
  );
}
export default OrderItemsPage;
