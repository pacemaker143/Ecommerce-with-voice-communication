import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../../Redux/slices/adminSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateAdminUser({ id: userId, role: newRole }))
      .unwrap()
      .then(() => toast.success("Role updated"))
      .catch((err) => toast.error(err));
  };

  const handelDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteAdminUser(userId))
        .unwrap()
        .then(() => toast.success("User deleted"))
        .catch((err) => toast.error(err));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAdminUser(formData))
      .unwrap()
      .then(() => {
        toast.success("User created");
        setFormData({ name: "", email: "", password: "", role: "customer" });
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-body">
      <h2 className="comic-heading text-xl sm:text-2xl text-comic-dark mb-6 inline-block transform -rotate-1">👥 User Management</h2>
      <div className="mb-6">
        <h3 className="font-comic text-lg sm:text-xl text-comic-dark mb-3">➕ Add New User</h3>
        <form
          className="comic-panel p-6 animate-fade-in"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label className="block font-comic text-comic-dark mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="comic-input w-full"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-comic text-comic-dark mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="comic-input w-full"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-comic text-comic-dark mb-2">Password</label>
            <input
              type="password"
              name="password"
              className="comic-input w-full"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-comic text-comic-dark mb-2">Role</label>
            <select
              name="role"
              className="comic-input w-full"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="comic-btn-primary px-6 py-2 font-comic"
          >
            ✨ Add User
          </button>
        </form>
      </div>
      {/* userlist management */}
      <div className="comic-panel p-4 sm:p-6">
        <h3 className="font-comic text-lg sm:text-xl text-comic-dark mb-4">📋 User List</h3>
        <div className="overflow-x-auto">
        <table className="w-full table-auto font-body text-sm">
          <thead>
            <tr className="bg-comic-yellow border-b-3 border-comic-dark">
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark hidden sm:table-cell">ID</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark">Name</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark hidden md:table-cell">Email</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark">Role</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="py-4 text-center font-comic">⏳ Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="py-4 text-center font-comic">No users found</td></tr>
            ) : (
            users.map((user) => (
              <tr key={user._id} className="border-b-2 border-comic-dark/10 hover:bg-comic-yellow/10 transition-colors">
                <td className="p-2 sm:p-4 font-mono text-xs text-comic-dark whitespace-nowrap hidden sm:table-cell">
                  {user._id}
                </td>
                <td className="px-2 sm:px-4 py-2 font-bold text-sm">{user.name}</td>
                <td className="px-2 sm:px-4 py-2 text-sm hidden md:table-cell">{user.email}</td>
                <td className="px-2 sm:px-4 py-2">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="comic-input py-1 px-2 text-xs sm:text-sm"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-2 sm:px-4 py-2">
                  <button onClick={()=>{ handelDeleteUser(user._id) }} className="comic-btn-danger px-2 sm:px-3 py-1 text-xs sm:text-sm font-comic">
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
