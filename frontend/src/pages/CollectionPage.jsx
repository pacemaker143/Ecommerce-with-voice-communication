import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaFilter, FaTimes } from "react-icons/fa";
import FilterSidebar from "../components/Product/FilterSidebar";
import SortOptions from "../components/Product/SortOptions";
import ProductGrid from "../components/Product/ProductGrid";
import { fetchProducts } from "../Redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar (safe functional update)
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close sidebar when clicked outside
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  // Add + Cleanup event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent background scroll when sidebar open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  // Fetch products from API based on URL params and collection
  useEffect(() => {
    const filters = Object.fromEntries(searchParams.entries());

    // Map collection param to appropriate filter
    if (collection && collection !== "all") {
      // collection could be "men", "women", "top-wear", "bottom-wear"
      const lowerCollection = collection.toLowerCase();
      if (lowerCollection === "men" || lowerCollection === "women" || lowerCollection === "unisex") {
        filters.gender = collection.charAt(0).toUpperCase() + collection.slice(1);
      } else if (lowerCollection === "top-wear") {
        filters.category = "Top Wear";
      } else if (lowerCollection === "bottom-wear") {
        filters.category = "Bottom Wear";
      } else {
        filters.collection = collection;
      }
    }

    dispatch(fetchProducts(filters));
  }, [dispatch, collection, searchParams]);

  return (
    <div className="min-h-screen bg-comic-cream">
      {/* Mobile Filter Button */}
      <div className="lg:hidden p-4">
        <button
          onClick={toggleSidebar}
          className="comic-btn-primary flex items-center gap-2"
        >
          <FaFilter />
          Filters
        </button>
      </div>

      <div className="flex">
        {/* Overlay (Mobile Only) */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-comic-dark/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-72 bg-white border-r-3 border-comic-dark shadow-comic-lg lg:shadow-comic z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          {/* Close button (mobile only) */}
          <div className="lg:hidden flex justify-between items-center p-4 border-b-3 border-comic-dark bg-comic-yellow">
            <h3 className="font-comic text-lg tracking-wider text-comic-dark">Filters</h3>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 hover:bg-comic-red/20 rounded-lg transition"
            >
              <FaTimes className="text-comic-dark" />
            </button>
          </div>

          {/* Desktop heading */}
          <div className="hidden lg:block p-4 border-b-3 border-comic-dark bg-comic-yellow/30">
            <h3 className="font-comic text-xl tracking-wider text-comic-dark">⚡ Filters</h3>
          </div>

          <div className="p-4">
            <FilterSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <h2 className="font-comic text-2xl sm:text-3xl md:text-4xl tracking-wider text-comic-dark uppercase mb-4 sm:mb-6 animate-slide-right">
            {collection ? collection : "All Collection"}
            <div className="h-1.5 w-24 bg-gradient-to-r from-comic-red via-comic-yellow to-comic-cyan rounded-full mt-2" />
          </h2>

          {/* Sort Options */}
          <div className="mb-6">
            <SortOptions />
          </div>

          {/* Product Grid */}
          {loading ? (
            <p className="text-center font-comic text-xl text-comic-dark/60 col-span-full animate-pulse">
              Loading products...
            </p>
          ) : error ? (
            <p className="text-center font-comic text-xl text-comic-red col-span-full">
              {error}
            </p>
          ) : (
            <div className="animate-fade-in">
              <ProductGrid products={products} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
