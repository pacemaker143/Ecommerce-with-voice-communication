import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Product/GenderCollectionSection";
import NewArrivals from "../components/Product/NewArrivals";
import ProductGrid from "../components/Product/ProductGrid";
import FeacturedCollection from "../components/Product/FeacturedCollection";
import FeacturesSection from "../components/Product/FeacturesSection";
import { fetchBestSellers, fetchProducts } from "../Redux/slices/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const { bestSellers, products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchBestSellers());
    dispatch(fetchProducts({ gender: "Women", category: "Top Wear", limit: 8 }));
  }, [dispatch]);

  return (
    <div className="bg-comic-cream">
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Sellers Section */}
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <span className="inline-block bg-comic-red text-white font-comic text-sm px-4 py-1 rounded-full border-2 border-comic-dark mb-3 animate-wiggle">🔥 HOT</span>
          <h2 className="text-4xl font-comic text-comic-dark">Best Sellers</h2>
        </div>
        {bestSellers.length > 0 ? (
          <ProductGrid products={bestSellers} />
        ) : (
          !loading && <p className="text-center text-comic-dark/50 font-body">No best sellers yet</p>
        )}
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <span className="inline-block bg-comic-pink text-white font-comic text-sm px-4 py-1 rounded-full border-2 border-comic-dark mb-3">👗 FOR HER</span>
          <h2 className="text-4xl font-comic text-comic-dark">
            Top Wears for Women
          </h2>
        </div>
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          !loading && <p className="text-center text-comic-dark/50 font-body">No products found</p>
        )}
      </div>

      <FeacturedCollection />
      <FeacturesSection />
    </div>
  );
};

export default Home;
