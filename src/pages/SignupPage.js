import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5005";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [role, setRole] = useState("CHEF");
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();

  //Get all users from the database
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

  //Handle each of the inputs of the form
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };
  const handleName = (e) => {
    setName(e.target.value);
    setErrorMessage("");
  };
  const handleRole = (e) => {
    setRole(e.target.value);
    setErrorMessage("");
  };

  //Handle the form's subsmission
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name, role };
    const storedToken = localStorage.getItem("authToken");
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
        if (error.response.data.errors) {
          const errorDescription = error.response.data.errors[0].defaultMessage;
          setErrorMessage(errorDescription);
        } else {
          const errorDescription = error.response.data.message;
          setErrorMessage(errorDescription);
        }
      });
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
      <div className="users">
        {/* Show all the users organized in a table */}
        <table>
          <tr>
            <th>
              <h2>Employee name</h2>
            </th>
            <th>
              <h2>Role</h2>
            </th>
          </tr>
          {users &&
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role.name}</td>
              </tr>
            ))}
        </table>
      </div>
      <div className="grid align__item">
        <div className="register">
          <h2>New employees</h2>
          <form onSubmit={handleSignupSubmit} className="form">
            <label>Email:</label>
            <div className="form__field">
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmail}
              />
            </div>
            <label>Password:</label>
            <div className="form__field">
              <input
                type="password"
                name="password"
                value={password}
                onChange={handlePassword}
              />
            </div>
            <label>Name:</label>
            <div className="form__field">
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleName}
              />
            </div>
            <label>Role:</label>
            <div className="form__field">
              <select name="role" value={role} onChange={handleRole}>
                <option value="CHEF">Chef</option>
                <option value="WAITER">Waiter</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="form__field">
              <button type="submit">Register</button>
            </div>
          </form>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
