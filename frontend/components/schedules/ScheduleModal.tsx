"use client";

import { useEffect, useState } from "react";
import { SchedulerConfig, createSchedulerConfig, updateSchedulerConfig } from "@/services/scheduler-configs-api";
import { getEndpoints } from "@/services/endpoints-api";
import { getApiGroups } from "@/services/api-groups-api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  editData?: SchedulerConfig | null;
}

export default function ScheduleModal({ isOpen, onClose, onRefresh, editData }: Props) {
  const [name, setName] = useState("");
  const [targetType, setTargetType] = useState<"API" | "GROUP" | "REPORT">("API");
  const [targetName, setTargetName] = useState("");
  const [intervalPreset, setIntervalPreset] = useState("60"); // default 1 min
  const [intervalValue, setIntervalValue] = useState("");
  const [intervalUnit, setIntervalUnit] = useState<"seconds" | "minutes" | "hours" | "days">("minutes");
  const [enabled, setEnabled] = useState(true);
  
  const [availableApis, setAvailableApis] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getEndpoints().then(eps => setAvailableApis(eps.map(e => e.name))).catch(console.error);
      getApiGroups().then(gps => setAvailableGroups(gps.map(g => g.name))).catch(console.error);

      if (editData) {
        setName(editData.name);
        setTargetType(editData.target_type);
        setTargetName(editData.target_name);
        setEnabled(editData.enabled);

        if (editData.interval_value && editData.interval_unit) {
          setIntervalPreset("custom");
          setIntervalValue(editData.interval_value.toString());
          setIntervalUnit(editData.interval_unit);
        } else if (editData.interval_seconds) {
          const intv = editData.interval_seconds.toString();
          if (["15", "30", "60", "300"].includes(intv)) {
            setIntervalPreset(intv);
            setIntervalValue("");
            setIntervalUnit("minutes");
          } else {
            setIntervalPreset("custom");
            setIntervalValue(intv);
            setIntervalUnit("seconds");
          }
        }
      } else {
        setName("");
        setTargetType("API");
        setTargetName("");
        setIntervalPreset("60");
        setIntervalValue("");
        setIntervalUnit("minutes");
        setEnabled(true);
      }
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name || !targetName) return;
    
    const payload: SchedulerConfig = {
      name,
      target_type: targetType,
      target_name: targetName,
      enabled,
    };

    if (intervalPreset === "custom") {
      const val = parseInt(intervalValue);
      if (isNaN(val) || val <= 0) {
        alert("Please enter a valid interval value (>0).");
        return;
      }
      payload.interval_value = val;
      payload.interval_unit = intervalUnit;
    } else {
      payload.interval_seconds = parseInt(intervalPreset);
    }

    setIsSaving(true);
    try {
      if (editData) {
        await updateSchedulerConfig(editData.name, payload);
      } else {
        await createSchedulerConfig(payload);
      }
      onRefresh();
      onClose();
    } catch (error: any) {
      console.error("Failed to save schedule", error);
      const errorMsg = error.response?.data?.detail 
        ? (Array.isArray(error.response.data.detail) ? JSON.stringify(error.response.data.detail) : error.response.data.detail)
        : "Failed to save schedule. Name might already exist.";
      alert(`Error: ${errorMsg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const currentTargets = targetType === "API" ? availableApis : availableGroups;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {editData ? "Edit Schedule" : "Create Schedule"}
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Schedule Name</label>
            <input 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={!!editData} // name is primary key
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              placeholder="e.g. Hourly Check"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Target Type</label>
              <select 
                value={targetType}
                onChange={e => {
                  const newType = e.target.value as "API" | "GROUP" | "REPORT";
                  setTargetType(newType);
                  if (newType === "REPORT") {
                    setTargetName("Automated Health Report");
                  } else {
                    setTargetName("");
                  }
                }}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="API">Single API</option>
                <option value="GROUP">API Group</option>
                <option value="REPORT">System Health Report</option>
              </select>
            </div>
            {targetType !== "REPORT" && (
              <div className="flex-1">
                <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Target</label>
                <select 
                  value={targetName}
                  onChange={e => setTargetName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Select Target...</option>
                  {currentTargets.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Interval</label>
            <div className="flex gap-4">
              <select 
                value={intervalPreset}
                onChange={e => setIntervalPreset(e.target.value)}
                className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="15">15 Seconds</option>
                <option value="30">30 Seconds</option>
                <option value="60">1 Minute</option>
                <option value="300">5 Minutes</option>
                <option value="custom">Custom Interval</option>
              </select>
              {intervalPreset === "custom" && (
                <div className="flex flex-1 gap-2">
                  <input 
                    type="number"
                    value={intervalValue}
                    onChange={e => setIntervalValue(e.target.value)}
                    className="w-20 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Val"
                  />
                  <select
                    value={intervalUnit}
                    onChange={e => setIntervalUnit(e.target.value as any)}
                    className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-2">
            <input 
              type="checkbox"
              id="enabledCheck"
              checked={enabled}
              onChange={e => setEnabled(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
            />
            <label htmlFor="enabledCheck" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
              Enable this schedule immediately
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
            disabled={isSaving || !name || !targetName}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
