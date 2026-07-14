"use client";

import React from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen
          ? "absolute top-0 left-0 w-full bg-comic-cream h-24 z-50 border-b-3 border-comic-dark"
          : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          onSubmit={handleSearch}
          className="relative flex items-center justify-center w-full"
        >
          <div className="relative w-4/5 sm:w-1/2">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="comic-input pr-12"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-comic-dark hover:text-comic-cyan transition-colors"
            >
              <HiMagnifyingGlass className="h-5 w-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:rotate-90 transition-transform"
          >
            <HiMiniXMark className="h-5 w-5 text-comic-dark" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle} className="hover:text-comic-cyan transition-colors hover:scale-110">
          <HiMagnifyingGlass className="h-6 w-6 text-comic-dark" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
