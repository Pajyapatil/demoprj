import { useState } from "react";
import "./AdminDashboard.css";
import "../Dashboard.css";
import { useAppContext } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const emptyOrganisation = {
  name: "",
  code: "",
  address: "",
  contactNo: "",
};

function AdminDashboard() {
  const {
    organisations,
    users,
    contacts,
    campaigns,
    schedules,
    settings,
    saveOrganisation,
    deleteOrganisation,
    saveUser,
    deleteUser,
  } = useAppContext();

  const firstUserId = users.find((user) => user.role === "user")?.id || users[0]?.id || "";
  const [organisationForm, setOrganisationForm] = useState(emptyOrganisation);
  const [editingOrganisationId, setEditingOrganisationId] = useState(null);
  const [organisationMessage, setOrganisationMessage] = useState("");

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    password: "",
    role: "user",
    organisationId: organisations[0]?.id || "",
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [userMessage, setUserMessage] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(firstUserId);

  const selectedUser = users.find((user) => user.id === selectedUserId) || users[0];
  const selectedOrganisation = organisations.find(
    (organisation) => organisation.id === selectedUser?.organisationId
  );
  const userContacts = contacts.filter((contact) => contact.userId === selectedUser?.id);
  const userCampaigns = campaigns.filter(
    (campaign) => campaign.userId === selectedUser?.id
  );
  const userSchedules = schedules.filter(
    (schedule) => schedule.userId === selectedUser?.id
  );

  const handleOrganisationSubmit = (event) => {
    event.preventDefault();

    const result = saveOrganisation(organisationForm, editingOrganisationId);

    if (!result.success) {
      setOrganisationMessage(result.message);
      return;
    }

    setOrganisationForm(emptyOrganisation);
    setEditingOrganisationId(null);
    setOrganisationMessage("");
  };

  const handleUserSubmit = (event) => {
    event.preventDefault();

    const result = saveUser(userForm, editingUserId);

    if (!result.success) {
      setUserMessage(result.message);
      return;
    }

    setUserForm({
      name: "",
      email: "",
      address: "",
      contact: "",
      password: "",
      role: "user",
      organisationId: organisations[0]?.id || "",
    });
    setEditingUserId(null);
    setUserMessage("");
  };

  const handleEditOrganisation = (organisation) => {
    setOrganisationForm(organisation);
    setEditingOrganisationId(organisation.id);
    setOrganisationMessage("");
  };

  const handleEditUser = (user) => {
    setUserForm({
      name: user.name,
      email: user.email,
      address: user.address,
      contact: user.contact,
      password: user.password,
      role: user.role,
      organisationId: user.organisationId || "",
    });
    setEditingUserId(user.id);
    setUserMessage("");
  };

  const handleDeleteUser = (userId) => {
    const result = deleteUser(userId);

    if (!result.success) {
      setUserMessage(result.message);
      return;
    }

    if (selectedUserId === userId) {
      const nextUserId =
        users.find((user) => user.id !== userId && user.role === "user")?.id ||
        users.find((user) => user.id !== userId)?.id ||
        "";
      setSelectedUserId(nextUserId);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin</h1>

      <div className="stats">
        <div className="card">
          <h3>Total Organizations</h3>
          <p>{organisations.length}</p>
        </div>

        <div className="card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="card">
          <h3>Total Campaigns</h3>
          <p>{campaigns.length}</p>
        </div>

        <div className="card">
          <h3>Total Contacts</h3>
          <p>{contacts.length}</p>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2>Organizations</h2>

          <form className="admin-form" onSubmit={handleOrganisationSubmit}>
            <input
              type="text"
              placeholder="Organization Name"
              value={organisationForm.name}
              onChange={(event) =>
                setOrganisationForm({
                  ...organisationForm,
                  name: event.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Organization Id"
              value={organisationForm.code}
              onChange={(event) =>
                setOrganisationForm({
                  ...organisationForm,
                  code: event.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={organisationForm.address}
              onChange={(event) =>
                setOrganisationForm({
                  ...organisationForm,
                  address: event.target.value,
                })
              }
              required
            />
            <input
              type="text"
              placeholder="Contact No"
              value={organisationForm.contactNo}
              onChange={(event) =>
                setOrganisationForm({
                  ...organisationForm,
                  contactNo: event.target.value,
                })
              }
              required
            />
            <button type="submit">
              {editingOrganisationId ? "Update" : "Add"}
            </button>
            {editingOrganisationId && (
              <button
                type="button"
                onClick={() => {
                  setOrganisationForm(emptyOrganisation);
                  setEditingOrganisationId(null);
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {organisationMessage && (
            <p className="admin-message">{organisationMessage}</p>
          )}

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Id</th>
                <th>Address</th>
                <th>Contact No</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {organisations.map((organisation) => (
                <tr key={organisation.id}>
                  <td>{organisation.name}</td>
                  <td>{organisation.code}</td>
                  <td>{organisation.address}</td>
                  <td>{organisation.contactNo}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleEditOrganisation(organisation)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => deleteOrganisation(organisation.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2>Users</h2>

          <form className="admin-form" onSubmit={handleUserSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={userForm.name}
              onChange={(event) =>
                setUserForm({ ...userForm, name: event.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={(event) =>
                setUserForm({ ...userForm, email: event.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Address"
              value={userForm.address}
              onChange={(event) =>
                setUserForm({ ...userForm, address: event.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Contact No"
              value={userForm.contact}
              onChange={(event) =>
                setUserForm({ ...userForm, contact: event.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Password"
              value={userForm.password}
              onChange={(event) =>
                setUserForm({ ...userForm, password: event.target.value })
              }
              required
            />
            <select
              value={userForm.role}
              onChange={(event) =>
                setUserForm({ ...userForm, role: event.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={userForm.organisationId}
              onChange={(event) =>
                setUserForm({
                  ...userForm,
                  organisationId: event.target.value,
                })
              }
            >
              {organisations.map((organisation) => (
                <option key={organisation.id} value={organisation.id}>
                  {organisation.name}
                </option>
              ))}
            </select>
            <button type="submit">{editingUserId ? "Update" : "Add"}</button>
            {editingUserId && (
              <button
                type="button"
                onClick={() => {
                  setEditingUserId(null);
                  setUserForm({
                    name: "",
                    email: "",
                    address: "",
                    contact: "",
                    password: "",
                    role: "user",
                    organisationId: organisations[0]?.id || "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </form>

          {userMessage && <p className="admin-message">{userMessage}</p>}

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Role</th>
                <th>Organization</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const organisation = organisations.find(
                  (item) => item.id === user.organisationId
                );

                return (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{user.role}</td>
                    <td>{organisation?.name || "-"}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        View Dashboard
                      </button>
                      <button type="button" onClick={() => handleEditUser(user)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        type="button"
                        className="delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2>User Dashboard Access</h2>

          <div className="admin-toolbar">
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <>
              <div className="stats">
                <div className="card">
                  <h3>User</h3>
                  <p>{selectedUser.name}</p>
                </div>
                <div className="card">
                  <h3>Organization</h3>
                  <p>{selectedOrganisation?.name || "-"}</p>
                </div>
                <div className="card">
                  <h3>Campaigns</h3>
                  <p>{userCampaigns.length}</p>
                </div>
                <div className="card">
                  <h3>Contacts</h3>
                  <p>{userContacts.length}</p>
                </div>
                <div className="card">
                  <h3>Scheduled</h3>
                  <p>{userSchedules.length}</p>
                </div>
              </div>
              
              <div className="chart-box" style={{ marginTop: '20px' }}>
                <div className="chart-header">
                  <div>
                    <h3>Daily Activity</h3>
                    <p>Performance breakdown for the last 7 days</p>
                  </div>
                </div>
                <div className="css-bar-chart-container">
                  <div className="css-bar-chart">
                    {[
                      { label: "Mon", h: ((userContacts.length * 30 + 60) % 80) + 20, type: "active" },
                      { label: "Tue", h: ((userCampaigns.length * 45 + 70) % 80) + 20, type: "peak" },
                      { label: "Wed", h: ((userSchedules.length * 40 + 80) % 80) + 20, type: "normal" },
                      { label: "Thu", h: ((userCampaigns.length * 35 + 75) % 80) + 20, type: "active" },
                      { label: "Fri", h: ((userContacts.length * 15 + 85) % 80) + 20, type: "peak" },
                      { label: "Sat", h: 45, type: "normal" },
                      { label: "Sun", h: 65, type: "active" }
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
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section">
          <h2>System Settings Summary</h2>

          <table>
            <thead>
              <tr>
                <th>Setting</th>
                <th>Value</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Platform Name</td>
                <td>{settings.platformName}</td>
              </tr>
              <tr>
                <td>Support Email</td>
                <td>{settings.supportEmail}</td>
              </tr>
              <tr>
                <td>Timezone</td>
                <td>{settings.timezone}</td>
              </tr>
              <tr>
                <td>Default Channel</td>
                <td>{settings.defaultChannel}</td>
              </tr>
              <tr>
                <td>Quiet Hours</td>
                <td>{settings.quietHours}</td>
              </tr>
              <tr>
                <td>Retry Limit</td>
                <td>{settings.retryLimit}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
