import React from "react";
import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";


const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0 bg-comic-cream">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-stretch comic-panel overflow-hidden bg-comic-yellow/20 animate-fade-in">
        
        {/* Left Content */}
        <div className="lg:w-1/2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center text-center lg:text-left relative">
          {/* Decorative dots */}
          <div className="absolute top-4 left-4 w-24 h-24 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #1A1A2E 2px, transparent 2px)", backgroundSize: "12px 12px" }} />

          <span className="comic-badge bg-comic-pink text-white mb-4 self-start mx-auto lg:mx-0 animate-pop-in">
            ★ Comfort & Style ★
          </span>

          <h2 className="font-comic text-3xl sm:text-4xl lg:text-5xl tracking-wider text-comic-dark mb-4 sm:mb-6 leading-tight animate-slide-right">
            Apparel made for your everyday life
          </h2>

          <p className="text-base sm:text-lg font-body text-comic-dark/80 mb-6 sm:mb-8">
            Discover our collection of stylish and comfortable apparel designed
            to elevate your everyday wardrobe. From casual essentials to
            statement pieces, our clothing is crafted with quality materials and
            attention to detail, ensuring you look and feel your best every day.
          </p>

          {/* Starburst Shop Now button */}
          <div className="relative inline-block self-start mx-auto lg:mx-0">
            <div className="absolute -inset-3 bg-comic-red rounded-full opacity-20 animate-wiggle" />
            <Link
              to="/collections/all"
              className="comic-btn bg-comic-red text-white hover:bg-red-500 relative z-10 text-xl shadow-comic-red"
            >
              ⚡ Shop Now ⚡
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2 relative group overflow-hidden border-l-0 lg:border-l-4 border-comic-dark">
          <img
            src={featured}
            alt="Featured Collection"
            className="w-full h-full min-h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-comic-yellow/10" />
          {/* Floating badge */}
          <div className="absolute top-6 right-6 bg-comic-orange text-white font-comic text-lg px-4 py-2 border-3 border-comic-dark rounded-xl shadow-comic rotate-12 animate-float">
            HOT! 🔥
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollection;
