import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { useToast } from "./hooks/use-toast";

export function SignInForm() {
  const [isSignIn, setIsSignIn] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const signIn = useAction(api.auth.signIn);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      await signIn({ 
        provider: "email",
        params: { 
          email: `${username}@chat.app`, 
          password,
          ...(isSignIn ? {} : { mode: "signup" })
        }
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
    <div className="relative overflow-hidden rounded-2xl bg-gray-900/80 backdrop-blur-sm shadow-xl transition-all duration-300 hover:shadow-2xl border border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-teal-500/10 animate-gradient" />
      <form onSubmit={handleSubmit} className="relative p-8 space-y-6">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {isSignIn ? "مرحباً بعودتك" : "إنشاء حساب جديد"}
          </h3>
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
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
          </div>

          <div className="relative group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white"
              placeholder="كلمة المرور"
              dir="rtl"
              required
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        >
          {isSignIn ? "تسجيل الدخول" : "إنشاء حساب"}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
          >
            {isSignIn ? "ليس لديك حساب؟ سجل الآن" : "لديك حساب؟ سجل دخولك"}
          </button>
        </div>
      </form>
    </div>
  );
}
