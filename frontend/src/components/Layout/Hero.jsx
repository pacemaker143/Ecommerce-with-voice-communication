import React from "react";
import { Link, Outlet } from "react-router-dom";
import heroImg from "../../assets/rabbit-hero.webp";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroImg}
        alt="Hero Image"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />
      {/* Comic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-comic-dark/80 via-comic-dark/30 to-transparent flex items-center justify-center">
        <div className="text-center p-6 animate-pop-in">
          {/* Comic speech bubble style heading */}
          <div className="inline-block bg-comic-yellow border-3 border-comic-dark rounded-2xl px-4 py-2 sm:px-8 sm:py-4 mb-4 sm:mb-6 shadow-comic-lg transform -rotate-2 hover:rotate-0 transition-transform">
            <h1 className="text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-comic tracking-wider text-comic-dark uppercase">
              Vacation
            </h1>
          </div>
          <p className="text-white text-xs sm:text-sm md:text-lg mb-6 sm:mb-8 font-body max-w-lg mx-auto animate-fade-in stagger-2 px-2">
            Explore our vacation ready Outfits with fast worldwide shipping!
          </p>
          <Link
            to="/collections/all"
            className="comic-btn-primary text-xl animate-fade-in stagger-3 inline-block"
          >
            🛍️ Shop Now
          </Link>
        </div>
      </div>
      
      {/* Decorative comic dots */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-comic-red rounded-full border-3 border-comic-dark opacity-80 animate-float"></div>
      <div className="absolute bottom-10 left-6 w-12 h-12 bg-comic-cyan rounded-full border-3 border-comic-dark opacity-80 animate-float stagger-3"></div>
    </section>
  );
};

export default Hero;
