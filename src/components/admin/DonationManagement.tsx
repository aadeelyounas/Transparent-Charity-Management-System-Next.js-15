"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Donation } from "@prisma/client";
import EditDonationForm from "./EditDonationForm";

interface DonationManagementProps {
  donations: Donation[];
}

export default function DonationManagement({ donations }: DonationManagementProps) {
  const queryClient = useQueryClient();
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (donationId: number) => {
      const response = await fetch(`/api/admin/donations/${donationId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete donation");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
    },
  });

  const handleDelete = async (donationId: number) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await deleteMutation.mutateAsync(donationId);
      } catch {
        alert("Failed to delete donation");
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Donation Management</h2>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => setShowCreateForm(true)}
        >
          Add Donation
        </button>
      </div>

      <div className="space-y-2">
        {donations.map((donation) => (
          <div key={donation.id} className="flex items-center justify-between">
            <button
              type="button"
              className="w-full text-left flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setSelectedDonation(donation)}
            >
              <div>
                <p className="font-medium">${donation.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {donation.method} - {new Date(donation.date).toLocaleDateString()}
                </p>
              </div>
            </button>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800 ml-2 p-2"
              onClick={() => handleDelete(donation.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {(selectedDonation || showCreateForm) && (
        <div className="mt-4 p-4 border-t">
          <EditDonationForm
            donation={selectedDonation || undefined}
            isCreate={showCreateForm}
            onClose={() => {
              setSelectedDonation(null);
              setShowCreateForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}