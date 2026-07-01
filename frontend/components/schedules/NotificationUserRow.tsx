import { useState } from "react";
import { NotificationRecipient, updateNotificationRecipient } from "@/services/notification-recipients-api";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface Props {
  user: NotificationRecipient;
  onRefresh: () => void;
  onEdit: () => void;
  onDeleteClick: () => void;
  onShowToast: (message: string, isError?: boolean) => void;
}

export default function NotificationUserRow({ user, onRefresh, onEdit, onDeleteClick, onShowToast }: Props) {
  const [isToggling, setIsToggling] = useState(false);

  const handleToggleActive = async () => {
    setIsToggling(true);
    try {
      await updateNotificationRecipient(user._id as string, { is_active: !user.is_active });
      onShowToast(`User ${!user.is_active ? 'activated' : 'deactivated'} successfully.`);
      onRefresh();
    } catch (error) {
      console.error("Failed to toggle status", error);
      onShowToast("Failed to update user status.", true);
    } finally {
      setIsToggling(false);
    }
  };

  const formattedDate = user.created_at 
    ? new Date(user.created_at).toLocaleDateString()
    : "N/A";

  return (
    <tr className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">
        {user.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
        {user.email}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button 
          onClick={handleToggleActive}
          disabled={isToggling}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
            user.is_active 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' 
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-zinc-400'}`}></span>
          {user.is_active ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-500">
        {formattedDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end gap-2">
          <button
            onClick={onEdit}
            className="p-1.5 text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
            title="Edit User"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={onDeleteClick}
            className="p-1.5 text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors"
            title="Delete User"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}
