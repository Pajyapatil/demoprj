import "./Reports.css";
import { useAppContext } from "../context/AppContext";

function Reports() {
  const { currentUser, contacts, campaigns, schedules } = useAppContext();
  const isAdmin = currentUser?.role === "admin";

  const visibleContacts = contacts.filter(
    (contact) => isAdmin || contact.userId === currentUser?.id
  );
  const visibleCampaigns = campaigns.filter(
    (campaign) => isAdmin || campaign.userId === currentUser?.id
  );
  const visibleSchedules = schedules.filter(
    (schedule) => isAdmin || schedule.userId === currentUser?.id
  );

  const delivered = visibleCampaigns.length * 120 + visibleSchedules.length * 80;
  const engaged = visibleContacts.length * 25 + visibleCampaigns.length * 40;
  const failed = Math.max(visibleSchedules.length * 4, 0);

  return (
    <div className="reports">
      <h1>Reports</h1>

      <div className="stats">
        <div className="box">
          <h3>Delivered</h3>
          <p>{delivered}</p>
        </div>

        <div className="box">
          <h3>Read / Clicked</h3>
          <p>{engaged}</p>
        </div>

        <div className="box">
          <h3>Failed</h3>
          <p>{failed}</p>
        </div>
      </div>

      <div className="graphs">
        <div className="graph-box">
          Contacts visible: {visibleContacts.length}
        </div>
        <div className="graph-box">
          Campaigns visible: {visibleCampaigns.length}
        </div>
        <div className="graph-box">
          Scheduled jobs visible: {visibleSchedules.length}
        </div>
      </div>
    </div>
  );
}

export default Reports;
