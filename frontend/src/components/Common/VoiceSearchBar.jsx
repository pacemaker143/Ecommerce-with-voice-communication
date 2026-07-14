import React, { useState, useRef, useEffect } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { HiMicrophone } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../Redux/slices/voiceSlice";
import useVoiceRecognition from "../../hooks/useVoiceRecognition";
import { Link } from "react-router-dom";

const LANGUAGES = [
  { code: "en-US", label: "🇺🇸 EN" },
  { code: "es-ES", label: "🇪🇸 ES" },
  { code: "fr-FR", label: "🇫🇷 FR" },
  { code: "de-DE", label: "🇩🇪 DE" },
  { code: "hi-IN", label: "🇮🇳 HI" },
  { code: "pt-BR", label: "🇧🇷 PT" },
  { code: "ja-JP", label: "🇯🇵 JP" },
  { code: "zh-CN", label: "🇨🇳 ZH" },
];

const VoiceSearchBar = ({ onToggleCart }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const langRef = useRef(null);

  const { isListening, transcript, language, suggestions } = useSelector((s) => s.voice);
  const sugList = suggestions?.products || [];
  const subList = suggestions?.substitutes || [];

  const { startListening, stopListening } = useVoiceRecognition({
    onSearchSubmit: (term) => {
      setSearchTerm(term);
      setIsOpen(false);
    },
    onToggleCart,
  });

  const handleSearchToggle = () => setIsOpen((p) => !p);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  // Close lang dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={`flex items-center justify-center w-full transition-all duration-300 ${
        isOpen
          ? "absolute top-0 left-0 w-full bg-comic-cream z-50 border-b-3 border-comic-dark"
          : "w-auto"
      }`}
      style={{ minHeight: isOpen ? "6rem" : "auto" }}
    >
      {isOpen ? (
        <div className="w-full flex flex-col items-center px-4 py-3">
          {/* Search form row */}
          <form onSubmit={handleSearch} className="relative flex items-center w-full max-w-2xl gap-2">
            {/* Text input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={isListening ? "🎤 Listening..." : "Search or say a command..."}
                value={isListening ? transcript : searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                readOnly={isListening}
                className={`comic-input pr-10 w-full transition-all ${
                  isListening ? "border-comic-red bg-red-50 animate-pulse" : ""
                }`}
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-comic-dark hover:text-comic-cyan"
              >
                <HiMagnifyingGlass className="h-5 w-5" />
              </button>
            </div>

            {/* Mic button */}
            <button
              type="button"
              onClick={handleMicClick}
              title={isListening ? "Stop listening" : "Start voice input"}
              className={`flex-shrink-0 p-2.5 rounded-xl border-3 border-comic-dark font-comic transition-all ${
                isListening
                  ? "bg-comic-red text-white animate-pulse shadow-comic-red"
                  : "bg-comic-yellow text-comic-dark hover:bg-yellow-300 shadow-comic"
              }`}
            >
              <HiMicrophone className="h-5 w-5" />
            </button>

            {/* Language selector */}
            <div ref={langRef} className="relative flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowLang((p) => !p)}
                className="p-2.5 rounded-xl border-3 border-comic-dark bg-white text-comic-dark text-xs font-comic shadow-comic hover:bg-comic-cyan/20 transition-all"
                title="Change recognition language"
              >
                {LANGUAGES.find((l) => l.code === language)?.label || "🌐"}
              </button>
              {showLang && (
                <div className="absolute right-0 top-12 bg-white border-3 border-comic-dark rounded-xl shadow-comic-lg z-50 min-w-[130px] overflow-hidden">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        dispatch(setLanguage(l.code));
                        setShowLang(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-comic hover:bg-comic-yellow/40 transition-colors ${
                        language === l.code ? "bg-comic-yellow/60 font-bold" : ""
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (isListening) stopListening();
              }}
              className="flex-shrink-0 hover:rotate-90 transition-transform"
            >
              <HiMiniXMark className="h-5 w-5 text-comic-dark" />
            </button>
          </form>

          {/* Voice hint bar */}
          {!isListening && (
            <p className="text-xs text-comic-dark/50 font-body mt-1.5 text-center">
              💡 Try: <span className="italic">"Add 2 milk to my list"</span> · <span className="italic">"Find cotton shirts under $50"</span> · <span className="italic">"Show women's tops"</span>
            </p>
          )}

          {/* Live transcript display */}
          {isListening && transcript && (
            <div className="mt-2 px-4 py-2 bg-comic-red/10 border-2 border-comic-red rounded-xl text-sm font-comic text-comic-red animate-pulse max-w-2xl w-full text-center">
              🎤 "{transcript}"
            </div>
          )}

          {/* Smart suggestions dropdown */}
          {(sugList.length > 0 || subList.length > 0) && (
            <div className="mt-2 w-full max-w-2xl bg-white border-3 border-comic-dark rounded-xl shadow-comic-lg overflow-hidden">
              {sugList.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs font-comic text-comic-dark/50 bg-comic-yellow/20 border-b-2 border-comic-dark/10">
                    🛍️ Product suggestions
                  </p>
                  {sugList.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-comic-yellow/20 transition-colors border-b border-comic-dark/10"
                    >
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border-2 border-comic-dark/20" />
                      <span className="font-body text-sm text-comic-dark flex-1 truncate">{p.name}</span>
                      <span className="font-comic text-comic-green text-sm">${p.price}</span>
                    </Link>
                  ))}
                </>
              )}
              {subList.length > 0 && (
                <>
                  <p className="px-4 py-2 text-xs font-comic text-comic-dark/50 bg-comic-cyan/20 border-b-2 border-comic-dark/10">
                    🔄 Substitutes
                  </p>
                  <div className="flex flex-wrap gap-2 px-4 py-3">
                    {subList.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSearchTerm(s);
                          navigate(`/collections/all?search=${encodeURIComponent(s)}`);
                          setIsOpen(false);
                        }}
                        className="comic-badge bg-comic-cyan/20 text-comic-dark border-comic-dark/30 hover:bg-comic-cyan/40 text-xs"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Collapsed: just show the mic + search icons */
        <div className="flex items-center gap-1">
          <button
            onClick={handleMicClick}
            title="Voice search"
            className={`p-1 rounded-lg transition-all hover:scale-110 ${
              isListening ? "text-comic-red animate-pulse" : "text-comic-dark hover:text-comic-cyan"
            }`}
          >
            <HiMicrophone className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={handleSearchToggle}
            className="hover:text-comic-cyan transition-colors hover:scale-110"
          >
            <HiMagnifyingGlass className="h-5 w-5 sm:h-6 sm:w-6 text-comic-dark" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceSearchBar;
