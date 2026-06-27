"use client";

import { useEffect, useState } from "react";
import { NotificationRecipient, createNotificationRecipient, updateNotificationRecipient } from "@/services/notification-recipients-api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
  editData?: NotificationRecipient | null;
  onShowToast?: (message: string, isError?: boolean) => void;
}

export default function NotificationRecipientModal({ isOpen, onClose, onRefresh, editData, onShowToast }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isEditing = !!editData;

  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      if (editData) {
        setName(editData.name);
        setEmail(editData.email);
        setIsActive(editData.is_active);
      } else {
        setName("");
        setEmail("");
        setIsActive(true);
      }
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name || !email) return;

    setIsSaving(true);
    setErrorMsg("");
    try {
      const payload: NotificationRecipient = {
        name,
        email,
        is_active: isActive,
      };

      if (isEditing && editData?._id) {
        await updateNotificationRecipient(editData._id, payload);
        if (onShowToast) onShowToast("User updated successfully.");
      } else {
        await createNotificationRecipient(payload);
        if (onShowToast) onShowToast("User added successfully.");
      }
      
      if (onRefresh) onRefresh();
      onClose();
    } catch (error: any) {
      console.error("Failed to save user", error);
      
      // Attempt to extract meaningful error from backend response
      let msg = "Unable to save user.";
      if (error.response?.data?.detail) {
        msg = error.response.data.detail;
      } else if (error.message) {
        msg = error.message;
      }
      
      setErrorMsg(msg);
      if (onShowToast) onShowToast(msg, true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {isEditing ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
              <span className="mt-0.5">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. DevOps Team"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. devops@example.com"
            />
          </div>

          <div className="flex items-center gap-2 mt-4 pt-2">
            <input
              type="checkbox"
              id="activeCheck"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="activeCheck" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
              Active (receive notifications)
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !name || !email}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save User"}
          </button>
        </div>
      </div>
    </div>
  );
}
