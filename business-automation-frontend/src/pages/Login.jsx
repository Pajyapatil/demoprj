import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faArrowRight, faChartLine, faRobot, faBullhorn } from "@fortawesome/free-solid-svg-icons";
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
  const [isSuccess, setIsSuccess] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "Logged in successfully! Redirecting you...";

  useEffect(() => {
    if (isSuccess) {
      let index = 0;
      setTypedText("");
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, index + 1));
        index++;
        if (index >= fullText.length) {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isSuccess]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const result = login(form.email, form.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      navigate(result.user.role === "admin" ? "/admin" : "/dashboard");
    }, 2500);
  };

  return (
    <div className="login-page-wrapper">
      {/* Animated Background Blobs */}
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="login-container animate-fade-in">
        <div className="login-left">
          <div className="brand-section">
            <h1><span className="text-gradient">BizNotify</span> Platform</h1>
            <p>Automate WhatsApp, SMS, and email campaigns without manual follow-up chaos.</p>
          </div>

          <div className="features-section">
            <div className="feature-item">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div className="feature-text">
                <h3>Smart Automation</h3>
                <p>Set up workflows that run automatically 24/7.</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faBullhorn} />
              </div>
              <div className="feature-text">
                <h3>Multi-channel Campaigns</h3>
                <p>Reach your audience via Email, SMS & WhatsApp.</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div className="feature-text">
                <h3>Real-time Analytics</h3>
                <p>Track delivery, open rates, and conversions instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className={`login-box ${isSuccess ? "success-state" : ""}`}>
            {isSuccess ? (
              <div className="login-success-screen">
                <div className="success-checkmark-wrapper">
                  <svg className="success-checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h2>Success!</h2>
                <div className="typing-text-wrapper">
                  <span className="typing-text">{typedText}</span>
                  <span className="typing-cursor"></span>
                </div>
                <div className="success-loader-bar">
                  <div className="success-loader-progress"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="login-header">
                  <h2>Welcome Back</h2>
                  <p>Log in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder="name@company.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <FontAwesomeIcon icon={faLock} className="input-icon" />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {error && <div className="form-message error-text">{error}</div>}

                  <div className="extra-links">
                    <span className="demo-credentials">Demo: admin@biznotify.com / admin123</span>
                    <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
                  </div>

                  <button type="submit" className="submit-btn">
                    <span>Sign In</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </form>

                <p className="register-text">
                  Don&apos;t have an account? <Link to="/register">Create an account</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
