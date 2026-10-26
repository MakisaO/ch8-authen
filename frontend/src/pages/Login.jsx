import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/authen/login",
        inputs,
      );
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        alert(response.data.message);
        // สั่งรีเฟรชหน้าต่าง 1 ครั้งเพื่อให้ Layout โหลดข้อมูล Token ใหม่ แล้วค่อยเด้งไปหน้าแรก
        window.location.href = "/";
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        alert(err.response.data.message);
      } else {
        alert("Login failed");
      }
    }
    setInputs({ userName: "", password: "" });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="auth-input"
            type="text"
            name="userName"
            placeholder="Username"
            value={inputs.userName}
            onChange={handleChange}
            required
          />
          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            value={inputs.password}
            onChange={handleChange}
            required
          />
          <button className="auth-button" type="submit">
            Login
          </button>
          <div className="auth-link">
            No Account? <Link to="/register">Register Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
