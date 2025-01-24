import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                Seri Ghanial Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-700">
                Welcome, {session.user?.name || session.user?.email}
              </p>
              {session.user?.role === "admin" && (
                <a
                  href="/admin"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Admin Panel
                </a>
              )}
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}