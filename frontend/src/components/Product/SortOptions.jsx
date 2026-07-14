import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;

    const params = new URLSearchParams(searchParams.toString());

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    setSearchParams(params);
  };

  return (
    <div className="mb-6 flex items-center justify-end gap-3">
      <span className="font-comic text-comic-dark tracking-wider text-sm hidden sm:inline">
        Sort By:
      </span>
      <select
        value={searchParams.get("sortBy") || ""}
        onChange={handleSortChange}
        className="comic-input w-auto min-w-[200px]"
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
