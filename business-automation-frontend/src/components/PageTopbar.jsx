import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCloudSun, faCloudMoon, faBell, faGear, faCircleQuestion, 
  faUser, faSearch, faSignOutAlt, faUserCircle 
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import "./PageTopbar.css";

function PageTopbar({ title, subtitle, action }) {
  const { isDarkMode, toggleTheme, currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="page-topbar">
      <div className="page-topbar-left">
        <div className="page-title-group">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="page-topbar-right">
        {action && <div className="topbar-action">{action}</div>}

        <div className="search-container hidden-mobile">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>

        <div className="topbar-divider hidden-mobile"></div>

        <button className="icon-button" type="button" aria-label="Toggle Theme" onClick={toggleTheme} title="Toggle Theme">
          {isDarkMode ? <FontAwesomeIcon icon={faCloudSun} style={{ color: '#fbbf24' }} /> : <FontAwesomeIcon icon={faCloudMoon} style={{ color: '#6366f1' }} />}
        </button>
        
        <button className="icon-button" type="button" aria-label="Notifications" title="Notifications">
          <span className="notification-dot" />
          <FontAwesomeIcon icon={faBell} />
        </button>
        
        <button className="icon-button hidden-mobile" type="button" aria-label="Settings" title="Settings" onClick={() => navigate('/dashboard/settings')}>
          <FontAwesomeIcon icon={faGear} />
        </button>

        <button className="icon-button hidden-mobile" type="button" aria-label="Help" title="Help" onClick={() => navigate('/dashboard/help')}>
          <FontAwesomeIcon icon={faCircleQuestion} />
        </button>

        <div className="topbar-divider"></div>

        <div className="profile-section" ref={profileRef}>
          <div className="profile-trigger" onClick={() => setOpenProfile(!openProfile)}>
            <div className="topbar-user hidden-mobile">
              <span className="user-name">{currentUser?.name || "Guest User"}</span>
              <span className="user-role">{currentUser?.role === "admin" ? "Administrator" : "User"}</span>
            </div>
            <div className="avatar">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt="Avatar" />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </div>
          </div>

          <div className={`profile-dropdown ${openProfile ? 'show' : ''}`}>
            <div className="dropdown-header">
              <p className="dropdown-name">{currentUser?.name || "Guest User"}</p>
              <p className="dropdown-email">{currentUser?.email || "guest@example.com"}</p>
            </div>
            <div className="dropdown-body">
              <button className="dropdown-item" onClick={() => { navigate('/dashboard/profile'); setOpenProfile(false); }}>
                <FontAwesomeIcon icon={faUserCircle} /> My Profile
              </button>
              <button className="dropdown-item" onClick={() => { navigate('/dashboard/settings'); setOpenProfile(false); }}>
                <FontAwesomeIcon icon={faGear} /> Settings
              </button>
            </div>
            <div className="dropdown-footer">
              <button className="dropdown-item logout" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default PageTopbar;
