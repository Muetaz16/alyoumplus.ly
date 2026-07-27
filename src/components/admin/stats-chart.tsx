"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "يناير", views: 4200 },
  { name: "فبراير", views: 5800 },
  { name: "مارس", views: 7100 },
  { name: "أبريل", views: 6500 },
  { name: "مايو", views: 8900 },
  { name: "يونيو", views: 10200 },
];

export function StatsChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "none",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
          formatter={(value) => [`${value} مشاهدة`, "المشاهدات"]}
        />
        <Bar dataKey="views" fill="#C1121F" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
