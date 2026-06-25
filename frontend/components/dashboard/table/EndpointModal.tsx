import React, { useState, useEffect } from "react";
import { ApiEndpoint } from "@/types/api-endpoint";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (endpoint: ApiEndpoint) => Promise<void>;
  initialData: ApiEndpoint | null;
  title: string;
}

export default function EndpointModal({ isOpen, onClose, onSave, initialData, title }: Props) {
  const [formData, setFormData] = useState<ApiEndpoint>({
    name: "",
    url: "",
    method: "GET",
  });
  
  const [jsonFields, setJsonFields] = useState({
    headers: "{}",
    query_params: "{}",
    request_body: "{}",
    expected_response: "{}"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          url: initialData.url,
          method: initialData.method,
          timeout_seconds: initialData.timeout_seconds || 30,
        });
        setJsonFields({
          headers: JSON.stringify(initialData.headers || {}, null, 2),
          query_params: JSON.stringify(initialData.query_params || {}, null, 2),
          request_body: JSON.stringify(initialData.request_body || {}, null, 2),
          expected_response: JSON.stringify(initialData.expected_response || {}, null, 2),
        });
      } else {
        setFormData({ name: "", url: "", method: "GET", timeout_seconds: 30 });
        setJsonFields({ headers: "{}", query_params: "{}", request_body: "{}", expected_response: "{}" });
      }
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    
    try {
      const endpoint: ApiEndpoint = {
        ...formData,
        headers: JSON.parse(jsonFields.headers),
        query_params: JSON.parse(jsonFields.query_params),
        request_body: JSON.parse(jsonFields.request_body),
        expected_response: JSON.parse(jsonFields.expected_response),
      };
      
      await onSave(endpoint);
      onClose();
    } catch (err: any) {
      setError(err instanceof SyntaxError ? "Invalid JSON in one of the fields." : (err.message || "Failed to save endpoint."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleJsonChange = (field: keyof typeof jsonFields, value: string) => {
    setJsonFields(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl transition-colors">
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Name</label>
              <input 
                type="text" 
                required 
                disabled={!!initialData} 
                value={formData.name}
                onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Method</label>
              <select 
                value={formData.method}
                onChange={e => setFormData(f => ({ ...f, method: e.target.value }))}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">URL</label>
            <input 
              type="url" 
              required 
              value={formData.url}
              onChange={e => setFormData(f => ({ ...f, url: e.target.value }))}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Timeout (seconds)</label>
            <input 
              type="number" 
              value={formData.timeout_seconds || 30}
              onChange={e => setFormData(f => ({ ...f, timeout_seconds: parseInt(e.target.value) }))}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Headers (JSON)</label>
              <textarea 
                value={jsonFields.headers}
                onChange={e => handleJsonChange("headers", e.target.value)}
                className="w-full h-24 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Query Params (JSON)</label>
              <textarea 
                value={jsonFields.query_params}
                onChange={e => handleJsonChange("query_params", e.target.value)}
                className="w-full h-24 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Request Body (JSON)</label>
              <textarea 
                value={jsonFields.request_body}
                onChange={e => handleJsonChange("request_body", e.target.value)}
                className="w-full h-24 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Expected Response (JSON)</label>
              <textarea 
                value={jsonFields.expected_response}
                onChange={e => handleJsonChange("expected_response", e.target.value)}
                className="w-full h-24 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

        </form>
        
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 transition-colors">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
