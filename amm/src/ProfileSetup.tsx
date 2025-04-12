import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useToast } from "./hooks/use-toast";

export function ProfileSetup() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const { toast } = useToast();
  const createProfile = useMutation(api.users.createProfile);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await createProfile({
        username,
        displayName,
        bio,
        avatarUrl,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900/80 backdrop-blur-sm shadow-xl p-8 border border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 animate-gradient" />
        <form onSubmit={handleSubmit} className="relative space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              إكمال الملف الشخصي
            </h2>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
                placeholder="اسم المستخدم"
                dir="rtl"
                required
              />
            </div>

            <div className="relative group">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
                placeholder="الاسم المعروض"
                dir="rtl"
                required
              />
            </div>

            <div className="relative group">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
                placeholder="نبذة عنك"
                dir="rtl"
                rows={3}
              />
            </div>

            <div className="relative group">
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
                placeholder="رابط الصورة الشخصية"
                dir="rtl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            إنشاء الملف الشخصي
          </button>
        </form>
      </div>
    </div>
  );
}
