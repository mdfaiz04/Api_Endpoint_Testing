"use client";

import { useEffect, useState } from "react";
import { NotificationRecipient, getNotificationRecipients, deleteNotificationRecipient } from "@/services/notification-recipients-api";
import NotificationUserRow from "./NotificationUserRow";
import NotificationRecipientModal from "./NotificationRecipientModal";
import { FiUsers, FiUserCheck, FiUserMinus } from "react-icons/fi";

export default function NotificationUsersSection() {
  const [users, setUsers] = useState<NotificationRecipient[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<NotificationRecipient | null>(null);
  
  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [isToastError, setIsToastError] = useState(false);

  // Delete state
  const [userToDelete, setUserToDelete] = useState<NotificationRecipient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getNotificationRecipients();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch Notification Users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const intervalId = setInterval(fetchUsers, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: NotificationRecipient) => {
    setEditData(user);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete?._id) return;
    setIsDeleting(true);
    try {
      await deleteNotificationRecipient(userToDelete._id);
      showToast("User deleted successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user", error);
      showToast("Failed to delete user.", true);
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  const showToast = (message: string, isError = false) => {
    setToastMessage(message);
    setIsToastError(isError);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;
  const inactiveUsers = totalUsers - activeUsers;

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl transition-colors mt-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`absolute top-4 right-4 z-40 px-4 py-2 rounded-lg shadow-lg font-medium text-sm transition-all transform flex items-center gap-2 ${
          isToastError ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
        }`}>
          <span>{isToastError ? '❌' : '✓'}</span>
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">Notification Users</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage users who receive alerts and reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
          >
            Add User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 flex items-center gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <FiUsers size={20} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
            <FiUserCheck size={20} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Active Users</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{activeUsers}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 flex items-center gap-4">
          <div className="p-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg text-zinc-600 dark:text-zinc-400">
            <FiUserMinus size={20} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Inactive Users</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{inactiveUsers}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <FiUsers size={48} className="text-zinc-300 dark:text-zinc-600 mb-4" />
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No notification users found.</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-4">Click "Add User" to create your first notification user.</p>
                    <button
                      onClick={handleCreate}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
                    >
                      Add User
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <NotificationUserRow
                  key={index}
                  user={user}
                  onRefresh={fetchUsers}
                  onEdit={() => handleEdit(user)}
                  onDeleteClick={() => setUserToDelete(user)}
                  onShowToast={showToast}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <NotificationRecipientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchUsers}
        editData={editData}
        onShowToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      {!!userToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Delete User?</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Are you sure you want to remove this notification user? They will no longer receive alerts or reports.
              </p>
            </div>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
