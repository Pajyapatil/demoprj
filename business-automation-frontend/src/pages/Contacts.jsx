import { useRef, useState } from "react";
import "./Contacts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useAppContext } from "../context/AppContext";

function Contacts() {
  const { currentUser, users, organisations, contacts, saveContact, deleteContact } =
    useAppContext();
  const isAdmin = currentUser?.role === "admin";
  const assignableUsers = isAdmin ? users : [currentUser];
  const defaultUserId = isAdmin ? users[0]?.id || "" : currentUser?.id || "";
  const [form, setForm] = useState({
    userId: defaultUserId,
    name: "",
    email: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  const visibleContacts = contacts.filter(
    (contact) => isAdmin || contact.userId === currentUser?.id
  );

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({
      userId: defaultUserId,
      name: "",
      email: "",
      phone: "",
    });
    setEditingId(null);
  };

  const handleAdd = (event) => {
    event.preventDefault();

    saveContact(
      {
        ...form,
        userId: isAdmin ? form.userId : currentUser.id,
      },
      editingId
    );

    resetForm();
  };

  const handleEdit = (contact) => {
    setForm(contact);
    setEditingId(contact.id);
  };

  const handleDelete = (contactId) => {
    deleteContact(contactId);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      const text = loadEvent.target?.result || "";
      const rows = text.toString().split("\n").slice(1);

      rows
        .map((row) => {
          const [name, email, phone] = row.split(",");

          return {
            name: name?.trim(),
            email: email?.trim(),
            phone: phone?.trim(),
          };
        })
        .filter((contact) => contact.name && contact.email && contact.phone)
        .forEach((contact) => {
          saveContact({
            ...contact,
            userId: isAdmin ? form.userId : currentUser.id,
          });
        });

      resetForm();
    };

    reader.readAsText(file);
  };

  const filteredContacts = visibleContacts.filter((contact) => {
    const owner = users.find((user) => user.id === contact.userId);
    const organisation = organisations.find(
      (item) => item.id === owner?.organisationId
    );

    return [contact.name, contact.email, contact.phone, owner?.name, organisation?.name]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="contacts">
      <h1>Contacts</h1>

      <input
        type="text"
        placeholder="Search contacts..."
        className="search-bar"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <form onSubmit={handleAdd} className="contact-form">
        {isAdmin && (
          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            required
          >
            {assignableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        )}

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <button type="submit">{editingId ? "Update" : "Add"}</button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          Import
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            {isAdmin && <th>User</th>}
            {isAdmin && <th>Organization</th>}
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredContacts.map((contact) => {
            const owner = users.find((user) => user.id === contact.userId);
            const organisation = organisations.find(
              (item) => item.id === owner?.organisationId
            );

            return (
              <tr key={contact.id}>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.phone}</td>
                {isAdmin && <td>{owner?.name || "-"}</td>}
                {isAdmin && <td>{organisation?.name || "-"}</td>}
                <td>
                  <button
                    type="button"
                    onClick={() => handleEdit(contact)}
                    className="icon-btn edit"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>

                  <button
                    type="button"
                    className="icon-btn delete"
                    onClick={() => handleDelete(contact.id)}
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
  );
}

export default Contacts;
