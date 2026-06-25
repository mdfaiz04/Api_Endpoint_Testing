"use client";

import { useState, useEffect } from "react";
import { ApiGroup, createApiGroup, updateApiGroup } from "@/services/api-groups-api";
import { getEndpoints } from "@/services/endpoints-api";
import { ApiEndpoint } from "@/types/api-endpoint";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  editData?: ApiGroup | null;
}

export default function ApiGroupModal({ isOpen, onClose, onRefresh, editData }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedApis, setSelectedApis] = useState<string[]>([]);
  const [availableEndpoints, setAvailableEndpoints] = useState<ApiEndpoint[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getEndpoints().then(setAvailableEndpoints).catch(console.error);
      
      if (editData) {
        setName(editData.name);
        setDescription(editData.description);
        setSelectedApis(editData.apis);
      } else {
        setName("");
        setDescription("");
        setSelectedApis([]);
      }
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name || !description) return;
    setIsSaving(true);
    try {
      const payload = { name, description, apis: selectedApis };
      if (editData) {
        await updateApiGroup(editData.name, payload);
      } else {
        await createApiGroup(payload);
      }
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Failed to save API Group", error);
      alert("Failed to save API Group. Name might already exist.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleApi = (apiName: string) => {
    setSelectedApis(prev => 
      prev.includes(apiName) ? prev.filter(a => a !== apiName) : [...prev, apiName]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {editData ? "Edit API Group" : "Create API Group"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Group Name</label>
            <input 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. LLM Providers"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Description</label>
            <input 
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. Generative AI providers"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Select APIs</label>
            <div className="space-y-2 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 max-h-48 overflow-y-auto bg-zinc-50 dark:bg-zinc-800">
              {availableEndpoints.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">No APIs available.</p>
              ) : (
                availableEndpoints.map(ep => (
                  <label key={ep.name} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={selectedApis.includes(ep.name)}
                      onChange={() => toggleApi(ep.name)}
                      className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">{ep.name}</span>
                  </label>
                ))
              )}
            </div>
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
            disabled={isSaving || !name || !description}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
