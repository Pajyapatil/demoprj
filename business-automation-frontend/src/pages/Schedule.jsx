import { useState } from "react";
import "./Schedule.css";
import { useAppContext } from "../context/AppContext";

export default function Schedule() {
  const { currentUser, users, schedules, saveSchedule, deleteSchedule } =
    useAppContext();
  const isAdmin = currentUser?.role === "admin";
  const defaultUserId = isAdmin ? users[0]?.id || "" : currentUser?.id || "";
  const [campaign, setCampaign] = useState({
    userId: defaultUserId,
    title: "",
    message: "",
    date: "",
    time: "",
    channel: "WhatsApp",
  });
  const [editingId, setEditingId] = useState(null);

  const scheduledList = schedules.filter(
    (schedule) => isAdmin || schedule.userId === currentUser?.id
  );

  const handleChange = (event) => {
    setCampaign({ ...campaign, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setCampaign({
      userId: defaultUserId,
      title: "",
      message: "",
      date: "",
      time: "",
      channel: "WhatsApp",
    });
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    saveSchedule(
      {
        ...campaign,
        userId: isAdmin ? campaign.userId : currentUser.id,
      },
      editingId
    );

    resetForm();
  };

  const handleEdit = (schedule) => {
    setCampaign(schedule);
    setEditingId(schedule.id);
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card">
        <h1>Schedule Campaign</h1>

        <form onSubmit={handleSubmit} className="schedule-form">
          {isAdmin && (
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
          )}

          <input
            type="text"
            name="title"
            placeholder="Campaign Title"
            value={campaign.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Write your message..."
            value={campaign.message}
            onChange={handleChange}
            required
          />

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

          <div className="row">
            <input
              type="date"
              name="date"
              value={campaign.date}
              onChange={handleChange}
              required
            />

            <input
              type="time"
              name="time"
              value={campaign.time}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            {editingId ? "Update Campaign" : "Schedule Campaign"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="upcoming">
        <h2>Upcoming Campaigns</h2>

        {scheduledList.length === 0 ? (
          <p>No campaigns scheduled yet.</p>
        ) : (
          scheduledList.map((item) => {
            const owner = users.find((user) => user.id === item.userId);

            return (
              <div key={item.id} className="campaign-card">
                <div className="campaign-info">
                  <p><b>{item.title}</b></p>
                  <p>
                    {item.channel} | {item.date} | {item.time}
                  </p>
                  {isAdmin && <p>Owner: {owner?.name || "-"}</p>}
                </div>

                <div className="schedule-actions">
                  <span className="status">Scheduled</span>
                  <button type="button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete"
                    onClick={() => deleteSchedule(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
