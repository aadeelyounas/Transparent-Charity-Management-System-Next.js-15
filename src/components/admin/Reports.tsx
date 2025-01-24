import type { Donation, Distribution } from "@prisma/client";

interface ReportsProps {
  donations: Donation[];
  distributions: Distribution[];
}

export default function Reports({ donations, distributions }: ReportsProps) {
  // Calculate totals
  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDistributions = distributions.reduce((sum, d) => sum + d.amount, 0);
  const netBalance = totalDonations - totalDistributions;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-text">Total Donations</h2>
          <p className="text-2xl font-bold text-primary">${totalDonations.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-text">Total Distributions</h2>
          <p className="text-2xl font-bold text-primary">${totalDistributions.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-text">Net Balance</h2>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${netBalance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-text mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[...donations, ...distributions]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
            .map((item) => (
              <div key={item.id} className="border-b pb-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">
                      {'userId' in item ? 'Donation' : 'Distribution'}
                    </p>
                    <p className="text-sm text-text-light">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                  <p className={`font-medium ${'userId' in item ? 'text-green-600' : 'text-red-600'}`}>
                    ${item.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}