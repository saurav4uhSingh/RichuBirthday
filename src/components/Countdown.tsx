/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { triggerBirthdayEffect } from "./SpecialEffects";
import { playChimeSFX, playPopSFX } from "./MusicPlayer";

export default function Countdown() {
  const [targetDateStr, setTargetDateStr] = useState(() => {
    const now = new Date();
    // May is month index 4. If current date is already past May 30, target next year, otherwise current year.
    let targetYear = now.getFullYear();
    if (now.getMonth() > 4 || (now.getMonth() === 4 && now.getDate() >= 30)) {
      // If it is on or after May 30th, we can default to this year or next,
      // but let's keep it on this year (2026) since the user wants the countdown for May 30, 2026 now
      targetYear = now.getFullYear();
    }
    const year = targetYear;
    const month = "05";
    const day = "30";
    return `${year}-${month}-${day}T00:00`;
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // Calculate timer values
  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // When timer hits zero, trigger massive confetti explosion
  useEffect(() => {
    if (timeLeft.isExpired) {
      triggerBirthdayEffect("fireworks");
      setTimeout(() => triggerBirthdayEffect("confetti"), 300);
      playChimeSFX();
    }
  }, [timeLeft.isExpired]);

  const handleManualExplosion = () => {
    playPopSFX();
    playChimeSFX();
    triggerBirthdayEffect("fireworks");
    triggerBirthdayEffect("emoji-rain");
  };

  return (
    <div className="max-w-xl mx-auto bg-gradient-to-br from-purple-950/50 to-pink-950/30 border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl backdrop-blur-xl text-center">
      
      {/* Icon Frame */}
      <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/10">
        <Clock className="w-6 h-6 text-pink-300 animate-pulse" />
      </div>

      {timeLeft.isExpired ? (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <span className="text-4xl animate-bounce inline-block">👑🎂🎀</span>
          <h3 className="text-xl md:text-2xl font-serif italic text-pink-200 font-extrabold tracking-tight text-glow">
            “Happy Birthday Richu! 🎂✨”
          </h3>
          <p className="text-xs text-purple-200/80 leading-relaxed max-w-sm mx-auto">
            The clock has struck midnight! Let the bells chime, the music play, and the laughter overflow because a truly wonderful soul is celebrating her birthday today!
          </p>

          <button
            onClick={handleManualExplosion}
            className="mt-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-xs rounded-full shadow-lg shadow-pink-550/15 hover:scale-105 active:scale-95 transition-all outline-none inline-flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Spark Midnight Magic ✨
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-pink-200 flex items-center justify-center gap-1.5 label-sans text-glow">
            ⏳ Counting Down to Her Miracle Moments
          </h3>
          <p className="text-[11px] text-purple-200/60 max-w-sm mx-auto leading-normal">
            Every second bringing us closer to celebrating one of the most hardworking and special minds! Ready to shower her with sweet wishes?
          </p>

          {/* Glowing Timer Blocks (Mobile responsive grids) with Animated Progress Rings */}
          <div className="grid grid-cols-4 gap-2.5 md:gap-4 max-w-md mx-auto pt-2">
            {[
              { label: "Days", val: timeLeft.days, max: 30 },
              { label: "Hours", val: timeLeft.hours, max: 24 },
              { label: "Mins", val: timeLeft.minutes, max: 60 },
              { label: "Secs", val: timeLeft.seconds, max: 60 }
            ].map((block, idx) => {
              const maxVal = block.max;
              const val = block.val;
              const percent = maxVal > 0 ? val / maxVal : 0;
              
              const radius = 28;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - percent * circumference;

              return (
                <div
                  key={idx}
                  className="bg-[#251033]/65 border border-white/5 p-2 md:p-3 rounded-2xl flex flex-col items-center justify-center shadow-xl relative overflow-hidden group hover:border-pink-500/25 transition duration-300 aspect-square"
                >
                  {/* Progress Ring wrapper */}
                  <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                      <defs>
                        <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#f472b6" />
                          <stop offset="100%" stopColor="#a78bfa" />
                        </linearGradient>
                      </defs>
                      {/* Background track circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className="stroke-white/10 fill-none"
                        strokeWidth="3"
                      />
                      {/* Foreground dynamic progress ring */}
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        className="fill-none transition-all duration-1000 ease-linear"
                        stroke={`url(#grad-${idx})`}
                        strokeWidth="3"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{
                          filter: "drop-shadow(0px 0px 4px rgba(244, 114, 182, 0.40))"
                        }}
                      />
                    </svg>

                    {/* Number block in the center */}
                    <span className="text-md md:text-xl font-mono font-bold text-pink-100 z-10">
                      {val.toString().padStart(2, "0")}
                    </span>
                  </div>

                  <span className="text-[8px] md:text-[9px] text-pink-300/80 font-mono tracking-[0.1em] font-semibold uppercase mt-1">
                    {block.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Date customize drawer toggler (Polished and tucked in gracefully) */}
      <div className="mt-8 pt-4 border-t border-white/10 flex flex-col items-center">
        <label className="text-[10px] text-purple-300 font-mono flex items-center gap-1.5 mb-2">
          <Calendar className="w-3 h-3 text-pink-300" /> Change Target Midnight Date:
        </label>
        <div className="flex items-center gap-2 max-w-xs w-full">
          <input
            type="datetime-local"
            value={targetDateStr}
            onChange={(e) => {
              playPopSFX();
              setTargetDateStr(e.target.value);
            }}
            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-[11px] text-purple-200 font-mono w-full focus:outline-none focus:ring-1 focus:ring-pink-400 outline-none text-center cursor-pointer hover:bg-white/10 transition"
          />
        </div>
        <p className="text-[9px] text-purple-200/40 mt-2 font-mono italic">
          *Set date to before the current time to trigger the "Expired / Birthday Today" screen!
        </p>
      </div>

    </div>
  );
}
