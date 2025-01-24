"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface EditDistributionFormProps {
  distribution?: {
    id: number;
    beneficiary: string;
    amount: number;
    purpose: string;
    date: Date;
  };
  isCreate?: boolean;
  onClose: () => void;
}

export default function EditDistributionForm({ distribution, isCreate = false, onClose }: EditDistributionFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    beneficiary: distribution?.beneficiary || "",
    amount: distribution?.amount || 0,
    purpose: distribution?.purpose || "",
    date: distribution?.date.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const url = isCreate ? "/api/admin/distributions" : `/api/admin/distributions/${distribution?.id}`;
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
        throw new Error("Failed to save distribution");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-distributions"] });
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
        <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">
          Beneficiary
        </label>
        <input
          type="text"
          id="beneficiary"
          value={formData.beneficiary}
          onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
          step="0.01"
        />
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
          Purpose
        </label>
        <input
          type="text"
          id="purpose"
          value={formData.purpose}
          onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          required
        />
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