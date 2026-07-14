import React, { useRef, useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivals } from "../../Redux/slices/productSlice";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  const { newArrivals, loading } = useSelector((state) => state.products);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = 320;

    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons(); // initial check
    el.addEventListener("scroll", updateScrollButtons);

    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  return (
    <section className="py-16 bg-comic-cream">
      {/* Heading */}
      <div className="container mx-auto text-center mb-10 sm:mb-16 relative px-4">
        <span className="comic-badge bg-comic-orange text-white mb-3 inline-block animate-pop-in">
          ★ FRESH DROPS ★
        </span>
        <h2 className="font-comic text-4xl tracking-wider text-comic-dark mb-4 animate-slide-up">
          Explore New Arrivals
        </h2>
        <p className="font-body text-comic-dark/70 max-w-2xl mx-auto">
          Discover the latest trends and styles straight off the runway.
        </p>

        {/* Scroll buttons */}
        <div className="flex justify-center sm:justify-end sm:absolute sm:right-4 sm:-bottom-8 space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`comic-btn p-2 text-sm transition ${
              !canScrollLeft
                ? "opacity-40 cursor-not-allowed bg-gray-200"
                : "bg-comic-yellow text-comic-dark hover:bg-yellow-300"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`comic-btn p-2 text-sm transition ${
              !canScrollRight
                ? "opacity-40 cursor-not-allowed bg-gray-200"
                : "bg-comic-yellow text-comic-dark hover:bg-yellow-300"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className={`container mx-auto flex gap-6 overflow-x-auto snap-x scroll-smooth px-4 scrollbar-hide ${isDragging ? "cursor-grabbing" : "cursor-grab"} `}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {newArrivals.map((product, index) => (
          <div
            key={product._id}
            className="relative min-w-[220px] sm:min-w-[280px] snap-start border-3 border-comic-dark rounded-xl overflow-hidden shadow-comic hover:shadow-comic-xl hover:-translate-y-1 transition-all duration-300 group animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <img
              src={product.images?.[0]?.url || product.image?.[0]?.url}
              alt={product.name}
              className="w-full h-[280px] sm:h-[360px] object-cover transition-transform duration-300 group-hover:scale-105"
              draggable="false"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-comic-dark via-comic-dark/30 to-transparent" />

            {/* Colorful accent strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-comic-yellow via-comic-red to-comic-cyan" />

            <div className="absolute bottom-0 inset-x-0 p-4">
              <Link to={`/product/${product._id}`}>
                <h4 className="font-comic text-lg tracking-wide text-white drop-shadow-md">
                  {product.name}
                </h4>
                <p className="mt-1 font-comic text-comic-yellow text-xl">
                  ${product.price}
                </p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
