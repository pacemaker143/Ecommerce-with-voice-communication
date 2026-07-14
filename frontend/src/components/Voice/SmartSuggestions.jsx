import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addShoppingItem } from "../../Redux/slices/voiceSlice";
import { toast } from "sonner";

// Seasonal suggestions based on current month
const getSeasonalSuggestions = () => {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4)  // Spring: Mar-May
    return [
      { name: "Light Jacket", category: "Clothing", reason: "🌸 Spring season" },
      { name: "Rain Coat", category: "Clothing", reason: "🌧️ Rainy season" },
      { name: "Floral Dress", category: "Clothing", reason: "🌸 Spring fashion" },
    ];
  if (month >= 5 && month <= 7)  // Summer: Jun-Aug
    return [
      { name: "Shorts", category: "Clothing", reason: "☀️ Summer essentials" },
      { name: "Sunglasses", category: "Accessories", reason: "☀️ Sun protection" },
      { name: "Swimwear", category: "Clothing", reason: "🏖️ Beach ready" },
    ];
  if (month >= 8 && month <= 10) // Fall: Sep-Nov
    return [
      { name: "Sweater", category: "Clothing", reason: "🍂 Fall weather" },
      { name: "Hoodie", category: "Clothing", reason: "🍂 Cozy season" },
      { name: "Boots", category: "Footwear", reason: "🍁 Fall style" },
    ];
  // Winter: Dec-Feb
  return [
    { name: "Winter Coat", category: "Clothing", reason: "❄️ Winter essentials" },
    { name: "Thermal Shirt", category: "Clothing", reason: "🧣 Stay warm" },
    { name: "Woolen Socks", category: "Clothing", reason: "❄️ Cold weather" },
  ];
};

// Derive recommendations from cart history
const getCartBasedSuggestions = (cartProducts) => {
  if (!cartProducts?.length) return [];
  const suggestions = [];
  const names = cartProducts.map((p) => p.name?.toLowerCase() || "");

  // Simple co-purchase patterns
  if (names.some((n) => n.includes("shirt") || n.includes("top")))
    suggestions.push({ name: "Belt", category: "Accessories", reason: "👔 Goes with your tops" });
  if (names.some((n) => n.includes("pant") || n.includes("jean") || n.includes("bottom")))
    suggestions.push({ name: "Sneakers", category: "Footwear", reason: "👖 Complete the look" });
  if (names.some((n) => n.includes("dress")))
    suggestions.push({ name: "Heels", category: "Footwear", reason: "👗 Match your dress" });
  if (names.some((n) => n.includes("jacket") || n.includes("coat")))
    suggestions.push({ name: "Scarf", category: "Accessories", reason: "🧥 Layer it up" });

  return suggestions.slice(0, 3);
};

const SmartSuggestions = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((s) => s.cart);
  const { shoppingList } = useSelector((s) => s.voice);
  const { products } = useSelector((s) => s.products);

  const cartProducts = cart?.products || [];
  const seasonal = useMemo(() => getSeasonalSuggestions(), []);
  const cartBased = useMemo(() => getCartBasedSuggestions(cartProducts), [cartProducts]);

  // Products you haven't bought yet that are popular / featured
  const productRecs = useMemo(() => {
    const listNames = shoppingList.map((i) => i.name.toLowerCase());
    return products
      .filter((p) => p.isFeatured && !listNames.includes(p.name.toLowerCase()))
      .slice(0, 4);
  }, [products, shoppingList]);

  const handleAddToList = (name, category) => {
    dispatch(addShoppingItem({ name, quantity: 1 }));
    toast.success(`✅ Added "${name}" to shopping list`);
  };

  const isEmpty = !seasonal.length && !cartBased.length && !productRecs.length;
  if (isEmpty) return null;

  return (
    <div className="space-y-6">
      {/* Cart-based recommendations */}
      {cartBased.length > 0 && (
        <div>
          <h3 className="font-comic text-base text-comic-dark mb-3 flex items-center gap-2">
            🛒 <span>Complete Your Look</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cartBased.map((item) => (
              <div
                key={item.name}
                className="comic-card p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-comic text-sm text-comic-dark">{item.name}</p>
                  <p className="text-xs text-comic-dark/50 font-body">{item.reason}</p>
                </div>
                <button
                  onClick={() => handleAddToList(item.name, item.category)}
                  className="comic-btn bg-comic-yellow text-comic-dark border-2 border-comic-dark px-2 py-1 text-xs rounded-lg flex-shrink-0 hover:scale-105 transition-transform"
                >
                  + List
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal recommendations */}
      <div>
        <h3 className="font-comic text-base text-comic-dark mb-3 flex items-center gap-2">
          🌟 <span>Seasonal Picks</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {seasonal.map((item) => (
            <div
              key={item.name}
              className="comic-card p-3 bg-comic-yellow/10 flex items-center justify-between gap-2"
            >
              <div>
                <p className="font-comic text-sm text-comic-dark">{item.name}</p>
                <p className="text-xs text-comic-dark/50 font-body">{item.reason}</p>
              </div>
              <button
                onClick={() => handleAddToList(item.name, item.category)}
                className="comic-btn bg-comic-cyan text-comic-dark border-2 border-comic-dark px-2 py-1 text-xs rounded-lg flex-shrink-0 hover:scale-105 transition-transform"
              >
                + List
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Featured product recommendations */}
      {productRecs.length > 0 && (
        <div>
          <h3 className="font-comic text-base text-comic-dark mb-3 flex items-center gap-2">
            🔥 <span>You Might Like</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {productRecs.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="comic-card p-2 group hover:scale-105 transition-transform"
              >
                <img
                  src={p.images?.[0]?.url}
                  alt={p.name}
                  className="w-full h-28 object-cover rounded-lg border-2 border-comic-dark/20 mb-2"
                />
                <p className="font-comic text-xs text-comic-dark truncate">{p.name}</p>
                <p className="font-comic text-comic-green text-sm">${p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
