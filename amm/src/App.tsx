import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "./components/ui/toaster";
import { ProfileSetup } from "./ProfileSetup";
import { Dashboard } from "./Dashboard";

export default function App() {
  const profile = useQuery(api.users.getProfile);
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          دردشة
        </h2>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Authenticated>
            {profile === undefined ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : profile === null ? (
              <ProfileSetup />
            ) : (
              <Dashboard />
            )}
          </Authenticated>
          <Unauthenticated>
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  أهلاً بك في الدردشة
                </h1>
                <p className="text-xl text-gray-400">
                  سجل دخولك للبدء في الدردشة مع أصدقائك
                </p>
              </div>
              <SignInForm />
            </div>
          </Unauthenticated>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
