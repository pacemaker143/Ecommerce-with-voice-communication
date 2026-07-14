import React, { useState } from "react";
import { IoLogoInstagram } from "react-icons/io5";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await API.post("/api/subscribe", { email });
      toast.success("Subscribed successfully! Check your inbox for 10% off.");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-comic-dark text-white border-t-3 border-comic-yellow">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-x-16 gap-y-12 px-6 lg:px-0 py-16">

        {/* Newsletter */}
        <div>
          <h3 className="text-2xl font-comic text-comic-yellow mb-4 tracking-wider">
            ⚡ Stay in the loop
          </h3>

          <p className="text-sm leading-relaxed text-gray-300 mb-4 font-body">
            Be the first to know about new collections, exclusive offers,
            and upcoming sales.
          </p>

          <p className="text-sm font-body text-gray-300 mb-6">
            Sign up & get <span className="font-comic text-comic-yellow text-lg">10% OFF</span> your first order
          </p>

          <form className="flex max-w-md flex-col sm:flex-row gap-2 sm:gap-0" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-sm border-3 border-comic-yellow sm:rounded-r-none rounded-xl focus:outline-none focus:ring-2 focus:ring-comic-cyan bg-comic-dark text-white font-body"
              required
            />
            <button
              type="submit"
              disabled={subscribing}
              className="bg-comic-yellow text-comic-dark px-6 py-3 text-sm font-comic sm:rounded-l-none rounded-xl border-3 border-comic-yellow hover:bg-yellow-300 transition-all disabled:opacity-50 tracking-wider"
            >
              {subscribing ? "..." : "GO!"}
            </button>
          </form>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-comic text-comic-cyan mb-5 text-lg tracking-wider">Shop</h4>
          <ul className="space-y-3 text-sm font-body">
            {[
              { label: "Men", to: "/collections/men" },
              { label: "Women", to: "/collections/women" },
              { label: "Top Wear", to: "/collections/top-wear" },
              { label: "Bottom Wear", to: "/collections/bottom-wear" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="text-gray-300 hover:text-comic-yellow transition hover:translate-x-2 inline-block"
                >
                  → {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-comic text-comic-cyan mb-5 text-lg tracking-wider">Support</h4>
          <ul className="space-y-3 text-sm font-body">
            {["Contact", "About Us", "FAQs", "Features"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-gray-300 hover:text-comic-yellow transition hover:translate-x-2 inline-block"
                >
                  → {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-comic text-comic-cyan mb-5 text-lg tracking-wider">Company</h4>

          <div className="flex items-center space-x-4 mb-6">
            {[
              { icon: TbBrandMeta, link: "https://www.facebook.com" },
              { icon: IoLogoInstagram, link: "https://www.instagram.com" },
              { icon: RiTwitterXLine, link: "https://www.twitter.com" },
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-comic-dark border-2 border-comic-yellow text-comic-yellow hover:bg-comic-yellow hover:text-comic-dark transition-all hover:scale-110"
                >
                  <IconComponent className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          <p className="flex items-center text-sm text-gray-300 font-body">
            <FiPhoneCall className="h-5 w-5 text-comic-yellow mr-2" />
            +1 (555) 123-4567
          </p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-700">
        <p className="text-center text-sm text-gray-400 py-6 font-body">
          © {new Date().getFullYear()} <span className="font-comic text-comic-yellow">Rabbit Comics Store</span>. All rights reserved. 🐰
        </p>
      </div>
    </footer>
  );
};

export default Footer;
