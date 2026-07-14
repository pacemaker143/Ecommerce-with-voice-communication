import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { fetchAdminProducts, deleteAdminProduct } from "../../Redux/slices/adminSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteAdminProduct(productId))
        .unwrap()
        .then(() => toast.success("Product deleted"))
        .catch((err) => toast.error(err || "Failed to delete product"));
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-body">
      <h2 className="comic-heading text-xl sm:text-2xl text-comic-dark mb-6 inline-block transform -rotate-1">🏷️ Product Management</h2>

      <div className="comic-panel p-4 sm:p-6">
        <h3 className="font-comic text-lg sm:text-xl text-comic-dark mb-4">📦 Product List</h3>

        <div className="overflow-x-auto">
        <table className="w-full table-auto font-body text-sm">
          <thead>
            <tr className="bg-comic-yellow border-b-3 border-comic-dark">
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark hidden sm:table-cell">ID</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark">Name</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark">Price</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark hidden md:table-cell">SKU</th>
              <th className="px-2 sm:px-4 py-2 text-left font-comic text-comic-dark">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4 font-comic">
                  ⏳ Loading products...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-4 font-comic">
                  No products available
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b-2 border-comic-dark/10 hover:bg-comic-yellow/10 transition-colors">
                  <td className="p-2 sm:p-4 font-mono text-xs text-comic-dark whitespace-nowrap hidden sm:table-cell">
                    {product._id}
                  </td>
                  <td className="px-2 sm:px-4 py-2 font-bold text-sm">{product.name}</td>
                  <td className="px-2 sm:px-4 py-2 font-comic text-comic-green">{`$${product.price.toFixed(2)}`}</td>
                  <td className="px-2 sm:px-4 py-2 font-mono text-xs hidden md:table-cell">{product.sku}</td>
                  <td className="p-2 sm:p-4">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="comic-btn bg-comic-yellow text-comic-dark border-2 border-comic-dark px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-comic hover:scale-105 transition-transform inline-block"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="comic-btn-danger px-2 sm:px-3 py-1 text-xs sm:text-sm font-comic"
                    >
                      🗑️ Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
