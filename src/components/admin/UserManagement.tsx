"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@prisma/client";
import EditUserForm from "./EditUserForm";

interface UserManagementProps {
  users: User[];
}

export default function UserManagement({ users }: UserManagementProps) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteMutation.mutateAsync(userId);
      } catch {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">User Management</h2>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => setShowCreateForm(true)}
        >
          Add User
        </button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <button
              type="button"
              className="w-full text-left flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
              onClick={() => setSelectedUser(user)}
            >
              <div>
                <p className="font-medium text-gray-900">{user.name || user.email}</p>
                <p className="text-sm text-gray-700">{user.role}</p>
              </div>
            </button>
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-800 ml-2 p-2"
              onClick={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {(selectedUser || showCreateForm) && (
        <div className="mt-4 p-4 border-t">
          <EditUserForm
            user={selectedUser || undefined}
            isCreate={showCreateForm}
            onClose={() => {
              setSelectedUser(null);
              setShowCreateForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}