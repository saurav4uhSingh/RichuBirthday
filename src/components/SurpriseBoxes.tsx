/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Quote, Eye, EyeOff, Sparkles, Heart, Gift, MessageCircle, X } from "lucide-react";
import { SecretBox } from "../types";
import { triggerBirthdayEffect } from "./SpecialEffects";
import { playChimeSFX, playPopSFX, playMagicSpellSFX } from "./MusicPlayer";

const MOCK_QUOTES = [
  "“You make ordinary moments feel special, Richu ✨”",
  "“Stay happy, stay brilliant and shine brighter than the stars forever 🌸”",
  "“Some people become beautiful, lifelong memories without trying 💖”",
  "“In a sky full of clouds, you are the warmest, coziest rainbow 🌈✨”",
  "“Your positive energy has the magical power to brighten up the darkest days! 🌟🌷”"
];

const SECRET_MESSAGE = 
  "Dear Richu, on this beautiful day, I want you to know how truly special and loved you are by everyone around you! 🌸 Your kindness, gentle heart, and stunning warmth bring massive joy to our team and friendships. May your confidence never dim, your goals be accomplished, and this new chapter usher in endless miracles, peaceful paths, and deep joy! Happy Birthday! 🎂✨💖";

export default function SurpriseBoxes() {
  const [openedBox, setOpenedBox] = useState<{ [key: string]: boolean }>({});
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showFinalModal, setShowFinalModal] = useState(false);

  const handleBoxClick = (id: string, type: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    // Toggle box opening state
    setOpenedBox((prev) => ({ ...prev, [id]: !prev[id] }));
    playPopSFX();

    if (type === "quote") {
      playChimeSFX();
      setQuoteIdx((prev) => (prev + 1) % MOCK_QUOTES.length);
      triggerBirthdayEffect("confetti", clickX, clickY);
    } else if (type === "message") {
      playChimeSFX();
      triggerBirthdayEffect("hearts", clickX, clickY);
    } else if (type === "explosion") {
      // Massive emoji bomb!
      playMagicSpellSFX();
      triggerBirthdayEffect("emoji-rain", clickX, clickY);
      // Spawn extra multi confetti
      setTimeout(() => {
        triggerBirthdayEffect("confetti", clickX, clickY);
      }, 200);
    } else if (type === "modal") {
      // Open the grand congratulations window
      playMagicSpellSFX();
      triggerBirthdayEffect("fireworks", clickX, clickY);
      setShowFinalModal(true);
    }
  };

  return (
    <div className="w-full">
      {/* 4 Surprise Boxes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        
        {/* Box 1: 🎁 Click Here Box (Quotes) */}
        <div
          onClick={(e) => handleBoxClick("quote", "quote", e)}
          className={`group bg-white/5 border border-white/10 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-98 transition duration-300 backdrop-blur-xl cursor-pointer flex flex-col items-center text-center relative overflow-hidden ${
            openedBox["quote"] ? "ring-2 ring-pink-500/40" : ""
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 transition duration-300 group-hover:scale-110 shadow-md">
            <Gift className={`w-8 h-8 text-pink-300 ${openedBox["quote"] ? "animate-bounce" : ""}`} />
          </div>
          <h4 className="text-sm font-bold text-pink-100">🎁 Sunshine Quotes</h4>
          <p className="text-[10px] text-pink-300 font-mono mt-1.5 uppercase font-bold tracking-widest text-glow">
            {openedBox["quote"] ? "Click for Next Quote" : "Tap to Open"}
          </p>

          {openedBox["quote"] ? (
            <div className="mt-4 px-3 py-3 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl border border-pink-500/20 animate-in fade-in slide-in-from-bottom-2 duration-350 min-h-[90px] flex items-center justify-center">
              <p className="text-pink-100 italic font-serif text-xs leading-relaxed animate-pulse">
                {MOCK_QUOTES[quoteIdx]}
              </p>
            </div>
          ) : (
            <p className="text-xs text-purple-200/60 mt-3 leading-relaxed max-w-[190px]">
              Open to unlock a random scroll of brilliant sunshine and friendship wisdom! ✨
            </p>
          )}
          {/* Subtle sparkles decoration */}
          <Sparkles className="absolute top-3 right-3 text-pink-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition animate-spin" />
        </div>

        {/* Box 2: 💖 Hidden Message Box (Scroll content) */}
        <div
          onClick={(e) => handleBoxClick("message", "message", e)}
          className={`group bg-white/5 border border-white/10 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-98 transition duration-300 backdrop-blur-xl cursor-pointer flex flex-col items-center text-center relative overflow-hidden ${
            openedBox["message"] ? "ring-2 ring-rose-500/40" : ""
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 transition duration-300 group-hover:scale-110 shadow-md">
            <Heart className={`w-8 h-8 text-rose-300 ${openedBox["message"] ? "animate-pulse" : ""}`} />
          </div>
          <h4 className="text-sm font-bold text-pink-105 text-pink-100">💖 Hidden Message</h4>
          <p className="text-[10px] text-rose-300 font-mono mt-1.5 uppercase font-bold tracking-widest text-glow">
            {openedBox["message"] ? "Tap to seal scroll" : "Tap to Read"}
          </p>

          {openedBox["message"] ? (
            <div className="mt-4 px-3 py-3.5 bg-gradient-to-br from-rose-900/30 to-purple-900/20 border border-rose-505/25 dark:border-rose-500/30 border-rose-500/20 rounded-2xl text-left animate-in slide-in-from-bottom-3 duration-300">
              <p className="text-pink-150 text-xs font-serif leading-relaxed italic text-center">
                “Some souls are born to capture sunlight. Thank you for being the quiet, warm starlight that lights up our work, classes, and hearts! Stay bright, Richa! 🌟🌿”
              </p>
            </div>
          ) : (
            <p className="text-xs text-purple-200/60 mt-3 leading-relaxed max-w-[190px]">
              Hold your breath and crack this sealed heart envelope to read a special birthday note written for you. 🌹
            </p>
          )}
          <Sparkles className="absolute top-3 right-3 text-rose-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition animate-spin" />
        </div>

        {/* Box 3: 🌸 One More Surprise (Emoji Blast) */}
        <div
          onClick={(e) => handleBoxClick("explosion", "explosion", e)}
          className="group bg-white/5 border border-white/10 p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-98 transition duration-300 backdrop-blur-xl cursor-pointer flex flex-col items-center text-center relative overflow-hidden animate-in"
        >
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 transition duration-300 group-hover:scale-110 shadow-md">
            <span className="text-3xl animate-bounce">🌸</span>
          </div>
          <h4 className="text-sm font-bold text-pink-100">🌸 One More Surprise</h4>
          <p className="text-[10px] text-amber-300 font-mono mt-1.5 uppercase font-bold tracking-widest text-glow">
            Click to Blast!
          </p>

          <p className="text-xs text-purple-200/60 mt-3 leading-relaxed max-w-[190px]">
            Ready for some crazy magic? Grab your goggles and click this flower button to trigger an epic, colorful emoji explosion! 🎆🎪
          </p>
          <Sparkles className="absolute top-3 right-3 text-amber-400 w-4 h-4 opacity-0 group-hover:opacity-100 transition animate-spin" />
        </div>

        {/* Box 4: ✨ Final Surprise (Modal pop trigger) */}
        <div
          onClick={(e) => handleBoxClick("modal", "modal", e)}
          className="group bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-purple-900/20 border border-pink-500/20 p-6 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-98 transition duration-300 backdrop-blur-xl cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4 transition duration-300 group-hover:scale-110 shadow-lg shadow-pink-500/10">
            <Sparkles className="w-7 h-7 text-white animate-spin" />
          </div>
          <h4 className="text-sm font-bold text-pink-100">✨ Grand Final Surprise</h4>
          <p className="text-[10px] text-purple-300 font-mono mt-1.5 uppercase font-bold tracking-widest text-glow">
            Open the Portal
          </p>

          <p className="text-xs text-purple-200/60 mt-3 leading-relaxed max-w-[190px]">
            The key to the final miracle. Unlock this majestic chest to reveal the ultimate greeting message of lifetime success, happiness, and peace! 🌈👑
          </p>
          <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition duration-300"></div>
        </div>

      </div>

      {/* Full Screen Grand Congratulations Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-pink-950 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl max-w-xl w-full text-center relative max-h-[90vh] overflow-y-auto animate-zoom-in">
            {/* Close button */}
            <button
               onClick={() => {
                 playPopSFX();
                 setShowFinalModal(false);
               }}
               className="absolute top-4 right-4 text-purple-300 hover:text-pink-400 transition cursor-pointer w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon banner */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-5 shadow-lg relative">
              <span className="text-4xl animate-bounce">👑</span>
              <div className="absolute inset-x-0 -bottom-1 bg-[#1a0a2a] border border-pink-500/30 text-pink-300 font-mono text-[9px] px-2 py-0.5 rounded-full uppercase font-bold shadow-xs tracking-wider">
                Richu is special
              </div>
            </div>

            {/* Title Header */}
            <h3 className="font-serif italic text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-pink-300 leading-tight font-extrabold text-glow">
              A Special Message From All Of Us 💌
            </h3>
            
            {/* Dividing sparkle divider lines */}
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto my-4"></div>

            {/* Detailed letters body */}
            <div className="bg-purple-900/20 rounded-2xl border border-pink-500/20 p-5 mt-4 text-left shadow-inner">
              <p className="text-purple-100/90 text-xs md:text-sm font-sans leading-relaxed text-center italic">
                "{SECRET_MESSAGE}"
              </p>
            </div>

            {/* Decorative button */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  playMagicSpellSFX();
                  // Fire multi fireworks instantly
                  triggerBirthdayEffect("fireworks");
                  setTimeout(() => triggerBirthdayEffect("fireworks", window.innerWidth * 0.3), 300);
                  setTimeout(() => triggerBirthdayEffect("fireworks", window.innerWidth * 0.7), 600);
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-xs rounded-full shadow-lg shadow-pink-500/10 hover:scale-105 active:scale-95 transition-all outline-none flex items-center gap-1.5"
              >
                Spark More Fireworks 🎆
              </button>
              <button
                onClick={() => {
                  playChimeSFX();
                  triggerBirthdayEffect("emoji-rain", undefined, undefined, "💖");
                }}
                className="px-5 py-2.5 bg-white/10 text-pink-300 border border-pink-500/20 font-semibold text-xs rounded-full hover:bg-white/15 active:scale-95 transition"
              >
                Shower Love 🌸
              </button>
            </div>
            
            <p className="text-[10px] text-purple-300/40 mt-4 font-mono">
              Designed with friendship and absolute respect • Happy Birthday!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
