import React from "react";
import mensCollection from "../../assets/mens-collection.webp";
import womensCollection from "../../assets/womens-collection.webp";
import { Link } from "react-router-dom";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0 bg-comic-cream">
      <div className="container mx-auto flex flex-col md:flex-row gap-10">
        {/* Womens Collection */}
        <div className="relative flex-1 group animate-slide-up">
          <div className="comic-panel p-0 overflow-hidden hover:shadow-comic-xl transition-all duration-300">
            <div className="relative overflow-hidden">
              <img
                src={womensCollection}
                alt="Women's Collection"
                className="w-full h-[400px] sm:h-[550px] md:h-[700px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-comic-dark/70 via-transparent to-transparent" />
            </div>
            {/* Rotated KAPOW label */}
            <div className="absolute top-4 right-4 bg-comic-pink text-white font-comic text-base sm:text-xl px-3 py-1.5 sm:px-4 sm:py-2 border-3 border-comic-dark rounded-xl shadow-comic rotate-6 animate-wiggle">
              KAPOW!
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-comic-yellow border-t-4 border-comic-dark p-4 sm:p-6">
              <h2 className="font-comic text-2xl sm:text-3xl tracking-wider text-comic-dark mb-2">
                Women's Collection
              </h2>
              <Link
                to="/collections/all?gender=Women"
                className="comic-btn-primary inline-block text-base"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>

        {/* Mens Collection*/}
        <div className="relative flex-1 group animate-slide-up" style={{ animationDelay: "150ms" }}>
          <div className="comic-panel p-0 overflow-hidden hover:shadow-comic-xl transition-all duration-300">
            <div className="relative overflow-hidden">
              <img
                src={mensCollection}
                alt="Men's Collection"
                className="w-full h-[400px] sm:h-[550px] md:h-[700px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-comic-dark/70 via-transparent to-transparent" />
            </div>
            {/* Rotated BAM label */}
            <div className="absolute top-4 right-4 bg-comic-cyan text-comic-dark font-comic text-base sm:text-xl px-3 py-1.5 sm:px-4 sm:py-2 border-3 border-comic-dark rounded-xl shadow-comic -rotate-6 animate-wiggle">
              BAM!
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-comic-cyan border-t-4 border-comic-dark p-4 sm:p-6">
              <h2 className="font-comic text-2xl sm:text-3xl tracking-wider text-comic-dark mb-2">
                Men's Collection
              </h2>
              <Link
                to="/collections/all?gender=Men"
                className="comic-btn-dark inline-block text-base"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
