"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import UserManagement from "@/components/admin/UserManagement";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";
import type { User } from "@prisma/client";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/admin/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers();
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
      <h1 className="text-3xl font-bold text-black mb-8">User Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <UserManagement users={users} />
      </div>
    </div>
  );
}