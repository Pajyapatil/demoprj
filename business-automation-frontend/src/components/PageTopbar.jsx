function PageTopbar({ title, subtitle, action }) {
  return (
    <header className="page-topbar">
      <div className="page-title-group">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="page-topbar-right">
        {action}
        <button className="icon-button" type="button" aria-label="Notifications">
          <span className="notification-dot" />
          N
        </button>
        <div className="avatar-stack" aria-hidden="true">
          <span className="avatar-badge avatar-light">A</span>
          <span className="avatar-badge avatar-dark">S</span>
        </div>
      </div>
    </header>
  );
}

export default PageTopbar;
