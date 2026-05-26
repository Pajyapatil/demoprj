import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";
import { useAppContext } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function ForgotPassword() {
  const { isDarkMode, toggleTheme } = useAppContext();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email) {
      // In a real app, this would call an API to send a reset link
      setIsSuccess(true);
      setMessage("Password reset instructions have been sent to your email.");
    }
  };

  return (
    <div className="login-container">
      <button onClick={toggleTheme} className="login-theme-toggle" aria-label="Toggle Theme">
        <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
      </button>

      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="login-left">
        <div className="login-brand">
          <img src="/logo.svg" alt="BizNotify Logo" className="login-logo-img" />
          <h1>Business Automation Platform</h1>
        </div>
        <p>Regain access to your automated campaigns.</p>
      </div>

      <div className="login-right">
        <div className="login-box">
          <h1>Reset Password</h1>
          
          {isSuccess ? (
            <div className="success-state">
              <p className="form-message success-text">{message}</p>
              <Link to="/login" className="back-link-btn">Return to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="reset-desc">
                Enter the email address associated with your account, and we'll send you a link to reset your password.
              </p>
              
              <div className="input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {message && <p className="form-message error-text">{message}</p>}

              <button type="submit">Send Reset Link</button>
            </form>
          )}

          <p className="register-text">
            Remembered your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
