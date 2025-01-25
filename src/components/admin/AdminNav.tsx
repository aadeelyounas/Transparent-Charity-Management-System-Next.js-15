import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminNav() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-white shadow-sm mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              href="/admin/users"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-text hover:border-gray-300 hover:text-text-dark"
            >
              User Management
            </Link>
            <Link
              href="/admin/donations"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:border-gray-300"
            >
              Donation Management
            </Link>
            <Link
              href="/admin/distributions"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:border-gray-300"
            >
              Distribution Management
            </Link>
            <Link
              href="/admin/reports"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-black hover:border-gray-300"
            >
              Financial Reports
            </Link>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}