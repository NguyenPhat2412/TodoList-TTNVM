import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message) => {
    api[type]({
      message: "Notification",
      description: message,
    });
  };

  const validate = () => {
    if (!email || !password) {
      openNotification("error", "You must fill in all fields!");
      return false;
    }
    if (password.length < 8) {
      openNotification("error", "Password must be at least 8 characters long!");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const userData = { email, password };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        openNotification("success", data.message);
        navigate("/");
      } else {
        openNotification("error", data.message);
      }
    } catch (error) {
      openNotification("error", "An error occurred, please try again later.");
    }
  };

  return (
    <div className="login-container">
      {contextHolder}
      <div className="login-wrapper">
        <div className="login-box">
          <h1 className="login-title">Login</h1>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" onClick={handleLogin}>
            Log in
          </button>
          <div className="login-footer">
            <span className="login-footer-text">{`Don't have an account?`}</span>
            <Link to="/register" className="login-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
