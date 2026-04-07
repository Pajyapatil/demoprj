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
  faMoon,
  faSun,
  faUser,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context/AppContext";

function DashboardLayout() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAppContext();
  const [darkMode, setDarkMode] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: faChartLine },
    { to: "/dashboard/contacts", label: "Contacts", icon: faUsers },
    { to: "/dashboard/campaigns", label: "Campaigns", icon: faBullhorn },
    { to: "/dashboard/schedule", label: "Schedule", icon: faCalendar },
    { to: "/dashboard/reports", label: "Reports", icon: faFileAlt },
  ];

  if (currentUser?.role === "admin") {
    links.unshift({ to: "/admin", label: "Admin", icon: faShieldHalved });
    links.push({ to: "/dashboard/settings", label: "Settings", icon: faGear });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={darkMode ? "layout dark" : "layout"}>
      <div className="sidebar">
        <h2 className="logo">BizNotify</h2>

        <nav>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === "/dashboard"}>
              <FontAwesomeIcon icon={link.icon} /> {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="content">
        <div className="topbar">
          <div className="topbar-user">
            <strong>{currentUser?.name}</strong>
            <span>{currentUser?.role === "admin" ? "Admin" : "User"}</span>
          </div>

          <button onClick={() => setDarkMode(!darkMode)}>
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <div className="profile" onClick={() => setOpenProfile(!openProfile)}>
            <div className="avatar">
              <FontAwesomeIcon icon={faUser} />
            </div>

            {openProfile && (
              <div className="dropdown">
                <p>{currentUser?.email}</p>
                <p onClick={handleLogout}>Logout</p>
              </div>
            )}
          </div>
        </div>

        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
