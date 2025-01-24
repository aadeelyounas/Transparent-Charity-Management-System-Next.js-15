"use client";

import { useQuery } from "@tanstack/react-query";
import prisma from "@/prisma";

interface DashboardStatsProps {
  userId: number;
}

async function fetchStats(userId: number) {
  const [totalDonations, totalDistributions] = await Promise.all([
    prisma.donation.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.distribution.aggregate({
      _sum: { amount: true },
    }),
  ]);

  return {
    totalDonated: totalDonations._sum.amount || 0,
    totalDistributed: totalDistributions._sum.amount || 0,
  };
}

export default function DashboardStats({ userId }: DashboardStatsProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats", userId],
    queryFn: () => fetchStats(userId),
  });

  if (isLoading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p className="text-sm text-gray-500">Total Donated</p>
        <p className="text-2xl font-semibold">
          ${data?.totalDonated?.toFixed(2) || "0.00"}
        </p>
      </div>
      <div className="bg-white shadow-sm rounded-lg p-6">
        <p className="text-sm text-gray-500">Total Distributed</p>
        <p className="text-2xl font-semibold">
          ${data?.totalDistributed?.toFixed(2) || "0.00"}
        </p>
      </div>
    </div>
  );
}