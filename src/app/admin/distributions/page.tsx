"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DistributionManagement from "@/components/admin/DistributionManagement";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import type { Distribution } from "@prisma/client";

export default function DistributionsPage() {
  const { data: session, status } = useSession();
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/admin/distributions');
        if (!res.ok) throw new Error('Failed to fetch distributions');
        
        const data = await res.json();
        setDistributions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching distributions:', err);
        setError('Failed to load distributions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchDistributions();
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
      <h1 className="text-3xl font-bold text-black mb-8">Distribution Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <DistributionManagement distributions={distributions} />
      </div>
    </div>
  );
}