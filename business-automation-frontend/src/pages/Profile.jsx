import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import PageTopbar from "../components/PageTopbar";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const { currentUser, organisations, saveUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  
  const [editForm, setEditForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: currentUser?.password || "",
    contact: currentUser?.contact || "",
    address: currentUser?.address || "",
  });

  const userOrg = organisations.find(org => org.id === currentUser?.organisationId);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ...currentUser,
      name: editForm.name,
      email: editForm.email,
      password: editForm.password,
      contact: editForm.contact,
      address: editForm.address,
    };
    
    const result = saveUser(payload, currentUser.id);
    if (!result.success) {
      setMessage(result.message);
    } else {
      setMessage("Profile updated successfully.");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
    setEditForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      password: currentUser?.password || "",
      contact: currentUser?.contact || "",
      address: currentUser?.address || "",
    });
  };

  return (
    <div className="page-container">
      <PageTopbar 
        title="User Profile" 
        subtitle="View and manage your account details" 
      />
      
      <div className="profile-content animated-fade-in">
        <div className="card glass-card profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>
            <h2>{currentUser?.name}</h2>
            <p className="role-badge">{currentUser?.role === 'admin' ? 'Administrator' : 'Standard User'}</p>
          </div>

          <div className="profile-details">
            <div className="profile-details-header">
              <h3>Account Details</h3>
              {!isEditing && (
                <button className="icon-button" onClick={() => setIsEditing(true)} title="Edit Profile">
                  <FontAwesomeIcon icon={faPenToSquare} />
                </button>
              )}
            </div>
            
            {message && <div className={`profile-message ${isEditing ? 'error' : 'success'}`}>{message}</div>}
            
            {isEditing ? (
              <form className="profile-edit-form" onSubmit={handleSave}>
                <div className="detail-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={editForm.email} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={editForm.password} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input type="text" name="contact" value={editForm.contact} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Address</label>
                    <input type="text" name="address" value={editForm.address} onChange={handleEditChange} required />
                  </div>
                  <div className="form-group">
                    <label>Organization (Read Only)</label>
                    <input type="text" value={userOrg?.name || "None"} disabled />
                  </div>
                </div>
                
                <div className="profile-form-actions">
                  <button type="button" className="btn-secondary" onClick={handleCancel}>
                    <FontAwesomeIcon icon={faXmark} /> Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <FontAwesomeIcon icon={faCheck} /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Email Address</label>
                  <p>{currentUser?.email}</p>
                </div>
                
                <div className="detail-item">
                  <label>Password</label>
                  <p>
                    <span className="masked-password">••••••••</span>
                  </p>
                </div>
                
                <div className="detail-item">
                  <label>Contact Number</label>
                  <p>{currentUser?.contact || "Not provided"}</p>
                </div>

                <div className="detail-item">
                  <label>Address</label>
                  <p>{currentUser?.address || "Not provided"}</p>
                </div>

                <div className="detail-item">
                  <label>Organization</label>
                  <p>{userOrg?.name || "None"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
