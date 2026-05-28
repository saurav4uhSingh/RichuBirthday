/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Flame, Wind, RotateCcw, Heart, Gift } from "lucide-react";
import { playChimeSFX, playPopSFX, playMagicSpellSFX } from "./MusicPlayer";
import { triggerBirthdayEffect } from "./SpecialEffects";

// Synthesizer wind sound for blowing candles
function playBlowWindSFX() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Create white noise for breeze/wind
    const bufferSize = ctx.sampleRate * 1.2; // 1.2 seconds of wind
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Filter to make it sound like a soft blowing "fooo"
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 1.2);
    filter.Q.setValueAtTime(3.0, now);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + 1.2);
  } catch (e) {
    // Ignore if audio blocked
  }
}

// Synthesizer slice cutting sound
function playCutCakeSFX() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Sweeping frequency that mimics "shhhp" slide cutting
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.35);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    // Ignore
  }
}

export default function CakeCutting() {
  const [candlesLit, setCandlesLit] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isCut, setIsCut] = useState(false);
  const [sliceTaken, setSliceTaken] = useState(false);
  const [hasFed, setHasFed] = useState(false);

  const handleLightCandles = () => {
    playChimeSFX();
    setCandlesLit(true);
    setCandlesBlown(false);
    triggerBirthdayEffect("emoji-rain", undefined, undefined, "✨");
  };

  const handleBlowCandles = () => {
    playBlowWindSFX();
    setCandlesBlown(true);
    triggerBirthdayEffect("confetti");
    
    // Play cheer sound after a short delay
    setTimeout(() => {
      playMagicSpellSFX();
      triggerBirthdayEffect("balloon-rise");
      triggerBirthdayEffect("emoji-rain", undefined, undefined, "🎉");
    }, 450);
  };

  const handleCutCake = () => {
    playCutCakeSFX();
    setIsCut(true);
    triggerBirthdayEffect("particle-pop");
    
    setTimeout(() => {
      playChimeSFX();
      setSliceTaken(true);
    }, 850);
  };

  const handleFeedSlice = () => {
    playMagicSpellSFX();
    setHasFed(true);
    triggerBirthdayEffect("hearts");
    triggerBirthdayEffect("confetti");
    
    setTimeout(() => {
      triggerBirthdayEffect("emoji-rain", undefined, undefined, "😋");
      triggerBirthdayEffect("balloon-rise");
    }, 400);
  };

  const handleReset = () => {
    playPopSFX();
    setCandlesLit(false);
    setCandlesBlown(false);
    setIsCut(false);
    setSliceTaken(false);
    setHasFed(false);
  };

  return (
    <div 
      id="interactive-cake-cutting-ceremony" 
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl max-w-2xl w-full mx-auto"
    >
      <div className="text-center mb-6">
        <span className="text-3.5xl animate-bounce inline-block mb-1">🍰</span>
        <h4 className="text-xs text-pink-300 font-mono tracking-[0.25em] uppercase font-bold text-glow">
          Live Ceremony Panel
        </h4>
        <h3 className="text-xl md:text-2xl font-serif font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-100 mt-1">
          Bina Cake Cutting Ke No Party! 🎂
        </h3>
        <p className="text-xs text-purple-200/70 max-w-md mx-auto mt-2 leading-relaxed">
          College b'days hamesha canteen mein cake ke dabbe par bina chaku ke celebrate hote the! Chalo is digital cake ko real and crazy college style ke saath cut karte hain.
        </p>
      </div>

      {/* Visual Arena of the Cake */}
      <div className="relative h-64 w-full bg-black/25 rounded-2xl border border-white/5 flex flex-col items-center justify-end pb-8 overflow-hidden">
        
        {/* Sky/Stars elements in the background */}
        <div className="absolute inset-x-0 top-4 flex justify-around pointer-events-none opacity-40">
          <span className="text-xs animate-pulse">🌟</span>
          <span className="text-sm animate-bounce animation-delay-1000">✨</span>
          <span className="text-xs animate-pulse animation-delay-500">🌸</span>
          <span className="text-sm animate-bounce">🎈</span>
        </div>

        {/* FEED ANIMATION - Floating Slice to Richu's face mockup */}
        <AnimatePresence>
          {hasFed && (
            <motion.div 
              initial={{ scale: 0.5, y: 10, opacity: 1 }}
              animate={{ y: -160, scale: [1, 1.4, 0.4], opacity: [1, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="absolute z-30 text-center"
            >
              <div className="text-4xl filter drop-shadow-[0_0_15px_rgba(236,72,153,0.7)]">🍰😋</div>
              <div className="text-[10px] uppercase font-mono font-bold text-pink-300 bg-pink-950/80 px-2 py-0.5 rounded-full border border-pink-500/20 mt-1">
                Yum! Delicious! 🤤🎂
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* THREE LAYERED BIRTHDAY CAKE */}
        <div className="relative flex flex-col items-center">
          
          {/* CANDLES ON TOP OF THE CAKE */}
          <div className="flex gap-4 mb-[-2px] z-10 transition-all duration-300">
            {[1, 2, 3].map((num) => {
              const sparkDelay = `${num * 200}ms`;
              return (
                <div key={num} className="relative w-2 h-10 bg-gradient-to-t from-purple-400 to-pink-300 rounded-t-sm flex flex-col items-center">
                  {/* Candlestick texture details */}
                  <div className="absolute inset-x-0.5 h-1 bg-white/30 top-2 rounded-sm pointer-events-none"></div>
                  <div className="absolute inset-x-0.5 h-1 bg-white/30 top-5 rounded-sm pointer-events-none"></div>
                  
                  {/* Candle Wick */}
                  <div className="w-[1px] h-2 bg-slate-400 mt-[-8px]"></div>

                  {/* ACTIVE FLICKERING FLAME */}
                  {candlesLit && !candlesBlown && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [1, 1.15, 0.95, 1.1, 1],
                        y: [0, -1, 0.5, -0.5, 0]
                      }}
                      transition={{ 
                        scale: { duration: 0.3 },
                        y: { repeat: Infinity, duration: 0.5, ease: "linear" }
                      }}
                      className="absolute top-[-16px] w-3 h-5 bg-gradient-to-t from-yellow-500 via-amber-400 to-red-500 rounded-full blur-[0.5px] cursor-pointer"
                      onClick={() => {
                        playPopSFX();
                        triggerBirthdayEffect("particle-pop");
                      }}
                    >
                      {/* Aura */}
                      <div className="w-4 h-4 bg-yellow-400/20 rounded-full absolute -left-0.5 -top-0.5 animate-ping opacity-45"></div>
                    </motion.div>
                  )}

                  {/* SMOKE FOR BLOWN OUT CANDLE */}
                  {candlesBlown && (
                    <motion.div 
                      initial={{ opacity: 0.7, y: -4, scale: 1 }}
                      animate={{ opacity: 0, y: -24, scale: 0.4 }}
                      transition={{ duration: 1.2 }}
                      className="absolute top-[-10px] text-[10px] select-none pointer-events-none"
                    >
                      💨
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CAKE BODY LAYER 3 (Top Layer) */}
          <motion.div 
            animate={isCut ? { x: -12, rotate: -2 } : { x: 0, rotate: 0 }}
            className="w-24 h-10 bg-[#e07a97] border-b-4 border-[#bc5471] rounded-t-lg relative flex justify-around items-end pb-1 shadow-md z-[3]"
          >
            {/* Frosting dripping drops */}
            <div className="absolute inset-x-0 top-0 h-3 bg-[#fca2b9] rounded-t-lg flex justify-between px-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2.5 h-4 bg-[#fca2b9] rounded-b-full"></div>
              ))}
            </div>
            {/* Cherries Top Decor */}
            <div className="absolute top-[-6px] left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
              <span className="text-[12px]">🍒</span>
              <span className="text-[12px]">🍒</span>
            </div>
          </motion.div>

          {/* CAKE BODY LAYER 2 (Middle Layer) */}
          <motion.div 
            animate={isCut ? { x: 8, rotate: 1 } : { x: 0, rotate: 0 }}
            className="w-36 h-12 bg-[#6b4c35] border-b-4 border-[#412e20] relative flex justify-around items-end pb-1 shadow-md z-[2]"
          >
            {/* White Cream Line decoration */}
            <div className="absolute inset-x-0 top-2 h-2.5 bg-pink-100 flex justify-between px-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-3 h-3.5 bg-pink-100 rounded-b-full shadow-inner"></div>
              ))}
            </div>
            {/* Sprinkles on middle layer */}
            <div className="absolute bottom-2 inset-x-4 flex justify-between text-[6px] opacity-80 pointer-events-none font-mono">
              <span className="text-blue-300">★</span>
              <span className="text-yellow-300">❤</span>
              <span className="text-pink-300">▲</span>
              <span className="text-green-300">◆</span>
            </div>
          </motion.div>

          {/* CAKE BODY LAYER 1 (Base Layer) */}
          <motion.div 
            animate={isCut ? { x: -5, rotate: -0.5 } : { x: 0, rotate: 0 }}
            className="w-48 h-14 bg-[#dcc9b6] border-b-6 border-[#b09e8b] rounded-b-sm relative flex justify-around items-end pb-1.5 shadow-lg z-[1]"
          >
            {/* Strawberry drip */}
            <div className="absolute inset-x-0 top-0 h-4 bg-[#e07a97] flex justify-between px-2 rounded-t-sm">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-3 h-5 bg-[#e07a97] rounded-b-full"></div>
              ))}
            </div>
            
            {/* Custom Interactive Knife during cutting */}
            <AnimatePresence>
              {!isCut && candlesBlown && (
                <motion.div 
                  initial={{ opacity: 0, y: -40, x: 20 }}
                  animate={{ opacity: 1, y: -8, x: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute z-10 top-[-40px] text-3xl animate-bounce"
                  style={{ transformOrigin: "bottom right" }}
                >
                  🔪
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sprinkles base level */}
            <div className="absolute bottom-3 inset-x-6 flex justify-between text-[8px] opacity-75 select-none font-mono">
              <span className="text-yellow-200">✨</span>
              <span className="text-rose-400">♥</span>
              <span className="text-indigo-300">✿</span>
              <span className="text-yellow-200">★</span>
            </div>
          </motion.div>
          
          {/* Glass serving stand tray */}
          <div className="w-56 h-3 bg-gradient-to-r from-white/20 via-white/40 to-white/10 rounded-full border border-white/15 shadow-xl relative z-0 flex justify-center mt-[-2px]">
            <div className="w-16 h-4 bg-white/20 rounded-b-md border border-white/10"></div>
          </div>
        </div>

        {/* SIDE SERVING PLATE WITH CAKE SLICE */}
        <AnimatePresence>
          {sliceTaken && (
            <motion.div 
              initial={{ opacity: 0, x: 120, scale: 0.5 }}
              animate={{ opacity: 1, x: 60, y: 15, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="absolute bottom-6 right-6 flex flex-col items-center z-10"
            >
              <div className="bg-[#ebd9c1] p-1.5 rounded-full border border-amber-300/30 flex items-center justify-center relative shadow-lg">
                <span className="text-xl animate-pulse">🍰</span>
                {/* Candle flame cherry */}
                <div className="absolute top-0 right-1 text-[8px]">🍒</div>
              </div>
              <span className="text-[9px] text-pink-300 font-bold uppercase tracking-wider font-mono mt-1 text-glow bg-black/40 px-2 py-0.5 rounded-full border border-pink-500/10">
                Richu's Slice! 🥳
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DYNAMIC CEREMONY STEP CONTROLLER */}
      <div className="mt-6 flex flex-col items-center space-y-4">
        
        {/* Step Indicator Prompt */}
        <div className="text-center px-4 py-3 bg-white/5 border border-white/10 rounded-2xl w-full text-xs">
          {!candlesLit && (
            <p className="text-purple-100 font-medium">
              🔔 <span className="text-pink-300 font-bold">Step 1:</span> Yaar, pehle digital matchbox uthao aur candles jalao! <br/>
              <span className="text-purple-200/50 italic text-[11px] mt-1 block">"Candles Jalao! Birthday feeling toh aaye."</span>
            </p>
          )}
          {candlesLit && !candlesBlown && (
            <p className="text-purple-100 font-medium">
              🔔 <span className="text-pink-300 font-bold">Step 2:</span> Wish maang lo chupke se! Ab screen par foonk maro (ya foonk button click karo) candles bujhane ke liye! 💨 <br/>
              <span className="text-purple-200/50 italic text-[11px] mt-1 block">"Oye, Fooo karke candle bujhao, fir cake katega!"</span>
            </p>
          )}
          {candlesBlown && !isCut && (
            <p className="text-purple-100 font-medium">
              🔔 <span className="text-pink-300 font-bold">Step 3:</span> Waah kya foonk mari hai! Ab chaku uthao aur cake par cut maro! 🔪🍰 <br/>
              <span className="text-purple-200/50 italic text-[11px] mt-1 block">"Apne dosto ki tarah chaku chalana seekho!"</span>
            </p>
          )}
          {isCut && !sliceTaken && (
            <p className="text-purple-100 font-medium">
              ⏳ Slice plate pe nikali ja rahi hai... tayaar raho!
            </p>
          )}
          {sliceTaken && !hasFed && (
            <p className="text-purple-100 font-medium">
              🔔 <span className="text-pink-300 font-bold">Step 4:</span> Slice ready hai! Chal ab sabse pehle Richu ko digital slice khilate hain! 😋🍰 <br/>
              <span className="text-purple-200/50 italic text-[11px] mt-1 block">"Chalo piece uthake Richu ko feed karo face par!"</span>
            </p>
          )}
          {hasFed && (
            <p className="text-pink-200 font-bold animate-pulse text-sm text-glow">
              🎉 Party Succeeded! Cake cut ho gaya aur Richu ne slice bhi kha liya! Sweet friend, stay amazing! ❤️🥂
            </p>
          )}
        </div>

        {/* CONTROLS ACTIONS BAR */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          
          {/* STEP 1: Light candles */}
          {!candlesLit && (
            <button
              onClick={handleLightCandles}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-pink-500 hover:from-amber-500 hover:to-pink-600 font-serif font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all text-white flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 animate-pulse fill-current" />
              Candles Jalao! 🕯️
            </button>
          )}

          {/* STEP 2: Blow candles */}
          {candlesLit && !candlesBlown && (
            <button
              onClick={handleBlowCandles}
              className="px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-650 hover:from-sky-500 hover:to-indigo-700 font-serif font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-sky-500/20 hover:scale-105 active:scale-95 transition-all text-white flex items-center gap-1.5 animate-bounce"
            >
              <Wind className="w-4 h-4 animate-spin" />
              FOOO... Candle Bujhao! 💨
            </button>
          )}

          {/* STEP 3: Cut the cake */}
          {candlesBlown && !isCut && (
            <button
              onClick={handleCutCake}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 font-serif font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 transition-all text-white flex items-center gap-1.5 animate-pulse"
            >
              <Sparkles className="w-4 h-4" />
              Cake Cut Karo! 🔪🎂
            </button>
          )}

          {/* STEP 4: Feed the slice */}
          {sliceTaken && !hasFed && (
            <button
              onClick={handleFeedSlice}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 font-serif font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-pink-550/20 hover:scale-105 active:scale-95 transition-all text-white flex items-center gap-1.5 animate-bounce"
            >
              <Heart className="w-4 h-4 fill-current animate-pulse text-pink-200" />
              Richu Ko Slice Khilao! 😋🍰
            </button>
          )}

          {/* RESET / REPLAY ACTION */}
          {(candlesLit || isCut || sliceTaken || hasFed) && (
            <button
              onClick={handleReset}
              className="w-10 h-10 rounded-full border border-white/10 hover:bg-white/15 bg-white/5 flex items-center justify-center text-purple-200 hover:scale-110 active:scale-95 transition shadow"
              title="Reset cake cutting ceremony"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
