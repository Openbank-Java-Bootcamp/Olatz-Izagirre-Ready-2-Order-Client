import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5005";

function SignupPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [role, setRole] = useState("CHEF");
  const [users, setUsers] = useState([]);

  const getAllUsers = () => {

    const stored = localStorage.getItem("authToken");
    axios
      .get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const navigate = useNavigate();
  

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleRole = (e) => setRole(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name, role };

    const storedToken = localStorage.getItem("authToken");
    // Make an axios request to the API
    // If POST request is successful redirect to login page
    // If the request resolves with an error, set the error message in the state
    axios
      .post(`${API_URL}/auth/signup`, requestBody, {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
      .then((response) => {
        setEmail("");
        setPassword("");
        setName("");
        setRole("CHEF");
        getAllUsers();
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={handleEmail} />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={handleName} />

        <label>Role:</label>
        <select name="role" value={role} onChange={handleRole}>
          <option value="CHEF">Chef</option>
          <option value="WAITER">Waiter</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}

      <div>
        {users && users.map((user)=><div key ={user.id}><h1>{user.name}</h1><h2>{user.role.name}</h2></div>)}
      </div>

      
    </div>
  );
}

export default SignupPage;
