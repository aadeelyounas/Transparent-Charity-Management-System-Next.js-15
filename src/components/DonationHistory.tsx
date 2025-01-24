"use client";

import { Donation } from "@prisma/client";

interface DonationHistoryProps {
  donations: Donation[];
}

export default function DonationHistory({ donations }: DonationHistoryProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Your Donation History</h2>
      {donations.length === 0 ? (
        <p className="text-gray-500">No donations found</p>
      ) : (
        <div className="space-y-4">
          {donations.map((donation) => (
            <div key={donation.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">${donation.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(donation.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{donation.method}</p>
              </div>
              {donation.transactionId && (
                <p className="text-sm text-gray-500 mt-2">
                  Transaction ID: {donation.transactionId}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}