import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSlidersH, faGlobe, faEnvelope, 
  faClock, faBell, faMoon, faSyncAlt, faSave,
  faUserShield, faCode, faKey, faEye, faEyeSlash,
  faUsers, faPlus, faTrash, faDatabase, faDownload,
  faCheck, faCopy, faLock
} from "@fortawesome/free-solid-svg-icons";
import "./Settings.css";
import { useAppContext } from "../context/AppContext";

function Settings() {
  const { settings, updateSettings } = useAppContext();
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saved, setSaved] = useState("");

  const [form, setForm] = useState({
    platformName: settings?.platformName || "BizNotify Platform",
    supportEmail: settings?.supportEmail || "support@biznotify.com",
    timezone: settings?.timezone || "UTC",
    defaultChannel: settings?.defaultChannel || "WhatsApp",
    quietHours: settings?.quietHours || "22:00 - 08:00",
    retryLimit: settings?.retryLimit || "3",
    emailAlerts: settings?.emailAlerts ?? true,
    smsAlerts: settings?.smsAlerts ?? false,
    soundAlerts: settings?.soundAlerts ?? true,
    twilioSid: settings?.twilioSid || "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    twilioToken: settings?.twilioToken || "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    webhookUrl: settings?.webhookUrl || "https://api.biznotify.com/v1/webhook",
    whatsappNumber: settings?.whatsappNumber || "+1 (555) 234-5678",
    apiKey: settings?.apiKey || "bn_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
  });

  // Team simulation state
  const [teamList, setTeamList] = useState([
    { id: 1, name: "Prajwal Patel", email: "prajwal@biznotify.com", role: "Owner" },
    { id: 2, name: "Aditi Patait", email: "aditi@biznotify.com", role: "Admin" },
    { id: 3, name: "Support Agent", email: "agent@biznotify.com", role: "Member" }
  ]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Member");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
    setSaved("");
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved("Settings saved successfully.");
    setTimeout(() => setSaved(""), 3000);
  };

  const handleRegenerateKey = () => {
    const randomHex = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    setForm({ ...form, apiKey: `bn_live_${randomHex}` });
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(form.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole
    };
    setTeamList([...teamList, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
  };

  const handleRemoveMember = (id) => {
    const member = teamList.find(m => m.id === id);
    if (member?.role === "Owner") return; // Keep owner
    setTeamList(teamList.filter(m => m.id !== id));
  };

  const getAvatarBg = (name) => {
    const colors = [
      "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
      "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const renderGeneralTab = () => (
    <div className="settings-tab-pane">
      <h3><FontAwesomeIcon icon={faGlobe} className="section-icon" /> General Configuration</h3>
      <p className="tab-description">Configure your business workspace coordinates and standard details.</p>
      
      <div className="settings-grid">
        <div className="setting-group">
          <label>Platform Display Name</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faGlobe} className="input-icon" />
            <input
              type="text"
              name="platformName"
              placeholder="e.g. BizNotify Corp"
              value={form.platformName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="setting-group">
          <label>Support Email Address</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              name="supportEmail"
              placeholder="support@example.com"
              value={form.supportEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="setting-group">
          <label>System Timezone</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faClock} className="input-icon" />
            <select name="timezone" value={form.timezone} onChange={handleChange}>
              <option value="UTC">UTC (Universal Coordinated Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
              <option value="IST">IST (Indian Standard Time)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="settings-tab-pane">
      <h3><FontAwesomeIcon icon={faBell} className="section-icon" /> Campaigns & Alerts</h3>
      <p className="tab-description">Configure rules for automated campaigns and platform alerts.</p>
      
      <div className="settings-grid">
        <div className="setting-group">
          <label>Default Channels</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faBell} className="input-icon" />
            <select name="defaultChannel" value={form.defaultChannel} onChange={handleChange}>
              <option value="WhatsApp">WhatsApp</option>
              <option value="SMS">SMS</option>
              <option value="Email">Email</option>
              <option value="All">All Channels</option>
            </select>
          </div>
        </div>

        <div className="setting-group">
          <label>Quiet Hours (Campaign Silence)</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faMoon} className="input-icon" />
            <input
              type="text"
              name="quietHours"
              placeholder="e.g. 22:00 - 08:00"
              value={form.quietHours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="setting-group">
          <label>Delivery Retry Limit</label>
          <div className="input-with-icon">
            <FontAwesomeIcon icon={faSyncAlt} className="input-icon" />
            <input
              type="number"
              name="retryLimit"
              placeholder="e.g. 3"
              min="0"
              max="10"
              value={form.retryLimit}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="toggle-settings-section">
        <h4>System Alerts & Notifications</h4>
        <div className="toggle-group">
          <div className="toggle-row">
            <div className="toggle-label-group">
              <span className="toggle-title">Email Alerts</span>
              <span className="toggle-subtitle">Receive weekly campaign analytics summaries in your inbox</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                name="emailAlerts" 
                checked={form.emailAlerts} 
                onChange={handleChange} 
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-label-group">
              <span className="toggle-title">SMS Failure Alerts</span>
              <span className="toggle-subtitle">Send warning SMS if critical campaigns fail delivery</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                name="smsAlerts" 
                checked={form.smsAlerts} 
                onChange={handleChange} 
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div className="toggle-label-group">
              <span className="toggle-title">Sound Effects</span>
              <span className="toggle-subtitle">Play alarms on dashboard updates and message arrivals</span>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                name="soundAlerts" 
                checked={form.soundAlerts} 
                onChange={handleChange} 
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApiTab = () => (
    <div className="settings-tab-pane">
      <h3><FontAwesomeIcon icon={faCode} className="section-icon" /> Developer API & Gateways</h3>
      <p className="tab-description">Manage API credentials and connect gateways for automated messaging.</p>

      <div className="api-key-container">
        <div className="api-key-header">
          <label><FontAwesomeIcon icon={faKey} /> API Secret Key</label>
          <span className="api-badge">Live Credentials</span>
        </div>
        <div className="api-key-field">
          <input 
            type={showApiKey ? "text" : "password"} 
            value={form.apiKey} 
            readOnly 
            className="api-input"
          />
          <button 
            type="button" 
            className="api-btn icon-only" 
            onClick={() => setShowApiKey(!showApiKey)}
            title={showApiKey ? "Hide Key" : "Show Key"}
          >
            <FontAwesomeIcon icon={showApiKey ? faEyeSlash : faEye} />
          </button>
          <button 
            type="button" 
            className="api-btn icon-only" 
            onClick={handleCopyKey}
            title="Copy API Key"
          >
            <FontAwesomeIcon icon={copiedKey ? faCheck : faCopy} />
          </button>
          <button 
            type="button" 
            className="api-btn-text" 
            onClick={handleRegenerateKey}
          >
            Regenerate
          </button>
        </div>
        <span className="api-helper-text">Keep this key secure. Sharing it can grant full admin permissions to your workspace.</span>
      </div>

      <div className="divider-line"></div>

      <h4>Messaging Gateways Settings</h4>
      <div className="settings-grid">
        <div className="setting-group">
          <label>Twilio Account SID</label>
          <input
            type="text"
            name="twilioSid"
            placeholder="AC..."
            value={form.twilioSid}
            onChange={handleChange}
          />
        </div>

        <div className="setting-group">
          <label>Twilio Auth Token</label>
          <input
            type="password"
            name="twilioToken"
            placeholder="••••••••••••••••••••••••••••••••"
            value={form.twilioToken}
            onChange={handleChange}
          />
        </div>

        <div className="setting-group">
          <label>WhatsApp Business Number</label>
          <input
            type="text"
            name="whatsappNumber"
            placeholder="+1 (555) 000-0000"
            value={form.whatsappNumber}
            onChange={handleChange}
          />
        </div>

        <div className="setting-group">
          <label>Global Webhook Endpoint</label>
          <input
            type="url"
            name="webhookUrl"
            placeholder="https://yourdomain.com/webhook"
            value={form.webhookUrl}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-tab-pane">
      <h3><FontAwesomeIcon icon={faUserShield} className="section-icon" /> Security & Team Workspace</h3>
      <p className="tab-description">Control platform access permissions and workspace team roles.</p>

      <div className="security-toggles">
        <div className="toggle-row card-style">
          <div className="toggle-label-group">
            <span className="toggle-title"><FontAwesomeIcon icon={faLock} /> Two-Factor Authentication (2FA)</span>
            <span className="toggle-subtitle">Enforce mobile verification code checks at system log-in.</span>
          </div>
          <span className="badge-alert-info">Recommended</span>
        </div>
      </div>

      <div className="divider-line"></div>

      <h4>Teammates Directory</h4>
      <div className="team-section">
        <form className="add-team-form" onSubmit={handleAddMember}>
          <input 
            type="text" 
            placeholder="Name" 
            value={newMemberName} 
            onChange={(e) => setNewMemberName(e.target.value)}
            required
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={newMemberEmail} 
            onChange={(e) => setNewMemberEmail(e.target.value)}
            required
          />
          <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)}>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
          <button type="submit" className="add-member-btn">
            <FontAwesomeIcon icon={faPlus} /> Invite Member
          </button>
        </form>

        <div className="team-grid">
          {teamList.map((member) => (
            <div key={member.id} className="team-card">
              <div className="team-card-header">
                <div 
                  className="team-card-avatar"
                  style={{ background: getAvatarBg(member.name) }}
                >
                  {member.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </div>
                <div className="team-card-info">
                  <h4>{member.name}</h4>
                  <p>{member.email}</p>
                </div>
              </div>
              <div className="team-card-footer">
                <span className={`role-badge ${member.role.toLowerCase()}`}>{member.role}</span>
                {member.role !== "Owner" && (
                  <button 
                    className="remove-member-btn-card" 
                    onClick={() => handleRemoveMember(member.id)}
                    title="Revoke access"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBackupTab = () => (
    <div className="settings-tab-pane">
      <h3><FontAwesomeIcon icon={faDatabase} className="section-icon" /> Data Management & Backups</h3>
      <p className="tab-description">Manage system export files, database integrity, and settings cache.</p>

      <div className="data-management-grid">
        <div className="data-card">
          <h4>Export Settings Configuration</h4>
          <p>Export a snapshot of all campaign parameters, contacts, and configs to a JSON backup file.</p>
          <button className="secondary-btn-outline" onClick={() => alert("Downloading configuration snapshot...")}>
            <FontAwesomeIcon icon={faDownload} /> Download backup.json
          </button>
        </div>

        <div className="data-card">
          <h4>Database Cache Sync</h4>
          <p>Synchronize cached campaign queues and logs with the central database server.</p>
          <button className="secondary-btn-outline" onClick={() => alert("Central server sync initiated...")}>
            <FontAwesomeIcon icon={faSyncAlt} /> Sync Cache Data
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="settings-page">
      <div className="settings-header glass-panel">
        <h2 className="section-title">
          <FontAwesomeIcon icon={faSlidersH} className="heading-icon" /> 
          Platform Settings
        </h2>
        <p className="subtitle">Manage system preferences, developer API gateways, and teammate roles.</p>
      </div>

      <div className="settings-container">
        {/* Sidebar Nav */}
        <div className="settings-sidebar glass-panel">
          <button 
            className={`sidebar-tab-btn ${activeTab === "general" ? "active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <FontAwesomeIcon icon={faGlobe} className="tab-icon" /> Workspace Details
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <FontAwesomeIcon icon={faBell} className="tab-icon" /> Campaigns & Alerts
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === "api" ? "active" : ""}`}
            onClick={() => setActiveTab("api")}
          >
            <FontAwesomeIcon icon={faCode} className="tab-icon" /> API & Integrations
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <FontAwesomeIcon icon={faUserShield} className="tab-icon" /> Teammates & Access
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === "backup" ? "active" : ""}`}
            onClick={() => setActiveTab("backup")}
          >
            <FontAwesomeIcon icon={faDatabase} className="tab-icon" /> Data Management
          </button>
        </div>

        {/* Content Pane */}
        <div className="settings-main-content glass-panel">
          {activeTab === "general" && renderGeneralTab()}
          {activeTab === "notifications" && renderNotificationsTab()}
          {activeTab === "api" && renderApiTab()}
          {activeTab === "security" && renderSecurityTab()}
          {activeTab === "backup" && renderBackupTab()}

          <div className="settings-actions">
            {saved && <p className="setting-message success-message bounce-in">{saved}</p>}
            <button className="save-btn primary-btn" onClick={handleSave}>
              <FontAwesomeIcon icon={faSave} /> Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
