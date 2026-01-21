"use client";

import { useState, useMemo } from "react";
import { extractFormData } from "./actions";

type FieldMapping = {
  id: string;
  originalKey: string;
  value: string | string[];
  targetKey: string;
  isSelected: boolean;
};

export default function Home() {
  const [htmlInput, setHtmlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [hasExtracted, setHasExtracted] = useState(false);

  const handleExtract = async () => {
    setLoading(true);
    setError("");
    setMappings([]);
    setHasExtracted(false);

    const result = await extractFormData(htmlInput);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      const initialMappings: FieldMapping[] = Object.entries(result.data).map(
        ([key, value], index) => ({
          id: `field-${index}`,
          originalKey: key,
          value: value,
          targetKey: key,
          isSelected: true,
        }),
      );
      setMappings(initialMappings);
      setHasExtracted(true);
    }
    setLoading(false);
  };

  const updateMapping = (id: string, updates: Partial<FieldMapping>) => {
    setMappings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  };

  const applyCamelCase = () => {
    setMappings((prev) =>
      prev.map((item) => ({
        ...item,
        targetKey: item.originalKey,
      })),
    );
  };

  const finalJson = useMemo(() => {
    return mappings
      .filter((m) => m.isSelected)
      .reduce(
        (acc, curr) => {
          acc[curr.targetKey] = curr.value;
          return acc;
        },
        {} as Record<string, any>,
      );
  }, [mappings]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(finalJson, null, 2));
    alert("Copied JSON to clipboard!");
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Container with responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Form Mapper
          </h1>
          {hasExtracted && (
            <button
              onClick={() => {
                setHtmlInput("");
                setHasExtracted(false);
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md transition"
            >
              Start Over
            </button>
          )}
        </div>

        {/* STEP 1: Input Area */}
        {!hasExtracted && (
          <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Step 1: Paste HTML Source
            </h2>
            <p className="text-sm text-gray-500">
              Go to your Google Form page (view mode), right-click &gt;{" "}
              <strong>View Page Source</strong>, select all, copy, and paste
              below.
            </p>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50"
              placeholder="<html>...</html>"
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
            />
            <button
              onClick={handleExtract}
              disabled={loading || !htmlInput}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition disabled:opacity-50 shadow-md"
            >
              {loading ? "Analyzing..." : "Analyze HTML"}
            </button>
            {error && (
              <p className="text-red-600 font-medium bg-red-50 p-3 rounded">
                {error}
              </p>
            )}
          </div>
        )}

        {/* STEP 2 & 3: Split View */}
        {hasExtracted && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left Col: Mapping Interface */}
            <div className="lg:col-span-3 space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm sticky top-0 z-10 lg:static">
                <h2 className="text-xl font-bold text-gray-900">
                  Step 2: Map Fields
                </h2>
              </div>

              {/* === MOBILE VIEW (Cards) === */}
              {/* Visible on small screens, hidden on md and up */}
              <div className="block md:hidden space-y-4">
                {mappings.map((field) => (
                  <div
                    key={field.id}
                    className={`p-4 rounded-xl border shadow-sm transition-all ${
                      field.isSelected
                        ? "bg-white border-blue-200 ring-1 ring-blue-100"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 pr-2">
                        <label className="text-sm font-semibold text-gray-700 block mb-1">
                          Original Question
                        </label>
                        <p
                          className="text-xs text-gray-500 line-clamp-2"
                          title={field.originalKey}
                        >
                          {field.originalKey}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={field.isSelected}
                        onChange={(e) =>
                          updateMapping(field.id, {
                            isSelected: e.target.checked,
                          })
                        }
                        className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                      />
                    </div>

                    <div className="mb-4 bg-gray-50 p-2 rounded text-xs font-mono text-gray-600 break-all border">
                      <span className="font-bold text-gray-400 select-none">
                        Value:{" "}
                      </span>
                      {Array.isArray(field.value)
                        ? `[${field.value.join(", ")}]`
                        : field.value}
                    </div>

                    <div>
                      <label className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1 block">
                        Target Key Name
                      </label>
                      <input
                        type="text"
                        value={field.targetKey}
                        disabled={!field.isSelected}
                        onChange={(e) =>
                          updateMapping(field.id, { targetKey: e.target.value })
                        }
                        className="w-full bg-white border border-gray-300 text-gray-900 text-base rounded-lg px-3 py-3 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                        placeholder="Enter key name..."
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* === DESKTOP VIEW (Table) === */}
              {/* Hidden on small screens, visible on md and up */}
              <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 font-semibold text-sm uppercase tracking-wider border-b">
                    <tr>
                      <th className="p-4 w-12 text-center">Use</th>
                      <th className="p-4 w-1/3">Original Question</th>
                      <th className="p-4 w-1/4">Detected Value</th>
                      <th className="p-4">Target Key Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mappings.map((field) => (
                      <tr
                        key={field.id}
                        className={`group transition-colors ${!field.isSelected ? "opacity-50 bg-gray-50" : "hover:bg-blue-50/50"}`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={field.isSelected}
                            onChange={(e) =>
                              updateMapping(field.id, {
                                isSelected: e.target.checked,
                              })
                            }
                            className="w-5 h-5 text-blue-600 rounded border-gray-300 cursor-pointer focus:ring-offset-0"
                          />
                        </td>
                        <td className="p-4">
                          <p
                            className="text-sm text-gray-700 font-medium line-clamp-2"
                            title={field.originalKey}
                          >
                            {field.originalKey}
                          </p>
                        </td>
                        <td className="p-4">
                          <div
                            className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit max-w-[150px] truncate"
                            title={String(field.value)}
                          >
                            {Array.isArray(field.value)
                              ? `[${field.value.join(", ")}]`
                              : field.value}
                          </div>
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={field.targetKey}
                            disabled={!field.isSelected}
                            onChange={(e) =>
                              updateMapping(field.id, {
                                targetKey: e.target.value,
                              })
                            }
                            // Increased padding (py-2) and width (w-full) for better usability
                            className="w-full bg-white border border-gray-300 text-gray-900 font-medium rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {mappings.length === 0 && (
                <div className="p-12 text-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                  No form data found in the provided HTML.
                </div>
              )}
            </div>

            {/* Right Col: JSON Preview (Sticky on Desktop) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                  Step 3: Result
                </h2>
                <button
                  onClick={copyToClipboard}
                  className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded transition shadow-sm"
                >
                  Copy JSON
                </button>
              </div>

              <div className="bg-gray-200 rounded-xl shadow-lg p-5 h-[500px] lg:h-[calc(100vh-140px)] overflow-auto sticky top-6 border border-gray-800">
                <pre className="text-xs sm:text-sm font-mono whitespace-pre-wrap break-words">
                  {JSON.stringify(finalJson, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
