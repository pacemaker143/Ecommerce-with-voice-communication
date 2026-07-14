import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api";

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [
      { url: "https://picsum.photos/150/150?random=1", altText: "" },
      { url: "https://picsum.photos/150/150?random=2", altText: "" },
    ],
  });

  const [loading, setLoading] = useState(true);

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProductData((prev) => ({ ...prev, ...data }));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ✅ common change handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setProductData({
      ...productData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const { data } = await API.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProductData({
        ...productData,
        images: [...productData.images, { url: data.imageUrl, altText: file.name }],
      });
      toast.success("Image uploaded");
    } catch (err) {
      console.error(err);
      // Fallback to local preview
      const newImage = {
        url: URL.createObjectURL(file),
        altText: file.name,
      };
      setProductData({
        ...productData,
        images: [...productData.images, newImage],
      });
    }
  };

  // ✅ image handler
  const handleImageChange = (index, field, value) => {
    const newImages = [...productData.images];
    newImages[index][field] = value;
    setProductData({ ...productData, images: newImages });
  };

  // Submit update to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/products/${id}`, productData);
      toast.success("Product updated!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) return <p className="p-6 font-comic text-comic-dark animate-bounce-slow">⏳ Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 font-body">
      <h2 className="comic-heading text-3xl text-comic-dark mb-6 inline-block transform -rotate-1">✏️ Edit Product</h2>

      <form onSubmit={handleSubmit} className="comic-panel p-6 animate-fade-in">
        {/* name */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">Product Name</label>
          <input
            type="text"
            value={productData.name}
            onChange={handleChange}
            name="name"
            className="comic-input w-full"
          />
        </div>

        {/* description */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">Description</label>
          <textarea
            value={productData.description}
            onChange={handleChange}
            name="description"
            className="comic-input w-full min-h-[100px]"
          />
        </div>

        {/* price */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">Price</label>
          <input
            type="number"
            value={productData.price}
            onChange={handleChange}
            name="price"
            className="comic-input w-full"
          />
        </div>

        {/* stock */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">Count In Stock</label>
          <input
            type="number"
            value={productData.countInStock}
            onChange={handleChange}
            name="countInStock"
            className="comic-input w-full"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">SKU</label>
          <input
            type="text"
            value={productData.sku}
            onChange={handleChange}
            name="sku"
            className="comic-input w-full"
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">Sizes</label>
          <input
            type="text"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(", ").map((s) => s.trim()),
              })
            }
            name="sizes"
            className="comic-input w-full"
          />
        </div>
        {/* colors */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">Colors</label>
          <input
            type="text"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(", ").map((c) => c.trim()),
              })
            }
            name="colors"
            className="comic-input w-full"
          />
        </div>

        {/* image upload */}
        <div className="mb-6">
          <label className="block font-comic text-comic-dark mb-2">📸 Image Upload</label>
          <input
            type="file"
            onChange={handleImageUpload}
            className="comic-input w-full"
          />
          <div className="flex gap-4 mt-4 flex-wrap">
            {productData.images.map((img, index) => (
              <div key={index} className="w-32 comic-card p-2">
                <img
                  src={img.url}
                  alt={img.altText}
                  className="w-full h-32 object-cover rounded-lg border-2 border-comic-dark"
                />
                <input
                  type="text"
                  value={img.altText}
                  onChange={(e) =>
                    handleImageChange(index, "altText", e.target.value)
                  }
                  placeholder="Alt text"
                  className="comic-input w-full text-xs mt-2 py-1 px-2"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="comic-btn-primary w-full py-3 font-comic text-lg"
        >
          💾 Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
