"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditDonationFormProps {
  donation?: {
    id: number;
    amount: number;
    method: string;
    transactionId: string | null;
    userId: number;
    date: Date;
  };
  isCreate?: boolean;
  onClose: () => void;
}

interface User {
  id: number;
  name: string | null;
  email: string;
}

export default function EditDonationForm({ donation, isCreate = false, onClose }: EditDonationFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    amount: donation?.amount || 0,
    method: donation?.method || "",
    transactionId: donation?.transactionId || "",
    userId: donation?.userId || 0,
    date: donation?.date ?
      (typeof donation.date === 'string' ? donation.date : donation.date.toISOString().split('T')[0])
      : new Date().toISOString().split('T')[0]
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    };
    fetchUsers();
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isCreate ? "/api/admin/donations" : `/api/admin/donations/${donation?.id}`;
      const method = isCreate ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          amount: Number.parseFloat(data.amount.toString())
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save donation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
          required
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="method" className="block text-sm font-medium text-gray-700">
          Payment Method
        </label>
        <input
          type="text"
          id="method"
          value={formData.method}
          onChange={(e) => setFormData({ ...formData, method: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
          Transaction ID
        </label>
        <input
          type="text"
          id="transactionId"
          value={formData.transactionId}
          onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
          User
        </label>
        <select
          id="userId"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: Number.parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        >
          <option value={0}>Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          id="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}