import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addShoppingItem, markInCart } from "../../Redux/slices/voiceSlice";
import { addToCart } from "../../Redux/slices/cartSlice";
import { toast } from "sonner";

// Seasonal suggestions based on current month
const getSeasonalSuggestions = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4)
    return [
      { name: "Light Jacket", category: "Clothing", reason: "🌸 Spring season" },
      { name: "Rain Coat",    category: "Clothing", reason: "🌧️ Rainy season" },
      { name: "Floral Dress", category: "Clothing", reason: "🌸 Spring fashion" },
    ];
  if (month >= 5 && month <= 7)
    return [
      { name: "Shorts",    category: "Clothing",     reason: "☀️ Summer essentials" },
      { name: "Swimwear",  category: "Clothing",     reason: "🏖️ Beach ready" },
    ];
  if (month >= 8 && month <= 10)
    return [
      { name: "Sweater", category: "Clothing", reason: "🍂 Fall weather" },
      { name: "Hoodie",  category: "Clothing", reason: "🍂 Cozy season" },
      { name: "Boots",   category: "Footwear", reason: "🍁 Fall style" },
    ];
  return [
    { name: "Winter Coat",   category: "Clothing", reason: "❄️ Winter essentials" },
    { name: "Thermal Shirt", category: "Clothing", reason: "🧣 Stay warm" },
    { name: "Woolen Socks",  category: "Clothing", reason: "❄️ Cold weather" },
  ];
};

const getCartBasedSuggestions = (cartProducts) => {
  if (!cartProducts?.length) return [];
  const suggestions = [];
  const names = cartProducts.map((p) => p.name?.toLowerCase() || "");
  if (names.some((n) => n.includes("shirt") || n.includes("top")))
    suggestions.push({ name: "Belt",     category: "Accessories", reason: "👔 Goes with your tops" });
  if (names.some((n) => n.includes("pant") || n.includes("jean") || n.includes("bottom")))
    suggestions.push({ name: "Sneakers", category: "Footwear",    reason: "👖 Complete the look" });
  if (names.some((n) => n.includes("dress")))
    suggestions.push({ name: "Heels",    category: "Footwear",    reason: "👗 Match your dress" });
  if (names.some((n) => n.includes("jacket") || n.includes("coat")))
    suggestions.push({ name: "Scarf",    category: "Accessories", reason: "🧥 Layer it up" });
  return suggestions.slice(0, 3);
};

