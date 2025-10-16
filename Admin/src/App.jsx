import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import DashBoard from "../components/Dashboard/Dashboard";
import Users from "../Pages/Users";
import Information from "../components/Infomation";
import LoginPage from "../Pages/Login/LoginPage";
import SignUpPage from "../Pages/Register/RegisterPage";
import DetailsUser from "../Pages/DetailsUser/DetailsUser";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/register" element={<SignUpPage />} />
          <Route path="/details-user" element={<DetailsUser />} />
        </Routes>
      </BrowserRouter>
      <Information />
    </>
  );
}

export default App;
