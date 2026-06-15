/**
 * Account registration page. Validates passwords, creates a new user via
 * Supabase auth, and redirects to the home page on success.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import AuthShell from "../components/common/AuthShell.jsx";

const INPUT_CLASS =
  "w-full px-4 py-3 rounded-md bg-asphalt-50 text-asphalt-900 placeholder:text-asphalt-400 border-2 border-asphalt-200 transition-colors duration-base ease-snap focus:outline-none focus:border-race-500 focus:bg-white";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      setLoading(false);
      return;
    }
    const { error } = await signUp(email, password);
    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({
        type: "success",
        text: "Account created. Redirecting…",
      });
      setTimeout(() => navigate("/"), 1200);
    }
    setLoading(false);
  };

  return (
    <AuthShell>
      <div className="bg-chalk rounded-lg shadow-lift border border-asphalt-200 overflow-hidden">
        <div className="px-8 pt-8 pb-2 text-center">
          <h1 className="font-display text-3xl tracking-tight text-asphalt-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-asphalt-600">
            Track orders, save event bookings, and check in faster.
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${INPUT_CLASS} pr-12`}
                  placeholder="At least 6 characters"
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
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs uppercase tracking-widest font-display text-asphalt-700 mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${INPUT_CLASS} pr-12`}
                  placeholder="Re-type your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-asphalt-400 hover:text-race-600 transition-colors duration-base ease-snap"
                >
                  {showConfirmPassword ? (
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
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-asphalt-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-race-600 hover:text-race-700 font-semibold transition-colors duration-base ease-snap"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
};

export default SignupPage;
