import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [inputs, setInputs] = useState({
    userName: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputs.password !== inputs.cpassword) {
      alert("Password mismatch");
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/authen/register",
          inputs,
        );
        if (response.status === 201) {
          alert(response.data.message);
          navigate("/login");
        }
      } catch (err) {
        if (err.response && err.response.status === 409) {
          alert(err.response.data.message);
        } else {
          alert("Register failed");
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Register</h2>
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
            type="email"
            name="email"
            placeholder="Email"
            value={inputs.email}
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
          <input
            className="auth-input"
            type="password"
            name="cpassword"
            placeholder="Confirm Password"
            value={inputs.cpassword}
            onChange={handleChange}
            required
          />
          <button className="auth-button" type="submit">
            Sign Up
          </button>
          <div className="auth-link">
            Have an Account? <Link to="/login">Login Here</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
