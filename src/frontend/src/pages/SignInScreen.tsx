import { useState } from "react";
import homescreenBackground from "../assets/HomescreenBackground.jpg";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";

export default function SignInScreen() {
  const { login, auth } = useAuth();
  const [loginMode, setLoginMode] = useState<"operator" | "admin">("operator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email/ID and password");
      return;
    }
    setIsLoggingIn(true);
    setError("");
    try {
      await login({ username: email, password, badge: email });
    } catch (err: any) {
      setError(err.message || "Login failed.");
      setIsLoggingIn(false);
    }
  };

  if (auth) return null;

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${homescreenBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/50 backdrop-blur-[2px]" />
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-card/95 backdrop-blur-xl shadow-2xl border-2">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/40 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Ramp Track</CardTitle>
            <CardDescription className="text-base">
              Airport Ground Equipment Tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Button
                data-ocid="signin.operator.button"
                variant={loginMode === "operator" ? "default" : "outline"}
                onClick={() => {
                  setLoginMode("operator");
                  setEmail("operator@demo.com");
                  setPassword("test123");
                  setError("");
                }}
                disabled={isLoggingIn}
                className="h-auto py-4 flex flex-col gap-2"
              >
                <span className="text-2xl">👤</span>
                <span className="text-sm font-semibold">Operator</span>
              </Button>
              <Button
                data-ocid="signin.admin.button"
                variant={loginMode === "admin" ? "default" : "outline"}
                onClick={() => {
                  setLoginMode("admin");
                  setEmail("970251");
                  setPassword("test123");
                  setError("");
                }}
                disabled={isLoggingIn}
                className="h-auto py-4 flex flex-col gap-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white border-orange-400/50"
              >
                <span className="text-2xl">🛡️</span>
                <span className="text-sm font-semibold">Management</span>
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  {loginMode === "operator" ? "Email" : "Employee ID"}
                </Label>
                <Input
                  data-ocid="signin.email.input"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoggingIn}
                  placeholder={
                    loginMode === "operator" ? "operator@demo.com" : "970251"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  data-ocid="signin.password.input"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                  placeholder="test123"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              {error && (
                <div
                  data-ocid="signin.error_state"
                  className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 p-3 rounded-lg"
                >
                  {error}
                </div>
              )}
              <Button
                data-ocid="signin.submit_button"
                className="w-full"
                size="lg"
                onClick={handleLogin}
                disabled={isLoggingIn || !email || !password}
              >
                {isLoggingIn ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Logging in...
                  </>
                ) : (
                  <>
                    {loginMode === "operator"
                      ? "👤 Operator Login"
                      : "🛡️ Management Login"}
                  </>
                )}
              </Button>
            </div>
            <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p className="font-mono text-xs">
                Operator: operator@demo.com / test123
              </p>
              <p className="font-mono text-xs mt-1">
                Management: 970251 / test123
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-sm text-white/90 drop-shadow-lg">
          © Jayson James & Ramp Track Systems
        </div>
      </div>
    </div>
  );
}
