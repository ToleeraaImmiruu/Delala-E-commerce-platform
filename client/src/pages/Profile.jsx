import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditableUser(parsedUser);
    }
  }, []);

  if (!user) return <p>Loading user info...</p>;

  const handleChange = (e) => {
    setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(editableUser));
    setUser(editableUser);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      <table className="w-full table-auto border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-semibold">Username:</td>
            <td className="py-2">
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={editableUser.username}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                user.username
              )}
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-semibold">Email:</td>
            <td className="py-2">
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editableUser.email}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                user.email
              )}
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-semibold">Role:</td>
            <td className="py-2">{user.role}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-semibold">Joined:</td>
            <td className="py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>

      <button
        onClick={goBack}
        className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Go Back
      </button>
    </div>
  );
};

export default Profile;
