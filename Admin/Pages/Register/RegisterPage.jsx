import { useState } from "react";
import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";

const SignUpPage = () => {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const navigate = useNavigate();

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type, message) => {
    api[type]({
      message: "Notification",
      description: message,
    });
  };

  const handleSignUp = () => {
    if (!email || !password || !name) {
      openNotification("error", "You must fill in all fields!");
      return;
    }
    if (password.length < 8) {
      openNotification("error", "Password must be at least 8 characters long!");
      return;
    }
    if (password !== currentPassword) {
      openNotification("error", "Passwords do not match!");
      return;
    }

    if (phone.length < 10 || phone.length > 11) {
      openNotification("error", "Phone number must be 10 or 11 digits long!");
      return;
    }

    const userData = {
      name: name,
      email,
      password,
      phone,
      role: "admin",
    };

    fetch(`${import.meta.env.VITE_API_URL}/api/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          openNotification(
            "error",
            data.message || "Registration failed, please try again."
          );
        } else {
          openNotification("success", "Registration successful!");
          navigate("/login");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        openNotification("error", "An error occurred, please try again later.");
      });
  };

  return (
    <div className="register-container">
      {contextHolder}
      <div className="register-header">
        <p>Welcome to our Todo List Management</p>
      </div>
      <div className="register-wrapper">
        <div className="register-box">
          <h1 className="register-title">Sign up</h1>
          <input
            placeholder="Full Name"
            type="text"
            className="register-input"
            value={name}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="register-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="register-input"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <button className="register-button" onClick={handleSignUp}>
            Sign Up
          </button>
          <div className="register-footer">
            Already have an account?{" "}
            <Link to="/login" className="register-link">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
