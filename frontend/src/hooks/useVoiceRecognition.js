import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  setListening,
  setTranscript,
  setLastCommand,
  addShoppingItem,
  removeShoppingItem,
  updateShoppingItemQty,
  setSuggestions,
} from "../Redux/slices/voiceSlice";
import { fetchProducts } from "../Redux/slices/productSlice";

// ─── NLP: extract quantity + item name ──────────────────────────────────────
const extractQuantityAndName = (text) => {
  // "2 bottles of water" → { quantity: 2, name: "water" }
  // "five oranges"       → { quantity: 5, name: "oranges" }
  const wordNumbers = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    a: 1, an: 1,
  };

  // Try numeric first: "3 apples" or "3 bottles of milk"
  const numericMatch = text.match(/^(\d+)\s+(?:\w+\s+of\s+)?(.+)$/i);
  if (numericMatch) {
    return { quantity: parseInt(numericMatch[1], 10), name: numericMatch[2].trim() };
  }

  // Try word number: "five oranges"
  const wordMatch = text.match(/^(one|two|three|four|five|six|seven|eight|nine|ten|a|an)\s+(?:\w+\s+of\s+)?(.+)$/i);
  if (wordMatch) {
    return {
      quantity: wordNumbers[wordMatch[1].toLowerCase()] || 1,
      name: wordMatch[2].trim(),
    };
  }

  return { quantity: 1, name: text.trim() };
};

// ─── NLP: parse price range from voice ─────────────────────────────────────
const extractPriceFilter = (text) => {
  const under = text.match(/under\s+\$?(\d+)/i);
  const above = text.match(/(?:above|over|more than)\s+\$?(\d+)/i);
  const between = text.match(/between\s+\$?(\d+)\s+and\s+\$?(\d+)/i);

  if (between) return { minPrice: between[1], maxPrice: between[2] };
  if (under) return { maxPrice: under[1] };
  if (above) return { minPrice: above[1] };
  return {};
};

