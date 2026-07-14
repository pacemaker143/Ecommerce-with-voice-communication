import React from "react";
import { HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";

const FeaturesSection = () => {
  const features = [
    {
      icon: <HiArrowPathRoundedSquare className="text-3xl text-white" />,
      title: "Free International Shipping",
      desc: "On all orders over $100",
      bg: "bg-comic-cyan",
      shadow: "shadow-comic-cyan",
      badge: "🌍",
      delay: "0ms",
    },
    {
      icon: <HiShoppingBag className="text-3xl text-white" />,
      title: "Easy Shopping",
      desc: "Seamless browsing and quick checkout experience.",
      bg: "bg-comic-pink",
      shadow: "shadow-comic-red",
      badge: "🛍️",
      delay: "100ms",
    },
    {
      icon: <HiOutlineCreditCard className="text-3xl text-white" />,
      title: "Secure Checkout",
      desc: "100% Secured checkout Process",
      bg: "bg-comic-green",
      shadow: "shadow-comic",
      badge: "🔒",
      delay: "200ms",
    },
  ];

  return (
    <section className="py-16 px-4 bg-comic-cream">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {features.map((feat, index) => (
          <div
            key={index}
            className="comic-card p-6 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-slide-up"
            style={{ animationDelay: feat.delay }}
          >
            <div className={`p-5 rounded-xl ${feat.bg} border-3 border-comic-dark ${feat.shadow} mb-5 animate-float`}>
              {feat.icon}
            </div>
            <span className="text-2xl mb-2">{feat.badge}</span>
            <h3 className="font-comic text-xl tracking-wider text-comic-dark mb-2">
              {feat.title}
            </h3>
            <p className="font-body text-comic-dark/70 text-sm">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
