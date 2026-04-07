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
<div className="card">
            <div className="legend">
              <span className="dot whatsapp"></span> WhatsApp
              <span className="dot email"></span> Email
              <span className="dot sms"></span> SMS
            </div>
          </div>
        </div>

       
          <div className="chart">
            {bars.map((height, index) => (
              <div key={index} className="bar-group">
                <div className="bar whatsapp" style={{ height }}></div>
                <div className="bar email" style={{ height: Math.max(height - 35, 20) }}></div>
                <div className="bar sms" style={{ height: Math.max(height - 15, 25) }}></div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-box">
          <div className="chart-header">
            <div>
             
              <h3>Monthly Message Volume</h3>
              <p>Based on visible contacts, campaigns, and scheduled jobs</p>
            </div>

            <div className="legend">
              <span className="dot whatsapp"></span> WhatsApp
              <span className="dot email"></span> Email
              <span className="dot sms"></span> SMS
            </div>
          </div>

          <div className="chart">
            {bars.map((height, index) => (
              <div key={index} className="bar-group">
                <div className="bar whatsapp" style={{ height }}></div>
                <div className="bar email" style={{ height: Math.max(height - 35, 20) }}></div>
                <div className="bar sms" style={{ height: Math.max(height - 15, 25) }}></div>
              </div>
            ))}
          </div>
        </div>
        </div>
    
    
  );
}

export default Dashboard;
