"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { deleteMessage, fetchMessages, markMessageRead } from "@/lib/api";

type FilterTab = "All" | "New" | "Read";

export default function AdminMessagesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [items, setItems] = useState<
    { _id: string; name: string; email: string; message: string; status: "new" | "read"; createdAt?: string }[]
  >([]);
  const [selected, setSelected] = useState<(typeof items)[number] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchMessages();
        setItems(data as typeof items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    void loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const query = search.toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query);
      const matchesTab = activeTab === "All" ? true : item.status === activeTab.toLowerCase();
      return matchesSearch && matchesTab;
    });
  }, [activeTab, items, search]);

  const markAsRead = async () => {
    if (!selected) {
      return;
    }
    try {
      const updated = (await markMessageRead(selected._id)) as { status: "new" | "read" };
      setItems((current) =>
        current.map((item) =>
          item._id === selected._id ? { ...item, status: updated.status } : item
        )
      );
      setSelected((current) => (current ? { ...current, status: updated.status } : null));
      toast.success("Message marked as read");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark read");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this message?")) {
      return;
    }
    try {
      await deleteMessage(id);
      setItems((current) => current.filter((item) => item._id !== id));
      setSelected(null);
      toast.success("Message deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["All", "New", "Read"] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                activeTab === tab
                  ? "bg-indigo-600 text-white"
                  : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name or email..."
          className="w-full max-w-sm rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600 dark:text-red-400">{error}</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-6 text-sm text-neutral-500 dark:text-neutral-400">
            No messages match your current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((message) => (
                  <tr
                    key={message._id}
                    onClick={() => setSelected(message)}
                    className="cursor-pointer border-t border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                  >
                    <td className="px-4 py-3">{message.name}</td>
                    <td className="px-4 py-3">{message.email}</td>
                    <td className="max-w-xs truncate px-4 py-3">{message.message}</td>
                    <td className="px-4 py-3">{message.createdAt ? new Date(message.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          message.status === "new"
                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                            : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200"
                        }`}
                      >
                        {message.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/30"
            onClick={() => setSelected(null)}
            aria-label="Close message drawer"
          />
          <aside className="fixed right-0 top-0 z-50 h-screen w-full max-w-md border-l border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selected.name}</h2>
              <button type="button" onClick={() => setSelected(null)} className="text-sm">
                Close
              </button>
            </div>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{selected.email}</p>
            <p className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm dark:bg-neutral-800">
              {selected.message}
            </p>
            <button
              type="button"
              onClick={() => void markAsRead()}
              className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Mark as Read
            </button>
            <button
              type="button"
              onClick={() => void handleDelete(selected._id)}
              className="mt-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 dark:border-red-700 dark:text-red-400"
            >
              Delete
            </button>
          </aside>
        </>
      ) : null}
    </div>
  );
}
