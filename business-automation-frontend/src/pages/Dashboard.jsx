import "./Dashboard.css";
import { useAppContext } from "../context/AppContext";

function Dashboard() {
  const { currentUser, contacts, campaigns, schedules, organisations } = useAppContext();

  const isAdmin = currentUser?.role === "admin";
  const scopedContacts = isAdmin
    ? contacts
    : contacts.filter((contact) => contact.userId === currentUser?.id);
  const scopedCampaigns = isAdmin
    ? campaigns
    : campaigns.filter((campaign) => campaign.userId === currentUser?.id);
  const scopedSchedules = isAdmin
    ? schedules
    : schedules.filter((schedule) => schedule.userId === currentUser?.id);
  const currentOrganisation = organisations.find(
    (organisation) => organisation.id === currentUser?.organisationId
  );

  const bars = [
    scopedContacts.length * 30 + 60,
    scopedCampaigns.length * 45 + 70,
    scopedSchedules.length * 40 + 80,
    scopedCampaigns.length * 35 + scopedSchedules.length * 20 + 75,
    scopedContacts.length * 15 + scopedSchedules.length * 25 + 85,
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>{isAdmin ? "Admin Dashboard" : "Dashboard"}</h1>
          <p>
            {isAdmin
              ? "Monitor overall platform activity across all users and organizations."
              : `Track your campaigns, contacts, and schedule${currentOrganisation ? ` for ${currentOrganisation.name}` : ""}.`}
          </p>
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <p>Active Campaigns</p>
          <h2>{scopedCampaigns.length}</h2>
          <span className="green">
            {isAdmin ? "Across all users" : "Owned by your account"}
          </span>
        </div>

        <div className="card">
          <p>Total Contacts</p>
          <h2>{scopedContacts.length}</h2>
          <span className="green">
            {isAdmin ? "Platform contact count" : "Visible to your login"}
          </span>
        </div>

        <div className="card">
          <p>Scheduled Campaigns</p>
          <h2>{scopedSchedules.length}</h2>
          <span className="green">
            {isAdmin ? "All upcoming campaigns" : "Your upcoming jobs"}
          </span>
        </div>

        <div className="card">
          <p>Organization</p>
          <h2>{isAdmin ? organisations.length : currentOrganisation?.code || "-"}</h2>
          <span className="green">
            {isAdmin ? "Managed organisations" : currentOrganisation?.name || "No organisation linked"}
          </span>
        </div>
      </div>

        <div className="chart-box">
          <div className="chart-header">
            <div>
              <h3>Weekly Message Volume</h3>
              <p>Based on visible contacts, campaigns, and scheduled jobs</p>
            </div>
            <div className="legend">
              <span className="dot whatsapp-dot"></span> WhatsApp
              <span className="dot email-dot"></span> Email
              <span className="dot sms-dot"></span> SMS
            </div>
          </div>

          <div className="chart-svg-container">
            <svg viewBox="0 0 500 200" className="area-chart" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-whatsapp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grad-email" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="grad-sms" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              {[0, 50, 100, 150].map(y => (
                <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}

              {/* WhatsApp Area */}
              <path d="M0,200 L0,120 Q125,40 250,90 T500,100 L500,200 Z" fill="url(#grad-whatsapp)" className="chart-path" />
              <path d="M0,120 Q125,40 250,90 T500,100" fill="none" stroke="#3b82f6" strokeWidth="3" className="chart-line" />

              {/* Email Area */}
              <path d="M0,200 L0,150 Q125,80 250,130 T500,140 L500,200 Z" fill="url(#grad-email)" className="chart-path" />
              <path d="M0,150 Q125,80 250,130 T500,140" fill="none" stroke="#8b5cf6" strokeWidth="3" className="chart-line" />

              {/* SMS Area */}
              <path d="M0,200 L0,180 Q125,120 250,160 T500,170 L500,200 Z" fill="url(#grad-sms)" className="chart-path" />
              <path d="M0,180 Q125,120 250,160 T500,170" fill="none" stroke="#10b981" strokeWidth="3" className="chart-line" />

              {/* Data Points */}
              <circle cx="125" cy="40" r="4" fill="#3b82f6" className="chart-dot" />
              <circle cx="250" cy="90" r="4" fill="#3b82f6" className="chart-dot" />
              <circle cx="375" cy="100" r="4" fill="#3b82f6" className="chart-dot" />
            </svg>
          </div>
        </div>

        <div className="chart-box">
          <div className="chart-header">
            <div>
              <h3>Monthly Engagement</h3>
              <p>Interaction levels across different platforms over time</p>
            </div>
            <div className="legend">
              <span className="dot whatsapp-dot"></span> WhatsApp
              <span className="dot email-dot"></span> Email
              <span className="dot sms-dot"></span> SMS
            </div>
          </div>

          <div className="chart-svg-container">
            <svg viewBox="0 0 500 200" className="area-chart" preserveAspectRatio="none">
               {/* Reusing gradients from above if they are in the same page, or defining new ones */}
              <path d="M0,200 L0,100 Q100,150 200,80 T400,120 T500,90 L500,200 Z" fill="url(#grad-whatsapp)" className="chart-path" />
              <path d="M0,100 Q100,150 200,80 T400,120 T500,90" fill="none" stroke="#3b82f6" strokeWidth="3" className="chart-line" />
              
              <path d="M0,200 L0,140 Q100,110 200,140 T400,90 T500,110 L500,200 Z" fill="url(#grad-email)" className="chart-path" />
              <path d="M0,140 Q100,110 200,140 T400,90 T500,110" fill="none" stroke="#8b5cf6" strokeWidth="3" className="chart-line" />
            </svg>
          </div>
        </div>

        <div className="chart-box">
          <div className="chart-header">
            <div>
              <h3>Daily Activity</h3>
              <p>Performance breakdown for the last 7 days</p>
            </div>
            <div className="legend">
              <span className="dot whatsapp-dot"></span> Active
              <span className="dot email-dot"></span> Peak
              <span className="dot sms-dot"></span> Normal
            </div>
          </div>

          <div className="css-bar-chart-container">
            <div className="css-bar-chart">
              {[
                { label: "Mon", h: (bars[0] % 80) + 20, type: "active" },
                { label: "Tue", h: (bars[1] % 80) + 20, type: "peak" },
                { label: "Wed", h: (bars[2] % 80) + 20, type: "normal" },
                { label: "Thu", h: (bars[3] % 80) + 20, type: "active" },
                { label: "Fri", h: (bars[4] % 80) + 20, type: "peak" },
                { label: "Sat", h: ((bars[0] + bars[2]) % 80) + 20, type: "normal" },
                { label: "Sun", h: ((bars[1] + bars[3]) % 80) + 20, type: "active" }
              ].map((bar, i) => (
                <div key={i} className="css-bar-group">
                  <div className="css-bar-wrapper">
                    <div 
                      className={`css-bar ${bar.type}`} 
                      style={{ height: `${bar.h}%`, animationDelay: `${i * 0.1}s` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="css-bar-labels">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <span key={i} className="css-bar-label">{day}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    
    
  );
}

export default Dashboard;
