import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    category: "",
    gender: "",
    color: "",
    size: "",
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const categories = ["Top Wear", "Bottom Wear"];
  const genders = ["Men", "Women", "Unisex"];
  const colors = ["Red", "Blue", "Black", "White"];
  const sizes = ["S", "M", "L", "XL"];
  const brands = ["Nike", "Adidas", "Puma"];
  const materials = ["Cotton", "Denim", "Polyester"];

  const handleRadioChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    if (checked) {
      setFilter({ ...filter, [name]: [...filter[name], value] });
    } else {
      setFilter({
        ...filter,
        [name]: filter[name].filter((item) => item !== value),
      });
    }
  };

  const handlePriceChange = (e) => {
    setFilter({ ...filter, maxPrice: e.target.value });
  };

  // ✅ FIXED URL SYNC (Preserves sortBy)
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    Object.keys(filter).forEach((key) => {
      const value = filter[key];

      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key);
        }
      } else if (value !== "" && value !== 0) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  }, [filter, searchParams, setSearchParams]);

  return (
    <div className="space-y-6 p-4 font-body">
      
      {/* CATEGORY */}
      <div>
        <h3 className="comic-heading text-lg mb-3">Category</h3>
        {categories.map((cat) => (
          <label
            key={cat}
            className={`flex items-center gap-2 mb-2 text-sm cursor-pointer px-3 py-2 rounded-xl border-2 transition-all duration-200
              ${
                filter.category === cat
                  ? "bg-comic-yellow text-comic-dark border-comic-dark shadow-comic font-bold"
                  : "border-transparent hover:bg-comic-yellow/20 hover:border-comic-dark/30"
              }`}
          >
            <input
              type="radio"
              name="category"
              value={cat}
              checked={filter.category === cat}
              onChange={handleRadioChange}
              className="accent-comic-red"
            />
            {cat}
          </label>
        ))}
      </div>

      {/* GENDER */}
      <div>
        <h3 className="comic-heading text-lg mb-3">Gender</h3>
        {genders.map((g) => (
          <label
            key={g}
            className={`flex items-center gap-2 mb-2 text-sm cursor-pointer px-3 py-2 rounded-xl border-2 transition-all duration-200
              ${
                filter.gender === g
                  ? "bg-comic-cyan text-white border-comic-dark shadow-comic font-bold"
                  : "border-transparent hover:bg-comic-cyan/20 hover:border-comic-dark/30"
              }`}
          >
            <input
              type="radio"
              name="gender"
              value={g}
              checked={filter.gender === g}
              onChange={handleRadioChange}
              className="accent-comic-cyan"
            />
            {g}
          </label>
        ))}
      </div>

      {/* COLOR */}
      <div>
        <h3 className="comic-heading text-lg mb-3">Color</h3>
        <div className="flex gap-2 flex-wrap">
          {colors.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => setFilter({ ...filter, color: col })}
              className={`comic-badge cursor-pointer transition-all duration-200
                ${
                  filter.color === col
                    ? "bg-comic-red text-white border-comic-dark shadow-comic scale-110"
                    : "bg-white text-comic-dark hover:bg-comic-pink/20 hover:scale-105"
                }`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>

      {/* SIZE */}
      <div>
        <h3 className="comic-heading text-lg mb-3">Size</h3>
        <select
          name="size"
          value={filter.size}
          onChange={handleRadioChange}
          className="comic-input"
        >
          <option value="">Select Size</option>
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* BRAND */}
      <div>
        <h3 className="comic-heading text-lg mb-3">Brand</h3>
        {brands.map((brand) => (
          <label
            key={brand}
            className={`flex items-center gap-2 mb-2 text-sm cursor-pointer px-3 py-2 rounded-xl border-2 transition-all duration-200
              ${
                filter.brand.includes(brand)
                  ? "bg-comic-purple text-white border-comic-dark shadow-comic font-bold"
                  : "border-transparent hover:bg-comic-purple/20 hover:border-comic-dark/30"
              }`}
          >
            <input
              type="checkbox"
              name="brand"
              value={brand}
              checked={filter.brand.includes(brand)}
              onChange={handleCheckboxChange}
              className="accent-comic-purple"
            />
            {brand}
          </label>
        ))}
      </div>

      {/* MATERIAL */}
      <div>
        <h3 className="comic-heading text-lg mb-3">Material</h3>
        {materials.map((mat) => (
          <label
            key={mat}
            className={`flex items-center gap-2 mb-2 text-sm cursor-pointer px-3 py-2 rounded-xl border-2 transition-all duration-200
              ${
                filter.material.includes(mat)
                  ? "bg-comic-green text-comic-dark border-comic-dark shadow-comic font-bold"
                  : "border-transparent hover:bg-comic-green/20 hover:border-comic-dark/30"
              }`}
          >
            <input
              type="checkbox"
              name="material"
              value={mat}
              checked={filter.material.includes(mat)}
              onChange={handleCheckboxChange}
              className="accent-comic-green"
            />
            {mat}
          </label>
        ))}
      </div>

      {/* PRICE */}
      <div>
        <h3 className="comic-heading text-lg mb-2">
          Max Price: <span className="text-comic-red">${filter.maxPrice}</span>
        </h3>
        <input
          type="range"
          min="0"
          max="500"
          value={filter.maxPrice}
          onChange={handlePriceChange}
          className="w-full accent-comic-red"
        />
      </div>

      {/* CLEAR */}
      <button
        onClick={() =>
          setFilter({
            category: "",
            gender: "",
            color: "",
            size: "",
            material: [],
            brand: [],
            minPrice: 0,
            maxPrice: 100,
          })
        }
        className="comic-btn-dark w-full text-center"
      >
        Clear Filters ✕
      </button>
    </div>
  );
};

export default FilterSidebar;
