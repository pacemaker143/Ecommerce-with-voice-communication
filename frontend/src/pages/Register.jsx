import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../Redux/slices/authSlice";
import { mergeCart } from "../Redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(mergeCart());
      navigate("/", { replace: true });
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
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
              🐰 Rabbit
            </h2>
          </div>

          <h2 className="comic-heading text-3xl text-center mb-2 text-comic-dark transform rotate-1">
            Create account 🎉
          </h2>
          <p className="text-center mb-8 text-gray-600 text-sm font-body">
            Enter your details to create a new account
          </p>

          <div className="mb-5">
            <label className="block text-sm font-bold mb-2 text-comic-dark font-comic">
              🙋 Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(el) => setName(el.target.value)}
              className="comic-input w-full"
              placeholder="Enter your name"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="comic-btn-primary w-full py-3 text-lg font-comic disabled:opacity-50"
          >
            {loading ? "⚡ Creating account..." : "💪 Register!"}
          </button>

          <p className="mt-6 text-center text-sm font-body text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-comic-blue font-bold font-comic hover:text-comic-red transition-colors"
            >
              Login 👈
            </Link>
          </p>
        </form>
      </div>

      {/* Right Image Section */}
      <div className="hidden md:flex w-2/5 border-l-4 border-comic-dark relative overflow-hidden">
        <img
          src={register}
          alt="Register Account"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-comic-pink/10" />
      </div>
    </div>
  );
};

export default Register;
