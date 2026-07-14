import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../Redux/slices/voiceSlice";
import useVoiceRecognition from "../../hooks/useVoiceRecognition";
import { HiMicrophone } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";

const LANGUAGES = [
  { code: "en-US", label: "🇺🇸 English" },
  { code: "es-ES", label: "🇪🇸 Español" },
  { code: "fr-FR", label: "🇫🇷 Français" },
  { code: "de-DE", label: "🇩🇪 Deutsch" },
  { code: "hi-IN", label: "🇮🇳 हिंदी" },
  { code: "pt-BR", label: "🇧🇷 Português" },
  { code: "ja-JP", label: "🇯🇵 日本語" },
  { code: "zh-CN", label: "🇨🇳 中文" },
];

const COMMAND_EXAMPLES = [
  { cmd: '"Add 2 litres of milk"',        icon: "➕", type: "shopping list" },
  { cmd: '"Remove bread from my list"',   icon: "🗑️", type: "shopping list" },
  { cmd: '"Find cotton shirts under $50"',icon: "🔍", type: "search" },
  { cmd: '"Show women\'s tops"',          icon: "⚡", type: "filter" },
  { cmd: '"I need 5 oranges"',            icon: "🛒", type: "shopping list" },
  { cmd: '"Sort by cheapest"',            icon: "💰", type: "filter" },
];

const VoiceCommandPanel = () => {
  const dispatch = useDispatch();
  const { isListening, transcript, language, lastCommand, shoppingList } = useSelector((s) => s.voice);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const { startListening, stopListening } = useVoiceRecognition();

  const listCount = shoppingList?.length || 0;

  if (!showPanel) return null;

  return (
    <div
      className={`fixed bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 transition-all duration-300`}
    >
      {/* Expanded panel */}
      {isExpanded && (
        <div className="w-72 sm:w-80 comic-panel p-4 animate-pop-in shadow-comic-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-comic text-comic-dark text-base flex items-center gap-2">
              🎤 Voice Assistant
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:rotate-90 transition-transform"
            >
              <IoMdClose className="h-4 w-4 text-comic-dark/60" />
            </button>
          </div>

          {/* Live transcript */}
          <div
            className={`mb-3 p-3 rounded-xl border-2 min-h-[48px] flex items-center justify-center text-sm ${
              isListening
                ? "border-comic-red bg-comic-red/10 text-comic-red font-comic animate-pulse"
                : "border-comic-dark/20 bg-comic-cream/50 text-comic-dark/40 font-body"
            }`}
          >
            {isListening
              ? transcript || "🎤 Listening..."
              : lastCommand
              ? `✅ "${lastCommand.type?.replace(/_/g, " ").toLowerCase()}"`
              : "Press mic to start"}
          </div>

          {/* Language selector */}
          <div className="mb-3">
            <p className="text-xs font-comic text-comic-dark/50 mb-1.5">🌐 Language</p>
            <select
              value={language}
              onChange={(e) => dispatch(setLanguage(e.target.value))}
              className="comic-input text-sm py-1.5"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          {/* Command examples */}
          <div className="mb-3">
            <p className="text-xs font-comic text-comic-dark/50 mb-2">💡 Example commands</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {COMMAND_EXAMPLES.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 bg-comic-cream rounded-lg border border-comic-dark/10"
                >
                  <span className="flex-shrink-0 text-sm">{ex.icon}</span>
                  <div className="min-w-0">
                    <p className="font-body text-xs text-comic-dark italic truncate">{ex.cmd}</p>
                    <span className="text-[10px] text-comic-dark/40 font-comic uppercase tracking-wide">
                      {ex.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping list shortcut */}
          <Link
            to="/shopping-list"
            className="flex items-center justify-between p-2.5 bg-comic-yellow/30 border-2 border-comic-yellow rounded-xl hover:bg-comic-yellow/50 transition-colors"
          >
            <span className="font-comic text-comic-dark text-sm">📋 My Shopping List</span>
            <span className="comic-badge bg-comic-dark text-comic-yellow text-xs">{listCount}</span>
          </Link>
        </div>
      )}

      {/* FAB row: expand toggle + mic button */}
      <div className="flex items-center gap-2">
        {/* Dismiss */}
        {isExpanded && (
          <button
            onClick={() => setShowPanel(false)}
            className="w-9 h-9 rounded-full bg-white border-3 border-comic-dark/30 flex items-center justify-center hover:border-comic-red hover:text-comic-red transition-all shadow-comic"
            title="Hide voice panel"
          >
            <IoMdClose className="h-4 w-4" />
          </button>
        )}

        {/* Toggle panel */}
        <button
          onClick={() => setIsExpanded((p) => !p)}
          className={`w-12 h-12 rounded-full border-3 border-comic-dark flex items-center justify-center shadow-comic transition-all hover:scale-110 font-comic text-xs ${
            isExpanded
              ? "bg-comic-dark text-comic-yellow"
              : "bg-white text-comic-dark hover:bg-comic-yellow/30"
          }`}
          title="Voice assistant"
        >
          ⚡
        </button>

        {/* Mic FAB */}
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-14 h-14 rounded-full border-3 border-comic-dark flex items-center justify-center shadow-comic-lg transition-all hover:scale-110 ${
            isListening
              ? "bg-comic-red text-white animate-pulse shadow-comic-red"
              : "bg-comic-yellow text-comic-dark hover:bg-yellow-300"
          }`}
          title={isListening ? "Stop listening" : "Start voice command"}
        >
          <HiMicrophone className="h-6 w-6" />
          {listCount > 0 && !isListening && (
            <span className="absolute -top-1 -right-1 bg-comic-dark text-comic-yellow text-[10px] font-comic rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              {listCount > 9 ? "9+" : listCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceCommandPanel;
