import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarPlus, faClock, faPaperPlane, faEdit, faTrash, faListUl,
  faBullseye, faFolderOpen, faUserGroup, faBolt, faFileInvoiceDollar,
  faMessage
} from "@fortawesome/free-solid-svg-icons";
import "./Schedule.css";
import { useAppContext } from "../context/AppContext";

export default function Schedule() {
  const { currentUser, users, schedules, saveSchedule, deleteSchedule, contacts } = useAppContext();
  const isAdmin = currentUser?.role === "admin";
  const defaultUserId = isAdmin ? users[0]?.id || "" : currentUser?.id || "";

  // Segment Configurations
  const segments = [
    { id: "all", name: "All Synchronized Contacts" },
    { id: "leads", name: "Leads & Prospects List" },
    { id: "vip", name: "VIP Premium Customers" },
    { id: "inactive", name: "Inactive / Winback Group" }
  ];

  // Presets templates database
  const templates = [
    { id: "custom", name: "Custom Message Template", text: "" },
    { id: "welcome", name: "🎉 Welcome Onboarding Greetings", text: "Welcome to BizNotify! We are excited to support your client onboarding workflows. Feel free to contact our customer success team if you have any questions." },
    { id: "promo", name: "🔥 Black Friday 15% Promotion Discount", text: "Exclusive Offer! Use coupon code BIZ15 at checkout to receive 15% off all automated platform plans. Act fast before it expires." },
    { id: "reminder", name: "⏰ Scheduled Appointment Reminder", text: "Friendly reminder: Your scheduled business appointment is set for tomorrow. Please reply to this message to confirm your attendance." }
  ];

  const [campaign, setCampaign] = useState({
    userId: defaultUserId,
    title: "",
    message: "",
    date: "",
    time: "",
    channel: "WhatsApp",
    targetSegment: "all",
    templateId: "custom"
  });

  const [editingId, setEditingId] = useState(null);

  const scheduledList = schedules.filter(
    (schedule) => isAdmin || schedule.userId === currentUser?.id
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    if (name === "templateId") {
      const selectedTpl = templates.find(t => t.id === value);
      setCampaign(prev => ({
        ...prev,
        templateId: value,
        message: selectedTpl && value !== "custom" ? selectedTpl.text : prev.message
      }));
    } else {
      setCampaign(prev => ({ ...prev, [name]: value }));
    }
  };

  const getSegmentCount = (segId) => {
    const totalCount = contacts.filter(c => isAdmin || c.userId === currentUser?.id).length || 24;
    if (segId === "all") return totalCount;
    if (segId === "leads") return Math.max(1, Math.ceil(totalCount * 0.42));
    if (segId === "vip") return Math.max(1, Math.ceil(totalCount * 0.21));
    if (segId === "inactive") return Math.max(1, Math.ceil(totalCount * 0.17));
    return totalCount;
  };

  const getChannelCost = (channel) => {
    if (channel === "WhatsApp") return 0.015;
    if (channel === "SMS") return 0.045;
    if (channel === "Email") return 0.003;
    return 0.055; // All channels rate
  };

  const currentSegmentCount = getSegmentCount(campaign.targetSegment);
  const currentCostRate = getChannelCost(campaign.channel);
  const estimatedTotalCost = (currentSegmentCount * currentCostRate).toFixed(2);

  const resetForm = () => {
    setCampaign({
      userId: defaultUserId,
      title: "",
      message: "",
      date: "",
      time: "",
      channel: "WhatsApp",
      targetSegment: "all",
      templateId: "custom"
    });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    saveSchedule(
      {
        ...campaign,
        userId: isAdmin ? campaign.userId : currentUser.id,
        targetSegment: campaign.targetSegment,
        estimatedCost: estimatedTotalCost,
        targetReach: currentSegmentCount
      },
      editingId
    );

    resetForm();
  };

  const handleEdit = (schedule) => {
    setCampaign({
      userId: schedule.userId || defaultUserId,
      title: schedule.title || "",
      message: schedule.message || "",
      date: schedule.date || "",
      time: schedule.time || "",
      channel: schedule.channel || "WhatsApp",
      targetSegment: schedule.targetSegment || "all",
      templateId: schedule.templateId || "custom"
    });
    setEditingId(schedule.id);
  };

  return (
    <div className="schedule-page">
      <div className="schedule-top-grid">
        {/* Scheduler Form */}
        <div className="schedule-card glass-panel">
          <h2 className="section-title">
            <FontAwesomeIcon icon={faCalendarPlus} className="heading-icon" /> 
            Campaign Planner
          </h2>
          <p className="tab-description">Schedule multi-channel marketing campaigns or automated utility messages.</p>

          <form onSubmit={handleSubmit} className="schedule-form-container">
            {isAdmin && (
              <div className="form-row-group">
                <label>Manage Client Account</label>
                <select
                  name="userId"
                  value={campaign.userId}
                  onChange={handleChange}
                  required
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-row-group">
              <label>Campaign Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Q2 Customer Outreach"
                value={campaign.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid-2col">
              <div className="form-row-group">
                <label>Target Audience Segment</label>
                <div className="input-with-icon-static">
                  <FontAwesomeIcon icon={faBullseye} className="input-field-icon" />
                  <select 
                    name="targetSegment" 
                    value={campaign.targetSegment} 
                    onChange={handleChange}
                  >
                    {segments.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row-group">
                <label>Delivery Channel</label>
                <select
                  name="channel"
                  value={campaign.channel}
                  onChange={handleChange}
                >
                  <option>WhatsApp</option>
                  <option>SMS</option>
                  <option>Email</option>
                  <option>All</option>
                </select>
              </div>
            </div>

            <div className="form-row-group">
              <label>Campaign Template Preset</label>
              <div className="input-with-icon-static">
                <FontAwesomeIcon icon={faFolderOpen} className="input-field-icon" />
                <select 
                  name="templateId" 
                  value={campaign.templateId} 
                  onChange={handleChange}
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-group">
              <label>Message Content</label>
              <textarea
                name="message"
                placeholder="Write your campaign details..."
                value={campaign.message}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-grid-2col">
              <div className="form-row-group">
                <label>Schedule Date</label>
                <input
                  type="date"
                  name="date"
                  value={campaign.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row-group">
                <label>Schedule Time</label>
                <input
                  type="time"
                  name="time"
                  value={campaign.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions-row">
              <button type="submit" className="submit-btn-planner primary-btn">
                {editingId ? (
                  <><FontAwesomeIcon icon={faEdit} /> Update Schedule</>
                ) : (
                  <><FontAwesomeIcon icon={faPaperPlane} /> Deploy Schedule</>
                )}
              </button>

              {editingId && (
                <button type="button" className="cancel-btn-planner secondary-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Campaign Cost & Reach Estimator Dashboard */}
        <div className="estimator-sidebar-card glass-panel">
          <h3 className="estimator-title">
            <FontAwesomeIcon icon={faFileInvoiceDollar} /> 
            Campaign Estimate
          </h3>
          <p className="estimator-subtitle">Live projections for target reach and dispatch cost rates.</p>

          <div className="estimator-stats-box">
            <div className="estimator-stat-item">
              <div className="stat-icon-wrapper blue-glow">
                <FontAwesomeIcon icon={faUserGroup} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Projected Reach</span>
                <span className="stat-value">{currentSegmentCount} Recipients</span>
              </div>
            </div>

            <div className="estimator-stat-item">
              <div className="stat-icon-wrapper green-glow">
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Estimated Budget</span>
                <span className="stat-value">${estimatedTotalCost}</span>
              </div>
            </div>

            <div className="estimator-stat-item">
              <div className="stat-icon-wrapper purple-glow">
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Queue Priority</span>
                <span className="stat-value">High (Instant dispatch)</span>
              </div>
            </div>
          </div>

          <div className="live-preview-box">
            <div className="preview-header">
              <FontAwesomeIcon icon={faMessage} /> Channel Mock Preview ({campaign.channel})
            </div>
            <div className="preview-body">
              <strong>{campaign.title || "Untitled Campaign"}</strong>
              <p className="preview-text">
                {campaign.message || "Enter details to preview campaign message template..."}
              </p>
              <div className="preview-time-tag">
                <FontAwesomeIcon icon={faClock} /> Scheduled: {campaign.date || "YYYY-MM-DD"} @ {campaign.time || "HH:MM"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming campaigns lists */}
      <div className="upcoming-section">
        <h2 className="section-title">
          <FontAwesomeIcon icon={faListUl} className="heading-icon" /> 
          Pending Deployments
        </h2>

        {scheduledList.length === 0 ? (
          <div className="empty-state glass-panel">
            <p>No campaigns scheduled yet. Start by defining parameters above!</p>
          </div>
        ) : (
          <div className="campaigns-grid-planner">
            {scheduledList.map((item) => {
              const owner = users.find((user) => user.id === item.userId);
              const segmentName = segments.find(s => s.id === item.targetSegment)?.name || "Target Contacts";
              const costDisplay = item.estimatedCost || (getSegmentCount(item.targetSegment || "all") * getChannelCost(item.channel)).toFixed(2);
              const reachDisplay = item.targetReach || getSegmentCount(item.targetSegment || "all");

              return (
                <div key={item.id} className="campaign-card-planner glass-panel">
                  <div className="campaign-info-planner">
                    <div className="campaign-card-header-planner">
                      <h3>{item.title}</h3>
                      <span className="status-badge pending">Pending</span>
                    </div>

                    <p className="message-snippet" title={item.message}>
                      {item.message.length > 95 ? `${item.message.slice(0, 95)}...` : item.message}
                    </p>

                    <div className="campaign-meta-grid">
                      <div className="meta-badge-item">
                        <span className="meta-label">Channel</span>
                        <span className="badge-tag channel">{item.channel}</span>
                      </div>
                      <div className="meta-badge-item">
                        <span className="meta-label">Audience</span>
                        <span className="badge-tag segment">{segmentName} ({reachDisplay})</span>
                      </div>
                      <div className="meta-badge-item">
                        <span className="meta-label">Budget</span>
                        <span className="badge-tag cost">${costDisplay}</span>
                      </div>
                      <div className="meta-badge-item">
                        <span className="meta-label">Dispatch</span>
                        <span className="badge-tag time">
                          <FontAwesomeIcon icon={faClock} /> {item.date} @ {item.time}
                        </span>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="owner-strip">
                        <span>Workspace: {owner?.name || "-"} ({owner?.role})</span>
                      </div>
                    )}
                  </div>

                  <div className="schedule-actions-planner">
                    <button type="button" className="planner-action-btn edit" onClick={() => handleEdit(item)} title="Modify Configuration">
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      type="button"
                      className="planner-action-btn delete"
                      onClick={() => deleteSchedule(item.id)}
                      title="Cancel Deployment"
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

