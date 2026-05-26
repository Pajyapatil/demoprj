import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./DashboardLayout.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUsers,
  faBullhorn,
  faFileAlt,
  faGear,
  faCalendar,
  faCloudMoon,
  faCloudSun,
  faUser,
  faShieldHalved,
  faCircleQuestion,
  faBars
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context/AppContext";

function DashboardLayout() {
  const navigate = useNavigate();
  const { currentUser, logout, isDarkMode, toggleTheme } = useAppContext();
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: faChartLine },
    { to: "/dashboard/contacts", label: "Contacts", icon: faUsers },
    { to: "/dashboard/campaigns", label: "Campaigns", icon: faBullhorn },
    { to: "/dashboard/schedule", label: "Schedule", icon: faCalendar },
    { to: "/dashboard/reports", label: "Reports", icon: faFileAlt },
    { to: "/dashboard/settings", label: "Settings", icon: faGear },
    { to: "/dashboard/help", label: "Help", icon: faCircleQuestion },
  ];

  if (currentUser?.role === "admin") {
    links.unshift({ to: "/admin", label: "Admin", icon: faShieldHalved });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={isDarkMode ? "layout dark" : "layout"}>
      <div className="animated-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      
      <header className="navbar-horizontal">
        <div className="navbar-brand">
          <img src="/logo.svg" alt="BizNotify Logo" className="logo-img" />
          <span>BizNotify</span>
        </div>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        <nav className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to} 
              end={link.to === "/dashboard"}
              onClick={() => setMobileMenuOpen(false)}
            >
              <FontAwesomeIcon icon={link.icon} /> <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="navbar-actions">
          <div className="topbar-user">
            <strong>{currentUser?.name}</strong>
            <span>{currentUser?.role === "admin" ? "Admin" : "User"}</span>
          </div>

          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
            <FontAwesomeIcon 
              icon={isDarkMode ? faCloudSun : faCloudMoon} 
              style={{ color: isDarkMode ? '#fbbf24' : '#818cf8' }}
            />
          </button>

          <div className="profile" onClick={() => setOpenProfile(!openProfile)}>
            <div className="avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>

            {openProfile && (
              <div className="dropdown">
                <p className="dropdown-email">{currentUser?.email}</p>
                <p onClick={() => { navigate('/dashboard/profile'); setOpenProfile(false); }}>Profile</p>
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="content">
        <div className="page">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
