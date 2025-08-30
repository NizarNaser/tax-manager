"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to TaxManager</h1>

      {!session ? (
        <button
          onClick={() => signIn("google")}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
        >
          Login with Google
        </button>
      ) : !isAdmin ? (
        <p className="text-red-600 text-center max-w-md">
          يتعين عليكم التسجيل عند أدمين الموقع.
        </p>
      ) : (
        <>
          <p className="mb-4">Logged in as: {session.user.email}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
