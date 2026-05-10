"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import {
  createTestimonial,
  deleteTestimonial,
  fetchTestimonials,
  updateTestimonial,
} from "@/lib/api";
import {
  createLocalTestimonial,
  deleteLocalTestimonial,
  getLocalTestimonials,
  isStaticUser,
  updateLocalTestimonial,
} from "@/lib/localStorageAdmin";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  avatar?: string;
  rating: number;
  quote: string;
};

const emptyForm: Omit<Testimonial, "_id"> = {
  name: "",
  role: "",
  avatar: "",
  rating: 5,
  quote: "",
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = async () => {
    try {
      if (isStaticUser()) {
        setItems(getLocalTestimonials() as Testimonial[]);
      } else {
        const data = await fetchTestimonials();
        setItems(data as Testimonial[]);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadTestimonials();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const openAddModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setForm({
      name: item.name,
      role: item.role ?? "",
      avatar: item.avatar ?? "",
      rating: item.rating,
      quote: item.quote,
    });
    setEditingId(item._id);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.quote) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (isStaticUser()) {
      if (editingId) {
        updateLocalTestimonial(editingId, form);
        toast.success("Testimonial updated");
      } else {
        createLocalTestimonial(form);
        toast.success("Testimonial added");
      }
      void loadTestimonials();
    } else {
      if (editingId) {
        await updateTestimonial(editingId, form);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(form);
        toast.success("Testimonial added");
      }
      await loadTestimonials();
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) {
      return;
    }
    if (isStaticUser()) {
      deleteLocalTestimonial(id);
      void loadTestimonials();
    } else {
      await deleteTestimonial(id);
      await loadTestimonials();
    }
    toast.success("Testimonial deleted");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Review customer feedback shown on your landing page.
        </p>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-neutral-100 dark:bg-neutral-800" />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          No testimonials yet. Add your first testimonial.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item._id}
              className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                    {item.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star key={index} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">{item.quote}</p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="text-indigo-600 hover:underline dark:text-indigo-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(item._id)}
                  className="text-red-600 hover:underline dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Testimonial" : "Add Testimonial"}
            </h2>
            <div className="mt-4 space-y-3">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Name"
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
              />
              <input
                value={form.role ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                placeholder="Role"
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
              />
              <input
                value={form.avatar ?? ""}
                onChange={(event) => setForm((current) => ({ ...current, avatar: event.target.value }))}
                placeholder="Avatar initials"
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
              />
              <textarea
                value={form.quote}
                onChange={(event) => setForm((current) => ({ ...current, quote: event.target.value }))}
                placeholder="Quote"
                rows={4}
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm dark:border-neutral-700"
              />
              <div>
                <p className="mb-2 text-sm">Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, rating: value }))}
                      className={`rounded-lg border px-3 py-1 text-sm ${
                        form.rating === value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300"
                          : "border-neutral-300 dark:border-neutral-700"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
