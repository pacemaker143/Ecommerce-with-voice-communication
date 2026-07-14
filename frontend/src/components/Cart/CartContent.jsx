import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, removeFromCart } from "../../Redux/slices/cartSlice";

const CartContent = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const cartProducts = cart?.products || [];

  const handleQuantityChange = (product, delta) => {
    const newQty = product.quantity + delta;
    if (newQty < 1) return;
    dispatch(
      updateCartItem({
        productId: product.product,
        quantity: newQty,
        size: product.size,
        color: product.color,
      })
    );
  };

  const handleRemove = (product) => {
    dispatch(
      removeFromCart({
        productId: product.product,
        size: product.size,
        color: product.color,
      })
    );
  };

  if (cartProducts.length === 0) {
    return (
      <div className="text-center py-8 font-body">
        <p className="text-4xl mb-2 animate-bounce-slow">🛒</p>
        <p className="text-xl font-bold text-comic-dark font-comic">Your cart is empty!</p>
        <p className="text-sm text-gray-500 font-body mt-1">Add some POW to your cart!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="comic-card flex items-start justify-between p-3 bg-white animate-slide-right font-body"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 mr-4 rounded border-2 border-comic-dark shadow-comic object-cover"
            />
            <div>
              <h3 className="font-comic text-comic-dark text-base font-bold">{product.name}</h3>
              <p className="text-xs text-gray-600 font-body mb-2">
                📏 {product.size} | 🎨 {product.color}
              </p>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(product, -1)}
                  className="w-8 h-8 flex items-center justify-center bg-comic-yellow text-comic-dark font-bold text-lg rounded-l-lg border-2 border-comic-dark hover:bg-yellow-400 transition-colors"
                >
                  -
                </button>
                <span className="w-10 h-8 flex items-center justify-center bg-white border-y-2 border-comic-dark font-comic text-lg">
                  {product.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(product, 1)}
                  className="w-8 h-8 flex items-center justify-center bg-comic-yellow text-comic-dark font-bold text-lg rounded-r-lg border-2 border-comic-dark hover:bg-yellow-400 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="font-comic text-lg font-bold text-comic-green">
              ${(product.price * product.quantity).toLocaleString()}
            </p>
            <button
              onClick={() => handleRemove(product)}
              className="mt-2 p-1.5 rounded-full border-2 border-transparent hover:border-comic-red hover:bg-red-50 transition-all group"
            >
              <RiDeleteBin3Line className="h-5 w-5 text-gray-400 group-hover:text-comic-red transition-colors" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContent;
