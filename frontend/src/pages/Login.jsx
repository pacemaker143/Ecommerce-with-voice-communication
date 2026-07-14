import React, { useEffect } from "react";
import login from "../assets/login.webp";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../Redux/slices/authSlice";
import { mergeCart } from "../Redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const redirect = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user) {
      dispatch(mergeCart());
      navigate(redirect, { replace: true });
    }
  }, [user, navigate, redirect, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="flex min-h-screen bg-comic-cream font-body">
      {/* Left Form Section */}
      <div className="w-full md:w-3/5 flex flex-col justify-center items-center p-4 sm:p-8 md:p-16 relative overflow-hidden">
        {/* Decorative background dots */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #1a1a2e 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

        <form
          onSubmit={handleSubmit}
          className="comic-panel w-full max-w-lg lg:max-w-xl p-6 sm:p-10 animate-pop-in relative z-10"
        >
          <div className="flex justify-center mb-6">
            <h2 className="font-comic text-3xl text-comic-dark tracking-wide transform -rotate-2">
              🐰 Rabit
            </h2>
          </div>

          <h2 className="comic-heading text-3xl text-center mb-2 text-comic-dark transform rotate-1">
            Hey, there 👋
          </h2>
          <p className="text-center mb-8 text-gray-600 text-sm font-body">
            Enter your username and password to login
          </p>

          <div className="mb-5">
            <label className="block text-sm font-bold mb-2 text-comic-dark font-comic">
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(el) => setEmail(el.target.value)}
              className="comic-input w-full"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold mb-2 text-comic-dark font-comic">
              🔒 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(el) => setPassword(el.target.value)}
              className="comic-input w-full"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn-primary w-full py-3 text-lg font-comic disabled:opacity-50"
          >
            {loading ? "⚡ Signing in..." : "🚀 Sign in!"}
          </button>

          <p className="mt-6 text-center text-sm font-body text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-comic-blue font-bold font-comic hover:text-comic-red transition-colors"
            >
              Register 👉
            </Link>
          </p>
        </form>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex w-2/5 border-l-4 border-comic-dark relative overflow-hidden">
        <img
          src={login}
          alt="Login to Account"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-comic-blue/10" />
      </div>
    </div>
  );
};

export default Login;
