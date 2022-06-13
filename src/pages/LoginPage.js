// src/pages/LoginPage.js

import { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const API_URL = "http://localhost:5005";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrorMessage(undefined);
  };
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrorMessage(undefined);
  };
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    axios
      .post(`${API_URL}/auth/login`, requestBody)
      .then((response) => {
        console.log("JWT token", response.data.authToken);

        storeToken(response.data.authToken);

        authenticateUser();

        navigate("/resume");
      })
      .catch((error) => {
        setErrorMessage("Wrong email or password.");
      });
  };

  return (
    <div className="align">
      <div className="grid align__item">
        <div className="register">
          <h2>Log in</h2>

          <form onSubmit={handleLoginSubmit} className="form">
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
            <div className="form__field">
              <button type="submit">LOG IN</button>
            </div>
          </form>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
