import { useState } from "react";
import "./Settings.css";
import { useAppContext } from "../context/AppContext";

function Settings() {
  const { settings, updateSettings } = useAppContext();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setSaved("");
  };

  const handleSave = () => {
    updateSettings(form);
    setSaved("Settings saved successfully.");
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      <h2>System Settings</h2>

      <div className="address-box">
        <input
          type="text"
          name="platformName"
          placeholder="Platform Name"
          value={form.platformName}
          onChange={handleChange}
        />
      </div>

      <div className="address-box">
        <input
          type="text"
          name="supportEmail"
          placeholder="Support Email"
          value={form.supportEmail}
          onChange={handleChange}
        />
      </div>

      <div className="address-box">
        <input
          type="text"
          name="timezone"
          placeholder="Timezone"
          value={form.timezone}
          onChange={handleChange}
        />
      </div>

      <div className="address-box">
        <input
          type="text"
          name="defaultChannel"
          placeholder="Default Channel"
          value={form.defaultChannel}
          onChange={handleChange}
        />
      </div>

      <div className="address-box">
        <input
          type="text"
          name="quietHours"
          placeholder="Quiet Hours"
          value={form.quietHours}
          onChange={handleChange}
        />
      </div>

      <div className="address-box">
        <input
          type="text"
          name="retryLimit"
          placeholder="Retry Limit"
          value={form.retryLimit}
          onChange={handleChange}
        />
      </div>

      {saved && <p className="settings-message">{saved}</p>}

      <button className="save-btn" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default Settings;
