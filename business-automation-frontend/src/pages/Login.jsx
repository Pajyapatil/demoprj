import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useAppContext } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login(form.email, form.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Business Automation Platform</h1>
        <p>Automate WhatsApp, SMS, and email campaigns without manual follow-up chaos.</p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>
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
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="form-message error-text">{error}</p>}

            <div className="extra-links">
              <span>Demo admin: admin@biznotify.com / admin123</span>
            </div>

            <button type="submit">Login</button>
          </form>

          <p className="register-text">
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
