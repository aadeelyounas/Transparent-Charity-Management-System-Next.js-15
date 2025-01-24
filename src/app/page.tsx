import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to Seri Ghanial
        </h1>
        <p className="text-xl mb-12">
          A transparent charity management system helping those in need
        </p>
        
        <div className="flex gap-8 justify-center">
          <Link
            href="/auth/signin"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-green-700 transition-colors"
          >
            View Dashboard
          </Link>
        </div>

        <div className="mt-16 text-gray-600">
          <p className="mb-4">
            Seri Ghanial is committed to transparency and efficiency in charity management.
          </p>
          <p>
            Every donation makes a difference. Join us in making the world a better place.
          </p>
        </div>
      </div>
    </main>
  );
}
