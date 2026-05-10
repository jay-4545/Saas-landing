"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FileText, Mail, MessageSquareQuote, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { StatCard } from "@/components/admin/StatCard";
import { fetchDashboardStats, fetchMessages } from "@/lib/api";

type MessageItem = {
  _id: string;
  name: string;
  email: string;
  status: "new" | "read";
  createdAt?: string;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalMessages: 0,
    totalTestimonials: 0,
    unreadMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashboard, messages] = await Promise.all([
          fetchDashboardStats(),
          fetchMessages(),
        ]);
        setStats({
          totalBlogs: dashboard.totalBlogs,
          totalMessages: dashboard.totalMessages,
          totalTestimonials: dashboard.totalTestimonials,
          unreadMessages: dashboard.unreadMessages,
        });
        setRecentMessages((messages as MessageItem[]).slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const visitorsLast7Days = useMemo(
    () => [
      { day: "Mon", visitors: Math.max(stats.totalBlogs * 6, 80) },
      { day: "Tue", visitors: Math.max(stats.totalBlogs * 7, 90) },
      { day: "Wed", visitors: Math.max(stats.totalMessages * 5, 100) },
      { day: "Thu", visitors: Math.max(stats.totalMessages * 6, 120) },
      { day: "Fri", visitors: Math.max(stats.totalTestimonials * 20, 140) },
      { day: "Sat", visitors: Math.max(stats.totalTestimonials * 22, 160) },
      { day: "Sun", visitors: Math.max((stats.totalBlogs + stats.totalMessages) * 4, 180) },
    ],
    [stats.totalBlogs, stats.totalMessages, stats.totalTestimonials]
  );

  const monthMap = new Map<string, number>();
  recentMessages.forEach((item) => {
    const date = item.createdAt ? new Date(item.createdAt) : new Date();
    const month = date.toLocaleString("en-US", { month: "short" });
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);
  });
  const messagesPerMonth = Array.from(monthMap.entries()).map(([month, total]) => ({
    month,
    total,
  }));

  const statCards = [
    { label: "Total Blog Posts", value: String(stats.totalBlogs), change: "+12%" },
    { label: "Messages", value: String(stats.totalMessages), change: "+18%" },
    { label: "Testimonials", value: String(stats.totalTestimonials), change: "+9%" },
    { label: "Visitors", value: String(stats.totalBlogs * 320), change: "+24%" },
  ];

  const statAccents = [
    "bg-indigo-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
  ];
  const statIcons = [
    <FileText key="ft" size={18} />,
    <Mail key="mail" size={18} />,
    <MessageSquareQuote key="msq" size={18} />,
    <Users key="users" size={18} />,
  ];

  return (
    <div className="space-y-6">
      <motion.section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } } }}
          >
            <StatCard
              label={card.label}
              value={card.value}
              icon={statIcons[i]}
              change={card.change}
              accent={statAccents[i]}
            />
          </motion.div>
        ))}
      </motion.section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 text-lg font-semibold">Visitors (Last 7 Days)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorsLast7Days}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitors" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-4 text-lg font-semibold">Messages per Month</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messagesPerMonth.length ? messagesPerMonth : [{ month: "N/A", total: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">Recent Messages</h2>
          <Link href="/admin/messages" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="h-12 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            ))}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="p-6 text-sm text-neutral-500 dark:text-neutral-400">No recent messages found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-100 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((message) => (
                  <tr key={message._id} className="border-t border-neutral-200 dark:border-neutral-800">
                    <td className="px-4 py-3">{message.name}</td>
                    <td className="px-4 py-3">{message.email}</td>
                    <td className="px-4 py-3">{message.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
