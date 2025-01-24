"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Distribution } from "@prisma/client";
import EditDistributionForm from "./EditDistributionForm";

interface DistributionManagementProps {
  distributions: Distribution[];
}

export default function DistributionManagement({ distributions }: DistributionManagementProps) {
  const queryClient = useQueryClient();
  const [selectedDistribution, setSelectedDistribution] = useState<Distribution | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (distributionId: number) => {
      const response = await fetch(`/api/admin/distributions/${distributionId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete distribution");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-distributions"] });
    },
  });

  const handleDelete = async (distributionId: number) => {
    if (window.confirm("Are you sure you want to delete this distribution?")) {
      try {
        await deleteMutation.mutateAsync(distributionId);
      } catch {
        alert("Failed to delete distribution");
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Distribution Management</h2>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => setShowCreateForm(true)}
        >
          Add Distribution
        </button>
      </div>

      <div className="space-y-2">
        {distributions.map((distribution) => (
          <div key={distribution.id} className="flex items-center justify-between">
            <button
              type="button"
              className="w-full text-left flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setSelectedDistribution(distribution)}
            >
              <div>
                <p className="font-medium">${distribution.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {distribution.beneficiary} - {new Date(distribution.date).toLocaleDateString()}
                </p>
              </div>
            </button>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800 ml-2 p-2"
              onClick={() => handleDelete(distribution.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {(selectedDistribution || showCreateForm) && (
        <div className="mt-4 p-4 border-t">
          <EditDistributionForm
            distribution={selectedDistribution || undefined}
            isCreate={showCreateForm}
            onClose={() => {
              setSelectedDistribution(null);
              setShowCreateForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}