// ─── NLP: parse gender / category / brand filters ──────────────────────────
const extractFilters = (text) => {
  const lower = text.toLowerCase();
  const filters = {};

  // Gender
  if (/\b(men'?s?|for men)\b/.test(lower)) filters.gender = "Men";
  else if (/\b(women'?s?|for women)\b/.test(lower)) filters.gender = "Women";
  else if (/\bunisex\b/.test(lower)) filters.gender = "Unisex";

  // Category
  if (/\b(top|tops|shirt|shirts|t-shirt|blouse|sweater|hoodie|top wear)\b/.test(lower))
    filters.category = "Top Wear";
  else if (/\b(bottom|bottoms|pant|pants|jeans|shorts|skirt|bottom wear)\b/.test(lower))
    filters.category = "Bottom Wear";

  // Sort
  if (/\b(cheapest|lowest price|price low)\b/.test(lower)) filters.sortBy = "priceAsc";
  else if (/\b(expensive|highest price|price high)\b/.test(lower)) filters.sortBy = "priceDesc";
  else if (/\b(popular|trending|best)\b/.test(lower)) filters.sortBy = "popularity";

  // Price
  Object.assign(filters, extractPriceFilter(text));

  // Brand
  const brandMatch = lower.match(/\b(nike|adidas|puma)\b/);
  if (brandMatch) filters.brand = brandMatch[1].charAt(0).toUpperCase() + brandMatch[1].slice(1);

  // Material
  const materialMatch = lower.match(/\b(cotton|denim|polyester)\b/);
  if (materialMatch) filters.material = materialMatch[1].charAt(0).toUpperCase() + materialMatch[1].slice(1);

  return filters;
};

// ─── NLP: extract search term stripping stop words ─────────────────────────
const extractSearchTerm = (text) => {
  return text
    .replace(/\b(find|search|look for|show me|search for|find me|organic|buy|get)\b/gi, "")
    .replace(/\b(under|above|over|more than|between|and)\s+\$?\d+/gi, "")
    .replace(/\b(men'?s?|women'?s?|unisex|for men|for women)\b/gi, "")
    .replace(/\b(nike|adidas|puma)\b/gi, "")
    .replace(/\b(cotton|denim|polyester)\b/gi, "")
    .replace(/\b(cheapest|lowest|highest|price|popular|trending|best)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

// ─── NLP: classify the intent of a voice utterance ─────────────────────────
const parseCommand = (raw) => {
  const text = raw.trim().toLowerCase();

  // ── Shopping list: ADD ──────────────────────────────────────────────────
  const addPatterns = [
    /^(?:add|i need|buy|get|put|include)\s+(.+)(?:\s+(?:to|in|on|into)\s+(?:my\s+)?(?:list|cart|shopping list))?$/i,
    /^(?:i want to buy|i want to get|please add|can you add)\s+(.+)$/i,
    /^(.+)\s+(?:to my list|to the list|on my list)$/i,
  ];
  for (const p of addPatterns) {
    const m = raw.trim().match(p);
    if (m) {
      const { quantity, name } = extractQuantityAndName(m[1].trim());
      return { type: "ADD_TO_LIST", item: name, quantity };
    }
  }

  // ── Shopping list: REMOVE ───────────────────────────────────────────────
  const removePatterns = [
    /^(?:remove|delete|take off|take out)\s+(.+)(?:\s+(?:from|off)\s+(?:my\s+)?(?:list|cart|shopping list))?$/i,
    /^(?:i don't need|i do not need|no more)\s+(.+)$/i,
  ];
  for (const p of removePatterns) {
    const m = raw.trim().match(p);
    if (m) return { type: "REMOVE_FROM_LIST", item: m[1].trim() };
  }

  // ── Shopping list: QUANTITY UPDATE ──────────────────────────────────────
  const qtyMatch = raw.trim().match(
    /^(?:change|update|set|make it)\s+(.+)\s+(?:to|quantity to)\s+(\d+)$/i
  );
  if (qtyMatch)
    return { type: "UPDATE_QTY", item: qtyMatch[1].trim(), quantity: parseInt(qtyMatch[2], 10) };

  // ── Search + filter ─────────────────────────────────────────────────────
  const searchPatterns = [
    /^(?:find|search|look for|show me|find me|search for)\s+(.+)$/i,
    /^(?:i(?:'m)? (?:looking for|searching for))\s+(.+)$/i,
  ];
  for (const p of searchPatterns) {
    const m = raw.trim().match(p);
    if (m) {
      const filters = extractFilters(raw);
      const searchTerm = extractSearchTerm(m[1]);
      return { type: "SEARCH", searchTerm, filters };
    }
  }

  // ── Pure filter (no search term) ────────────────────────────────────────
  const filters = extractFilters(raw);
  if (Object.keys(filters).length > 0) {
    return { type: "FILTER", filters };
  }

  // ── Navigation ──────────────────────────────────────────────────────────
  if (/\b(go to|open|show|navigate)\s+(men'?s?|men)\b/.test(text))
    return { type: "NAVIGATE", path: "/collections/men" };
  if (/\b(go to|open|show|navigate)\s+(women'?s?|women)\b/.test(text))
    return { type: "NAVIGATE", path: "/collections/women" };
  if (/\b(go to|open|show)\s+(cart)\b/.test(text))
    return { type: "OPEN_CART" };
  if (/\b(go to|open|show)\s+(shopping list|my list)\b/.test(text))
    return { type: "NAVIGATE", path: "/shopping-list" };

  // ── Fallback: treat as search ────────────────────────────────────────────
  if (text.length > 1) {
    return { type: "SEARCH", searchTerm: raw.trim(), filters: {} };
  }

  return { type: "UNKNOWN" };
};

// ─── Substitute suggestions ─────────────────────────────────────────────────
const getSubstitutes = (itemName) => {
  const substitutes = {
    milk: ["almond milk", "oat milk", "soy milk", "coconut milk"],
    bread: ["whole wheat bread", "sourdough", "rye bread", "gluten-free bread"],
    butter: ["margarine", "coconut oil", "olive oil", "ghee"],
    sugar: ["honey", "maple syrup", "stevia", "agave"],
    coffee: ["green tea", "matcha", "chai", "decaf coffee"],
    beef: ["chicken", "turkey", "tofu", "lentils"],
    eggs: ["tofu scramble", "flax eggs", "chia eggs"],
  };
  const lower = itemName.toLowerCase();
  for (const [key, subs] of Object.entries(substitutes)) {
    if (lower.includes(key)) return subs;
  }
  return [];
};

// ─── Hook ────────────────────────────────────────────────────────────────────
const useVoiceRecognition = ({ onSearchSubmit, onToggleCart } = {}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const { language, isListening } = useSelector((s) => s.voice);
  const { products } = useSelector((s) => s.products);

  // Build live suggestions from interim transcript against product names
  const buildSuggestions = useCallback(
    (transcript) => {
      if (!transcript || transcript.length < 2) {
        dispatch(setSuggestions([]));
        return;
      }
      const term = transcript.toLowerCase();
      const matched = products
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(term) ||
            p.category?.toLowerCase().includes(term) ||
            p.brand?.toLowerCase().includes(term)
        )
        .slice(0, 5)
        .map((p) => ({ id: p._id, name: p.name, price: p.price, image: p.images?.[0]?.url }));

      // Also append substitutes if recognisable keyword
      const subs = getSubstitutes(transcript);
      dispatch(setSuggestions({ products: matched, substitutes: subs }));
    },
    [dispatch, products]
  );

  const executeCommand = useCallback(
    (command) => {
      dispatch(setLastCommand(command));

      switch (command.type) {
        case "ADD_TO_LIST":
          dispatch(addShoppingItem({ name: command.item, quantity: command.quantity }));
          toast.success(`✅ Added "${command.item}" (×${command.quantity}) to your list`);
          break;

        case "REMOVE_FROM_LIST":
          dispatch(removeShoppingItem(command.item));
          toast.info(`🗑️ Removed "${command.item}" from your list`);
          break;

        case "UPDATE_QTY":
          dispatch(updateShoppingItemQty({ name: command.item, quantity: command.quantity }));
          toast.info(`🔢 Updated "${command.item}" to ×${command.quantity}`);
          break;

        case "SEARCH": {
          const params = new URLSearchParams();
          if (command.searchTerm) params.set("search", command.searchTerm);
          Object.entries(command.filters || {}).forEach(([k, v]) => params.set(k, v));
          dispatch(fetchProducts(Object.fromEntries(params)));
          navigate(`/collections/all?${params.toString()}`);
          if (onSearchSubmit) onSearchSubmit(command.searchTerm || "");
          toast.info(`🔍 Searching: "${command.searchTerm || "filtered results"}"`);
          break;
        }

        case "FILTER": {
          const params = new URLSearchParams();
          Object.entries(command.filters).forEach(([k, v]) => params.set(k, v));
          dispatch(fetchProducts(command.filters));
          navigate(`/collections/all?${params.toString()}`);
          toast.info(`⚡ Filters applied`);
          break;
        }

        case "NAVIGATE":
          navigate(command.path);
          break;

        case "OPEN_CART":
          if (onToggleCart) onToggleCart();
          break;

        default:
          toast.warning("🤷 Command not understood. Try: 'Add milk', 'Find cotton shirts under $50'");
      }
    },
    [dispatch, navigate, onSearchSubmit, onToggleCart]
  );

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("⚠️ Voice recognition not supported in this browser. Try Chrome.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      dispatch(setListening(true));
      dispatch(setTranscript(""));
      toast.info("🎤 Listening...", { id: "voice-listening", duration: 8000 });
    };

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      const current = final || interim;
      dispatch(setTranscript(current));
      buildSuggestions(current);

      if (final) {
        toast.dismiss("voice-listening");
        const command = parseCommand(final);
        executeCommand(command);
        dispatch(setListening(false));
        dispatch(setTranscript(""));
        dispatch(setSuggestions([]));
      }
    };

    recognition.onerror = (e) => {
      toast.dismiss("voice-listening");
      if (e.error !== "aborted") {
        const msgs = {
          "not-allowed": "🚫 Microphone access denied. Please allow microphone permissions.",
          "no-speech": "😶 No speech detected. Please try again.",
          network: "🌐 Network error during voice recognition.",
        };
        toast.error(msgs[e.error] || `Voice error: ${e.error}`);
      }
      dispatch(setListening(false));
      dispatch(setTranscript(""));
    };

    recognition.onend = () => {
      toast.dismiss("voice-listening");
      dispatch(setListening(false));
    };

    recognition.start();
  }, [language, dispatch, buildSuggestions, executeCommand]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    dispatch(setListening(false));
    dispatch(setTranscript(""));
    toast.dismiss("voice-listening");
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, []);

  return { startListening, stopListening, isListening, parseCommand, getSubstitutes };
};

export default useVoiceRecognition;
