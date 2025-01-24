"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Reports from "@/components/admin/Reports";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import type { Donation, Distribution } from "@prisma/client";

interface ReportData {
  donations: Donation[];
  distributions: Distribution[];
}

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<ReportData>({
    donations: [],
    distributions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [donationsRes, distributionsRes] = await Promise.all([
          fetch('/api/admin/donations'),
          fetch('/api/admin/distributions')
        ]);

        if (!donationsRes.ok || !distributionsRes.ok) {
          throw new Error('Failed to fetch report data');
        }

        const [donations, distributions] = await Promise.all([
          donationsRes.json(),
          distributionsRes.json()
        ]);

        setData({
          donations: Array.isArray(donations) ? donations : [],
          distributions: Array.isArray(distributions) ? distributions : []
        });
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError('Failed to load reports. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchData();
    }
  }, [session, status]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  if (status !== "authenticated" || session?.user?.role !== "admin") {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-black mb-4">Access Denied</h1>
        <p className="text-black">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-8">Financial Reports</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Reports donations={data.donations} distributions={data.distributions} />
      </div>
    </div>
  );
}