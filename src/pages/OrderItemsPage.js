import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function OrderItemsPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [chef, setChef] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

//Get all the order iterms from the database
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

  //Handle each of the inputs of the form
  const handleName = (e) => {
    setName(e.target.value);
    setErrorMessage("");
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
    setErrorMessage("");
  };
  const handleImage = (e) => {
    setImage(e.target.value);
    setErrorMessage("");
  };
  const handlePrice = (e) => {
    setPrice(e.target.value);
    setErrorMessage("");
  };

  //Handle the form's subsmission
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
      .catch((error) => {
        if (error.response.data.errors) {
          const errorDescription = error.response.data.errors[0].defaultMessage;
          setErrorMessage(errorDescription);
        } else {
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        }
      });
  };

  //Change an item's visibility
  const toggleVisibility = (id) => {
    const token = localStorage.getItem("authToken");
    const body = null;
    axios
      .patch(`${API_URL}/api/orderItems/${id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => getAllOrderItems())
      .catch((error) => console.log(error));
  };

  return (
    <div className="left_align">
      <button
        className="back_button"
        onClick={() => {
          navigate(`/resume`);
        }}
      >
        Back
      </button>
      <div className="foods">
        {/* Show all the order items */}
        {orderItems.map((orderItem) => (
          <div key={orderItem.id} className="food">
            <div className="circular">
            <img src={orderItem.image} alt={orderItem.name} /></div>
            <h3>{orderItem.name}</h3>
            <p>{orderItem.description}</p>
            <h4>{orderItem.price} €</h4>
            <button onClick={() => toggleVisibility(orderItem.id)}>
              {orderItem.visible ? "HIDE" : "SHOW"}
            </button>
          </div>
        ))}
      </div>
      <div className="grid align__item">
        <div className="register">
          <h2>New food</h2>
          <form onSubmit={handleCreate} className="form">
            <label>Name:</label>
            <div className="form__field">
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleName}
              />
            </div>
            <label>Description:</label>
            <div className="form__field">
              <textarea
                type="text"
                name="description"
                value={description}
                onChange={handleDescription}
              />
            </div>
            <label>Image:</label>
            <div className="form__field">
              <input
                type="text"
                name="image"
                value={image}
                onChange={handleImage}
              />
            </div>
            <label>Price:</label>
            <div className="form__field">
              <input
                type="number"
                name="price"
                value={price}
                onChange={handlePrice}
              />
            </div>
            <div className="form__field">
              <button type="submit">Create</button>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
export default OrderItemsPage;
