"use client";

import { useEffect, useState } from "react";
import { ApiGroup, getApiGroups } from "@/services/api-groups-api";
import ApiGroupRow from "./ApiGroupRow";
import ApiGroupModal from "./ApiGroupModal";

export default function ApiGroupsTable() {
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ApiGroup | null>(null);

  const fetchGroups = async () => {
    try {
      const data = await getApiGroups();
      setGroups(data);
    } catch (error) {
      console.error("Failed to fetch API Groups", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (group: ApiGroup) => {
    setEditData(group);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xl transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">API Groups</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage logical groupings of endpoints</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors"
        >
          Create Group
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Group Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">APIs</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400 text-sm">
                  No API Groups found. Create one to get started.
                </td>
              </tr>
            ) : (
              groups.map((group, index) => (
                <ApiGroupRow
                  key={index}
                  group={group}
                  onRefresh={fetchGroups}
                  onEdit={() => handleEdit(group)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <ApiGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchGroups}
        editData={editData}
      />
    </div>
  );
}
