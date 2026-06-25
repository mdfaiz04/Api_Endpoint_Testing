import { useState } from "react";
import { ApiGroup, deleteApiGroup } from "@/services/api-groups-api";

interface Props {
  group: ApiGroup;
  onRefresh: () => void;
  onEdit: () => void;
}

export default function ApiGroupRow({ group, onRefresh, onEdit }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the group '${group.name}'?`)) return;
    setIsDeleting(true);
    try {
      await deleteApiGroup(group.name);
      onRefresh();
    } catch (error) {
      console.error("Failed to delete group", error);
      alert("Failed to delete group");
      setIsDeleting(false);
    }
  };

  return (
    <tr className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-zinc-900 dark:text-white">{group.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">{group.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center rounded-md bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
          {group.apis.length} APIs
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            disabled={isDeleting}
            className="rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-100 dark:bg-red-500/10 hover:bg-red-200 dark:hover:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 px-3 py-1 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
