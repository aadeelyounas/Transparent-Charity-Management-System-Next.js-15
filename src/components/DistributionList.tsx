"use client";

import type { Distribution } from "@prisma/client";

interface DistributionListProps {
  distributions: Distribution[];
}

export default function DistributionList({ distributions }: DistributionListProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Distributions</h2>
      {distributions.length === 0 ? (
        <p className="text-gray-500">No distributions found</p>
      ) : (
        <div className="space-y-4">
          {distributions.map((distribution) => (
            <div key={distribution.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">${distribution.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(distribution.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm text-gray-500">{distribution.purpose}</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Beneficiary: {distribution.beneficiary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}