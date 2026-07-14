import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <p className="text-center font-comic text-xl text-comic-dark animate-pop-in">
        No products found!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {products.map((product, index) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="block group"
        >
          <div
            className="comic-card p-3 transition-all duration-300 hover:scale-105 hover:shadow-comic-xl animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="relative overflow-hidden rounded-lg border-2 border-comic-dark">
              <img
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.images?.[0]?.altText || product.name}
                className="w-full h-40 sm:h-48 md:h-52 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2">
                <span className="comic-badge bg-comic-yellow text-comic-dark shadow-comic">
                  NEW!
                </span>
              </div>
            </div>

            <div className="pt-3 pb-1 px-1">
              <h2 className="font-comic text-sm sm:text-lg tracking-wide text-comic-dark mb-1 truncate">
                {product.name}
              </h2>

              {product.originalPrice && (
                <p className="text-comic-red/60 line-through text-sm font-body">
                  ${product.originalPrice}
                </p>
              )}

              <p className="text-xl sm:text-2xl font-comic text-comic-red">
                ${product.price}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
