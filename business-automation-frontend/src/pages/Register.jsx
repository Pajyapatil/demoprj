import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { useAppContext } from "../context/AppContext";

function Register() {
  const navigate = useNavigate();
  const { organisations, register } = useAppContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    password: "",
    confirmPassword: "",
    role: "user",
    organisationId: organisations[0]?.id || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Password and confirm password must match.");
      return;
    }

    const result = register(form);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="input-group">
            <label>Organization</label>
            <input
              type="text"
              name="organization"
              placeholder="Enter organization's name"
              value={form.organization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Contact No</label>
            <input
              type="text"
              name="contact"
              placeholder="Enter contact number"
              value={form.contact}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {message && <p className="form-message">{message}</p>}

          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
