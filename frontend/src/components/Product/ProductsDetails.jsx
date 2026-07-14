import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchProductById,
  fetchSimilarProducts,
  clearSelectedProduct,
} from "../../Redux/slices/productSlice";
import { addToCart } from "../../Redux/slices/cartSlice";
import ProductGrid from "./ProductGrid";

const ProductsDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, similarProducts, loading, error } = useSelector(
    (state) => state.products
  );

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchSimilarProducts(id));
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.images?.[0]?.url) {
      setMainImage(product.images[0].url);
    }
    if (product?.sizes?.length) setSelectedSize(product.sizes[0]);
    if (product?.colors?.length) setSelectedColor(product.colors[0]);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    dispatch(
      addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
      })
    )
      .unwrap()
      .then(() => toast.success("Added to cart!"))
      .catch((err) => toast.error(err));
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-comic-cream"><p className="font-comic text-xl text-comic-dark animate-bounce-slow">⏳ Loading...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-comic-cream"><p className="font-comic text-comic-red text-xl">💥 {error}</p></div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center min-h-screen bg-comic-cream"><p className="font-comic text-xl text-comic-dark">🔍 Product Not Found</p></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 bg-comic-cream min-h-screen font-body">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 animate-fade-in">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          <div className="mb-4 comic-panel overflow-hidden">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-[320px] sm:h-[420px] md:h-[500px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={img.altText || product.name}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-3 transition-all hover:scale-110 ${
                  mainImage === img.url ? "border-comic-yellow shadow-comic-yellow" : "border-comic-dark/30 hover:border-comic-cyan"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 animate-slide-right">
          <h1 className="comic-heading text-2xl sm:text-3xl mb-2 text-comic-dark">{product.name}</h1>

          {product.brand && (
            <p className="text-sm text-gray-500 mb-4 font-body">Brand: <span className="font-bold text-comic-blue">{product.brand}</span></p>
          )}

          <div className="flex items-center gap-3 mb-4">
            <span className="font-comic text-3xl text-comic-green">${product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through font-body">
                ${product.originalPrice}
              </span>
            )}
            {product.originalPrice && (
              <span className="comic-badge bg-comic-red text-white text-sm px-3 py-1 transform -rotate-3">
                💥 {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6 font-body leading-relaxed">{product.description}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-comic text-comic-dark text-lg mb-2">📏 Size</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-3 rounded-lg font-comic transition-all hover:scale-105 ${
                      selectedSize === size
                        ? "bg-comic-yellow text-comic-dark border-comic-dark shadow-comic"
                        : "border-comic-dark/30 hover:border-comic-yellow hover:bg-comic-yellow/20"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-5">
              <h3 className="font-comic text-comic-dark text-lg mb-2">🎨 Color</h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-3 rounded-lg font-comic transition-all hover:scale-105 ${
                      selectedColor === color
                        ? "bg-comic-cyan text-white border-comic-dark shadow-comic"
                        : "border-comic-dark/30 hover:border-comic-cyan hover:bg-comic-cyan/20"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-comic text-comic-dark text-lg mb-2">🔢 Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 bg-comic-yellow border-3 border-comic-dark rounded-l-lg hover:bg-yellow-400 transition font-bold text-lg"
              >
                -
              </button>
              <span className="w-14 h-10 flex items-center justify-center border-y-3 border-comic-dark font-comic text-lg bg-white">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 bg-comic-yellow border-3 border-comic-dark rounded-r-lg hover:bg-yellow-400 transition font-bold text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="comic-btn-primary w-full py-4 text-xl font-comic tracking-wide hover:scale-[1.02] transition-transform"
          >
            🛒 Add to Cart!
          </button>

          {/* Additional Info */}
          <div className="mt-6 comic-panel p-4 space-y-2 text-sm font-body">
            {product.material && <p><span className="font-bold text-comic-dark">🧵 Material:</span> {product.material}</p>}
            {product.gender && <p><span className="font-bold text-comic-dark">👤 Gender:</span> {product.gender}</p>}
            {product.category && <p><span className="font-bold text-comic-dark">📂 Category:</span> {product.category}</p>}
            {product.sku && <p><span className="font-bold text-comic-dark">🏷️ SKU:</span> {product.sku}</p>}
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts?.length > 0 && (
        <div className="mt-16">
          <h2 className="comic-heading text-2xl text-comic-dark mb-6 inline-block bg-comic-pink text-white px-4 py-2 transform -rotate-1">🔥 You May Also Like</h2>
          <ProductGrid products={similarProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductsDetails;
