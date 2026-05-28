import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await api.post("/users/auth/register", { name: username, email, password });
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main id="main-content" className="container flex items-center justify-center min-h-[calc(100svh-160px)] px-4 outline-none" tabIndex={-1}>
      <Card className="w-full max-w-[440px] border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-2xl overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.05] via-transparent to-cyan-500/[0.05] pointer-events-none" />
        <CardHeader className="space-y-3 pt-10 pb-8 px-8">
          <CardTitle className="text-4xl font-extrabold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Create account
          </CardTitle>
          <CardDescription className="text-center text-slate-400 text-base leading-relaxed">
            Join BriefNest today and start sharing
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="grid gap-6 px-8 py-4">
            {error && (
              <div 
                role="alert" 
                aria-live="polite"
                className="p-4 text-sm font-medium text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl animate-in fade-in slide-in-from-top-2"
              >
                {error}
              </div>
            )}
            <div className="grid gap-2.5">
              <Label htmlFor="username" className="text-sm font-semibold text-slate-200 ml-1">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={!!error}
                className="h-11 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-200 ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={!!error}
                className="h-11 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-200 ml-1">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-invalid={!!error}
                  aria-describedby="password-hint"
                  className="h-11 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-xl transition-all pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-lg"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <p id="password-hint" className="text-[10px] text-slate-500 ml-1">
                Minimum 8 characters with at least one number.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-6 pt-6 pb-10 px-8">
            <Button
              type="submit"
              className="w-full h-12 text-base font-bold bg-white text-black hover:bg-slate-200 transition-all duration-300 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Get Started"
              )}
            </Button>
            <p className="text-sm text-center text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="text-white font-semibold hover:text-purple-400 transition-colors underline-offset-4 hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
