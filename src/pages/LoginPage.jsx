/**
 * Login page with email/password authentication. Redirects the user back to
 * their original destination (or home) after a successful sign-in.
 */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import Icon from "../components/common/Icon.jsx";
import AuthShell from "../components/common/AuthShell.jsx";

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-md bg-asphalt-50 text-asphalt-900 placeholder:text-asphalt-400 border-2 border-asphalt-200 transition-colors duration-base ease-snap focus:outline-none focus:border-race-500 focus:bg-white";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await signIn(email, password);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Successfully signed in." });
      setTimeout(() => navigate(from, { replace: true }), 800);
    }
    setLoading(false);
  };

  return (
    <AuthShell>
      <div className="bg-chalk rounded-lg shadow-lift border border-asphalt-200 overflow-hidden">
        <div className="px-8 pt-8 pb-2 text-center">
          <h1 className="font-display text-3xl tracking-tight text-asphalt-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-asphalt-600">
            Sign in to view orders & event bookings.
          </p>
        </div>
        <div className="p-8 pt-6">
          {message && (
            <div
              role="alert"
              className={`mb-5 p-4 rounded-md border-l-4 text-sm font-medium ${
                message.type === "error"
                  ? "bg-race-50 border-race-500 text-race-800"
                  : "bg-green-50 border-green-600 text-green-700"
              }`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-widest font-display text-asphalt-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-widest font-display text-asphalt-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${INPUT_CLASS} pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-asphalt-400 hover:text-race-600 transition-colors duration-base ease-snap"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-asphalt-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-race-600 hover:text-race-700 font-semibold transition-colors duration-base ease-snap"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};

export default LoginPage;
