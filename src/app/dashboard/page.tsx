import { getServerSession } from "next-auth";
import { authOptions } from "../../auth";
import prisma from "../../prisma";
import DonationHistory from "../../components/DonationHistory";
import DistributionList from "../../components/DistributionList";
import DashboardStats from "../../components/DashboardStats";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const userId = Number.parseInt(session.user.id, 10);

  const [donations, distributions] = await Promise.all([
    prisma.donation.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    }),
    prisma.distribution.findMany({
      orderBy: { date: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-8">
      <DashboardStats userId={userId} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <DonationHistory donations={donations} />
        <DistributionList distributions={distributions} />
      </div>
    </div>
  );
}