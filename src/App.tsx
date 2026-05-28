/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Sparkles, 
  Moon, 
  Sun, 
  Gift, 
  PartyPopper,
  Volume2, 
  VolumeX, 
  Instagram, 
  ArrowDown, 
  Clock,
  Music,
  UserCheck
} from "lucide-react";

// Component imports
import MusicPlayer, { playChimeSFX, playPopSFX, playMagicSpellSFX } from "./components/MusicPlayer";
import SpecialEffects, { triggerBirthdayEffect } from "./components/SpecialEffects";
import PolaroidGallery from "./components/PolaroidGallery";
import Timeline from "./components/Timeline";
import SurpriseBoxes from "./components/SurpriseBoxes";
import Countdown from "./components/Countdown";
import CakeCutting from "./components/CakeCutting";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [finalMagicClicked, setFinalMagicClicked] = useState(false);

  // Auto scroll down to main content after landing unlocks
  useEffect(() => {
    if (isUnlocked) {
      // Small timeout for smooth experience
      setTimeout(() => {
        document.getElementById("main-portal-header")?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [isUnlocked]);

  const handleOpenSurprise = () => {
    setIsUnlocked(true);
    setIsMusicPlaying(true);
    
    // Play warm synthetics
    playMagicSpellSFX();

    // Spawn massive multi particles bursts
    setTimeout(() => {
      triggerBirthdayEffect("balloon-rise");
      triggerBirthdayEffect("confetti");
    }, 100);

    setTimeout(() => {
      triggerBirthdayEffect("emoji-rain");
    }, 400);
  };

  const toggleTheme = () => {
    playPopSFX();
    setIsDarkMode(!isDarkMode);
    triggerBirthdayEffect("emoji-rain", undefined, undefined, "✨");
  };

  const handleFinalMagic = () => {
    playMagicSpellSFX();
    setFinalMagicClicked(true);
    
    // Blast EVERYTHING!
    triggerBirthdayEffect("fireworks");
    triggerBirthdayEffect("hearts");
    
    setTimeout(() => {
      triggerBirthdayEffect("confetti");
    }, 200);

    setTimeout(() => {
      triggerBirthdayEffect("emoji-rain", undefined, undefined, "💖");
    }, 450);

    setTimeout(() => {
      triggerBirthdayEffect("balloon-rise");
    }, 600);
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen font-sans text-white transition-colors duration-300 relative overflow-x-hidden bg-[#0f0514]`}>
      {/* Dynamic Immersive Ambient Glowing Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-[-1] transition-all duration-500 bg-[#0f0514]">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-500/15 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none animate-pulse duration-5000"></div>
        
        {/* Decorative Floating Constellations */}
        <div className="absolute top-24 right-20 text-4xl opacity-20 select-none animate-gentle-float">✨</div>
        <div className="absolute bottom-24 right-40 text-2xl opacity-25 text-pink-500 select-none animate-gentle-float">💖</div>
        <div className="absolute top-40 left-1/4 text-2xl opacity-10 select-none animate-gentle-float">🎈</div>
        <div className="absolute bottom-10 left-10 text-3xl opacity-15 select-none animate-gentle-float">🧸</div>
      </div>

      {/* Persistent Special Effects (Cursor particles, Balloon-pop, Long press, Secret corner note) */}
      <SpecialEffects />

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          /* ================= LANDING SECTION ================= */
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative z-20 text-center bg-[#0f0514]/80"
          >
            {/* Center Envelope Gift Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="glass-panel rounded-3xl p-8 md:p-12 max-w-xl w-full shadow-2xl relative border border-white/10 text-center animate-gentle-float"
            >
              {/* Ribbon Graphic */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-550 rounded-t-3xl"></div>
              
              {/* Top Floating Stamp */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-600/40 border border-white/15 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/10">
                <Heart className="w-7 h-7 text-pink-300 animate-pulse fill-current" />
              </div>

              <h2 className="text-[10px] text-pink-300 font-mono tracking-[0.25em] uppercase font-bold mb-2 text-glow">
                A Precious surprise portal // Richu
              </h2>

              <h1 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-100 to-purple-200">
                “A Small Surprise For Someone Special 💖”
              </h1>

              <p className="text-xs text-purple-100/75 mt-4 leading-relaxed max-w-md mx-auto">
                Hey Richu, someone spent hours compiling memories, sweet quotes, and custom waltzes to light up your special day. Tap below to break the seal and unlock the magic! 🎁✨
              </p>

              {/* Music indicator for early autoplay prompt */}
              <div className="mt-6 flex justify-center items-center gap-1.5 text-[10px] text-purple-200/50 font-mono">
                <Music className="w-3.5 h-3.5 animate-spin text-pink-400" />
                <span>Background ambient sound will auto-start!</span>
              </div>

              {/* Core trigger button */}
              <button
                id="open-surprise-gift"
                onClick={handleOpenSurprise}
                className="mt-8 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-serif font-bold text-sm tracking-wide rounded-full shadow-lg shadow-pink-500/20 hover:shadow-pink-550/30 hover:scale-105 active:scale-95 transition-all outline-none flex items-center gap-2 mx-auto"
              >
                Open Surprise 🎁
              </button>
            </motion.div>

            {/* Quick footer credits */}
            <p className="absolute bottom-6 text-[10px] text-purple-200/30 font-mono tracking-wider">
              Tap anywhere to spawn sparkling stardust trails • Respect & Friendship Vows
            </p>
          </motion.div>
        ) : (
          /* ================= MAIN SURPRISE PORTAL ================= */
          <motion.div
            key="portal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full pb-24"
          >
            {/* STICKY TOP HEADER CONTROL RAIL */}
            <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/5 border-b border-white/10 py-4 px-6 md:px-8 shadow-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-pink-500/20">
                  🎂
                </div>
                <div>
                  <h1 className="text-base md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-100 leading-none">
                    Happy Birthday Richu✨
                  </h1>
                  <span className="text-[9px] text-pink-300 font-mono tracking-[0.2em] font-semibold uppercase block mt-1">
                    🎉 Friendship Keepsake Box
                  </span>
                </div>
              </div>

              {/* Header Right Sidebar Controls */}
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-full border border-pink-500/30 bg-pink-500/10 text-[9px] md:text-[10px] font-medium uppercase tracking-widest text-pink-200 hidden sm:block">
                  Playing: Soft Piano Lullaby 🎵
                </div>

                {/* Light/Dark Mode Switcher */}
                <button
                  id="theme-light-dark-toggle"
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 text-yellow-300 shadow-md transition"
                  title="Toggle Light/Dark Midnight mode"
                >
                  {isDarkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5 text-purple-200" />}
                </button>

                {/* Ambient music toggle helper */}
                <button
                  onClick={() => {
                    playChimeSFX();
                    setIsMusicPlaying(!isMusicPlaying);
                  }}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center hover:scale-105 active:scale-95 transition ${
                    isMusicPlaying 
                      ? "bg-pink-500/20 border-pink-500/50 text-pink-300 animate-pulse" 
                      : "bg-white/5 border-white/10 text-purple-300 hover:bg-white/15"
                  }`}
                  title="Mute/Unmute radio"
                >
                  {isMusicPlaying ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5" />}
                </button>
              </div>
            </header>

            <main className="max-w-7xl mx-auto space-y-24 pt-10" id="main-portal-header">
              
              {/* ================= HERO INTRO BANNER ================= */}
              <section className="px-4 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="max-w-3xl mx-auto bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl shadow-xl backdrop-blur-xl flex flex-col items-center relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-b from-pink-550/10 to-transparent rounded-bl-full pointer-events-none"></div>
                  
                  <span className="text-4xl mb-4 animate-gentle-float inline-block">🌸🎀🧸</span>
                  <h2 className="text-2xl md:text-4xl font-serif font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-100 leading-tight">
                    Happy Birthday Richu! 🎂✨
                  </h2>
                  <p className="text-xs md:text-sm text-purple-100/70 mt-4 leading-relaxed max-w-xl mx-auto">
                    Welcome to your personal surprise sanctuary. Today is all about celebrating your bright mind, your stunning achievements, and the happy vibes you spread. Scroll through your polaroid album, read funny memory timelines, and check the midnight clocks!
                  </p>

                  {/* Scroll down indicator */}
                  <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-pink-300 font-mono tracking-[0.25em] animate-bounce uppercase">
                    <span>Swipe down for scrapbook</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              </section>

              {/* ================= MUSIC SECTION (WEB SAMPLE SYNTHS) ================= */}
              <section className="px-4">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <h3 className="text-xs text-pink-300 font-mono tracking-[0.25em] uppercase font-extrabold text-glow">
                    🎵 Integrated Sound System
                  </h3>
                  <MusicPlayer isPlaying={isMusicPlaying} onPlayingChange={setIsMusicPlaying} />
                </div>
              </section>

              {/* ================= BIRTHDAY COUNTDOWN ================= */}
              <section className="px-4">
                <div className="max-w-3xl mx-auto text-center space-y-4 animate-in fade-in duration-500">
                  <h3 className="text-xs text-pink-300 font-mono tracking-[0.25em] uppercase font-extrabold text-glow">
                    ⏰ Time to Celebrate
                  </h3>
                  <Countdown />
                </div>
              </section>

              {/* ================= INTERACTIVE CAKE CUTTING CEREMONY ================= */}
              <section className="px-4">
                <CakeCutting />
              </section>

              {/* ================= PHOTO SCRAPBOOK MEMORY GALLERY ================= */}
              <section className="px-4">
                <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
                  <span className="text-3.5xl animate-gentle-float inline-block">🖼️</span>
                  <h3 className="text-xs text-pink-300 font-mono tracking-[0.25em] uppercase font-extrabold text-glow">
                    Scrapbook Polaroid Memories
                  </h3>
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-100 leading-tight">
                    Interactive Friendship Canvas 🌸
                  </h2>
                  <p className="text-xs md:text-sm text-purple-100/70 max-w-md mx-auto leading-normal">
                    Hover polaroids to zoom and rotate, or switch on the slideshow model!
                  </p>
                </div>
                <PolaroidGallery />
              </section>

              {/* ================= TIMELINE: OUR CUTE MEMORIES ================= */}
              <section className="px-4">
                <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
                  <span className="text-3.5xl animate-bounce inline-block">⏳</span>
                  <h3 className="text-xs text-pink-300 font-mono tracking-[0.25em] uppercase font-extrabold text-glow">
                    Milestones Book
                  </h3>
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-100 leading-tight">
                    "Our Cute Memories 🌸"
                  </h2>
                  <p className="text-xs md:text-sm text-purple-100/70 max-w-sm mx-auto leading-normal">
                    Click each capsule block on our vintage scroll line to shower corresponding celebratory particle clouds!
                  </p>
                </div>
                <Timeline />
              </section>

              {/* ================= SECRET SURPRISE BOXES ================= */}
              <section className="px-4">
                <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
                  <span className="text-3.5xl animate-pulse inline-block">🎁</span>
                  <h3 className="text-xs text-pink-300 font-mono tracking-[0.25em] uppercase font-extrabold text-glow">
                    Unveil Secrets
                  </h3>
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-200 to-purple-100 leading-tight">
                    Sealed Surprises Chest Index
                  </h2>
                  <p className="text-xs md:text-sm text-purple-100/70 max-w-md mx-auto leading-normal">
                    Crack open these four magical slots to cycle inspiring sunshine quotes, reveal envelopes, or summon the final success scroll keys!
                  </p>
                </div>
                <SurpriseBoxes />
              </section>

              {/* ================= FINAL SCREEN CARD ================= */}
              <section className="px-4 pb-12">
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-purple-950/50 border border-white/20 p-8 md:p-12 rounded-3xl shadow-2xl relative text-center overflow-hidden">
                  
                  {/* Confetti decoration */}
                  <div className="absolute top-4 left-4 text-pink-400 animate-gentle-float text-xl">🎈</div>
                  <div className="absolute top-4 right-4 text-pink-400 animate-gentle-float text-xl animation-delay-1000">🧸</div>

                  <h3 className="text-[10px] text-pink-300 font-mono tracking-[0.25em] uppercase font-bold mb-2 text-glow">
                    The Grand Celebration Card
                  </h3>

                  <h2 className="text-xl md:text-2xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-purple-100 to-pink-300 leading-snug">
                    “Happy Birthday Richu! 🎂💖 <br className="hidden md:block"/>
                    May your brilliance always shine bright ✨”
                  </h2>

                  <p className="text-xs text-purple-100/70 max-w-lg mx-auto leading-relaxed mt-4">
                    May this year reward all your dedication, and bless you with infinite laughter, quiet peaceful pauses, and stunning breakthroughs. You are a treasure to your friends and team! Shine forever!
                  </p>

                  <div className="mt-8">
                    <button
                      onClick={handleFinalMagic}
                      className={`px-8 py-3.5 font-serif font-bold text-xs tracking-wider rounded-full shadow-lg hover:shadow-pink-500/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all outline-none flex items-center gap-1.5 mx-auto ${
                        finalMagicClicked 
                          ? "bg-purple-900 text-white border border-pink-500/30 opacity-90 animate-pulse" 
                          : "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      }`}
                    >
                      <PartyPopper className="w-4 h-4 animate-bounce" />
                      {finalMagicClicked ? "Ultimate Magic Activated! ✨🎁" : "Tap For Final Magic ✨"}
                    </button>
                  </div>

                  {finalMagicClicked && (
                    <p className="text-[10px] text-pink-300 font-mono mt-4 animate-pulse uppercase tracking-[0.1em] text-glow">
                      💖 Full Hearts, Cascading Balloons & Rainbow Sparks unleashed! Enjoy your day! 💖
                    </p>
                  )}
                </div>
              </section>

            </main>

            {/* FULL COMPACT FOOTER */}
            <footer className="mt-16 py-8 border-t border-white/10 text-center space-y-2">
              <p className="text-purple-200/40 text-[10px] font-mono tracking-widest uppercase">
                Happy Birthday Richu 🎂✨ • Friendship Keepsake Vows
              </p>
              <p className="text-purple-300/30 text-[9px] font-mono">
                Synthesized in high fidelity • Works offline • Desktop Responsive
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