const SmartSuggestions = () => {
  const dispatch = useDispatch();
  const { cart }         = useSelector((s) => s.cart);
  const { shoppingList } = useSelector((s) => s.voice);
  const { products }     = useSelector((s) => s.products);

  const cartProducts = cart?.products || [];
  const seasonal  = useMemo(() => getSeasonalSuggestions(), []);
  const cartBased = useMemo(() => getCartBasedSuggestions(cartProducts), [cartProducts]);

  const productRecs = useMemo(() => {
    const listNames = shoppingList.map((i) => i.name.toLowerCase());
    return products
      .filter((p) => p.isFeatured && !listNames.includes(p.name.toLowerCase()))
      .slice(0, 4);
  }, [products, shoppingList]);

  // Save to list
  const handleSave = (name) => {
    dispatch(addShoppingItem({ name, quantity: 1 }));
    toast.success(`📋 "${name}" saved to list`);
  };

  // Add straight to real cart (search catalog by name)
  const handleAddToCart = async (name) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9000";
      const res = await fetch(
        `${backendUrl}/api/products?search=${encodeURIComponent(name)}&limit=1`
      );
      const data = await res.json();
      const match = Array.isArray(data) ? data[0] : null;
      if (match) {
        await dispatch(
          addToCart({
            productId: match._id,
            quantity: 1,
            size:  match.sizes?.[0]  || "M",
            color: match.colors?.[0] || "Default",
          })
        ).unwrap();
        dispatch(markInCart(name));
        toast.success(`🛒 "${name}" added to cart!`);
      } else {
        // Fall back: save to list
        dispatch(addShoppingItem({ name, quantity: 1 }));
        toast.info(`📋 "${name}" saved to list (not found in catalog)`);
      }
    } catch {
      toast.error(`Failed to add "${name}" to cart`);
    }
  };

  const isEmpty = !seasonal.length && !cartBased.length && !productRecs.length;
  if (isEmpty) return null;

  const SuggestionCard = ({ item }) => (
    <div className="comic-card p-3 flex flex-col gap-2">
      <div>
        <p className="font-comic text-sm text-comic-dark">{item.name}</p>
        <p className="text-xs text-comic-dark/50 font-body">{item.reason}</p>
      </div>
      <div className="flex gap-1.5">
        <button
          onClick={() => handleSave(item.name)}
          className="flex-1 comic-btn bg-white text-comic-dark border-2 border-comic-dark/40 px-2 py-1 text-xs rounded-lg hover:border-comic-yellow hover:bg-comic-yellow/20 transition-all font-comic"
        >
          💾 Save
        </button>
        <button
          onClick={() => handleAddToCart(item.name)}
          className="flex-1 comic-btn bg-comic-dark text-comic-yellow border-2 border-comic-dark px-2 py-1 text-xs rounded-lg hover:bg-gray-800 transition-all font-comic"
        >
          🛒 Cart
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cart-based */}
      {cartBased.length > 0 && (
        <div>
          <h3 className="font-comic text-base text-comic-dark mb-3 flex items-center gap-2">
            🛒 Complete Your Look
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {cartBased.map((item) => <SuggestionCard key={item.name} item={item} />)}
          </div>
        </div>
      )}

      {/* Seasonal */}
      <div>
        <h3 className="font-comic text-base text-comic-dark mb-3 flex items-center gap-2">
          🌟 Seasonal Picks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {seasonal.map((item) => (
            <div key={item.name} className="comic-card p-3 bg-comic-yellow/10 flex flex-col gap-2">
              <div>
                <p className="font-comic text-sm text-comic-dark">{item.name}</p>
                <p className="text-xs text-comic-dark/50 font-body">{item.reason}</p>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleSave(item.name)}
                  className="flex-1 comic-btn bg-white text-comic-dark border-2 border-comic-dark/40 px-2 py-1 text-xs rounded-lg hover:bg-comic-yellow/30 transition-all font-comic"
                >
                  💾 Save
                </button>
                <button
                  onClick={() => handleAddToCart(item.name)}
                  className="flex-1 comic-btn bg-comic-dark text-comic-yellow border-2 border-comic-dark px-2 py-1 text-xs rounded-lg hover:bg-gray-800 transition-all font-comic"
                >
                  🛒 Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured product recs */}
      {productRecs.length > 0 && (
        <div>
          <h3 className="font-comic text-base text-comic-dark mb-3 flex items-center gap-2">
            🔥 You Might Like
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {productRecs.map((p) => (
              <div key={p._id} className="comic-card p-2 flex flex-col gap-2">
                <Link to={`/product/${p._id}`}>
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                    className="w-full h-28 object-cover rounded-lg border-2 border-comic-dark/20"
                  />
                  <p className="font-comic text-xs text-comic-dark truncate mt-1">{p.name}</p>
                  <p className="font-comic text-comic-green text-sm">${p.price}</p>
                </Link>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSave(p.name)}
                    className="flex-1 text-xs font-comic border-2 border-comic-dark/30 rounded-lg py-1 hover:bg-comic-yellow/30 transition-all"
                  >
                    💾
                  </button>
                  <button
                    onClick={() =>
                      dispatch(addToCart({ productId: p._id, quantity: 1, size: p.sizes?.[0] || "M", color: p.colors?.[0] || "Default" }))
                        .unwrap()
                        .then(() => toast.success(`🛒 "${p.name}" added!`))
                        .catch(() => toast.error("Add to cart failed"))
                    }
                    className="flex-1 text-xs font-comic bg-comic-dark text-comic-yellow border-2 border-comic-dark rounded-lg py-1 hover:bg-gray-800 transition-all"
                  >
                    🛒
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSuggestions;
