import { useState } from "react";
import "./Campaigns.css";
import { useAppContext } from "../context/AppContext";

function Campaigns() {
  const { currentUser, users, campaigns, saveCampaign, deleteCampaign } =
    useAppContext();
  const isAdmin = currentUser?.role === "admin";
  const defaultUserId = isAdmin ? users[0]?.id || "" : currentUser?.id || "";
  const [form, setForm] = useState({
    userId: defaultUserId,
    name: "",
    message: "",
    channel: "WhatsApp",
  });
  const [editingId, setEditingId] = useState(null);

  const visibleCampaigns = campaigns.filter(
    (campaign) => isAdmin || campaign.userId === currentUser?.id
  );

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({
      userId: defaultUserId,
      name: "",
      message: "",
      channel: "WhatsApp",
    });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    saveCampaign(
      {
        ...form,
        userId: isAdmin ? form.userId : currentUser.id,
      },
      editingId
    );

    resetForm();
  };

  const handleEdit = (campaign) => {
    setForm(campaign);
    setEditingId(campaign.id);
  };

  return (
    <div className="campaigns">
      <h1>Campaigns</h1>

      <form onSubmit={handleSubmit} className="campaign-form">
        {isAdmin && (
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        )}

        <input
          name="name"
          placeholder="Campaign Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
        />

        <select name="channel" value={form.channel} onChange={handleChange}>
          <option>WhatsApp</option>
          <option>SMS</option>
          <option>Email</option>
          <option>All</option>
        </select>

        <button type="submit">{editingId ? "Update" : "Create"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Message</th>
            <th>Channel</th>
            {isAdmin && <th>User</th>}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {visibleCampaigns.map((campaign) => {
            const owner = users.find((user) => user.id === campaign.userId);

            return (
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>{campaign.message}</td>
                <td>{campaign.channel}</td>
                {isAdmin && <td>{owner?.name || "-"}</td>}
                <td>
                  <button type="button" onClick={() => handleEdit(campaign)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteCampaign(campaign.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Campaigns;
