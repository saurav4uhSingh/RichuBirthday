/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { UploadCloud, Trash2, Heart, Play, Square, ChevronLeft, ChevronRight, Eye, RefreshCw, Crop } from "lucide-react";
import { MemoryImage } from "../types";
import { triggerBirthdayEffect } from "./SpecialEffects";
import { playChimeSFX, playPopSFX } from "./MusicPlayer";

// Images originally provided in workspace (reverted to original untouched set)
const DEFAULT_MEMORIES: MemoryImage[] = [
  {
    id: "default-1",
    src: "https://lh3.googleusercontent.com/d/1-S6-FnYH3wFB2xQo3RusQ7L5uxblmS83",
    caption: "Tum sach mein bahut special ho, Richu! Humesha aise hi haste muskurate rehna aur positive vibes bikherte rehna. Happy Birthday, superstar! 🥰🎂💖",
    date: "Pyari Richu ke liye"
  },
  {
    id: "default-2",
    src: "https://lh3.googleusercontent.com/d/1fKGRTKCBrTKeMxKGOA742SRBJNMrJI5o",
    caption: "Kitni saari bakbak, crazy jokes aur endless coffee/chai sessions! Tere saath har ek moment ekdum priceless ban jata hai, keep sharing these golden smiles forever! ☕🤪✨",
    date: "Dosti Ke Pal",
    objectPosition: "top"
  },
  {
    id: "default-3",
    src: "https://lh3.googleusercontent.com/d/1v1_LxnH-4fsKfFu98ENNjJ3934QlFcjp",
    caption: "Campus ke shor mein bhi tere saath ka sukoon sabse alag raha hai. Tere saath baithna, assignment discuss karna aur life ke random topics par ganton baat karna college life ka sabse favourite part hai. Tu mera sabse special companion aur sweet blessing hai! 🏫🤝❤️",
    date: "Sath Tera 💖"
  },
  {
    id: "default-4",
    src: "https://lh3.googleusercontent.com/d/15HHRMTda8uhPg9zgdHLf619z1-vnOf11",
    caption: "Chahe college submissions ka stress ho ya semester exam ki chinta, tera calm aur supporting nature hamesha sab teekh kar deta hai. Tujhse seekha hai ki choti-choti chizon ko kaise dil se celebrate karte hain. Hamesha aise hi bright aur chamakti rehna! 🎈🌸✨",
    date: "Sunder Yaadein 🌸"
  }
];

export default function PolaroidGallery() {
  const [images, setImages] = useState<MemoryImage[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);
  const [doubleTapMsg, setDoubleTapMsg] = useState<{ id: string; text: string } | null>(null);
  const lastTapRef = useRef<{ [key: string]: number }>({});
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // Load from local storage or fallback to defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem("richa_birthday_memories_v13");
      if (stored) {
        setImages(JSON.parse(stored));
      } else {
        setImages(DEFAULT_MEMORIES);
      }
    } catch {
      setImages(DEFAULT_MEMORIES);
    }
  }, []);

  // Save to local storage helper
  const saveImages = (newList: MemoryImage[]) => {
    setImages(newList);
    try {
      localStorage.setItem("richa_birthday_memories_v13", JSON.stringify(newList));
    } catch (e) {
      alert("Local storage is full. Try deleting some photos first before adding!");
    }
  };

  // Slideshow play timer
  useEffect(() => {
    let interval: number;
    if (isPlayingSlideshow) {
      interval = window.setInterval(() => {
        handleNextSlide();
      }, 4000); // 4 seconds per slide
    }
    return () => clearInterval(interval);
  }, [isPlayingSlideshow, images.length]);

  const handleNextSlide = () => {
    if (images.length === 0) return;
    setActiveSlideIndex((prev) => {
      const nextIdx = (prev + 1) % images.length;
      const targetImg = images[nextIdx];
      if (targetImg) {
        triggerSlideEffects(targetImg.caption || "");
      }
      return nextIdx;
    });
  };

  const handlePrevSlide = () => {
    if (images.length === 0) return;
    setActiveSlideIndex((prev) => {
      const nextIdx = prev === 0 ? images.length - 1 : prev - 1;
      const targetImg = images[nextIdx];
      if (targetImg) {
        triggerSlideEffects(targetImg.caption || "");
      }
      return nextIdx;
    });
  };

  const triggerSlideEffects = (caption: string) => {
    // Play sound and trigger falling emoji rain as requested
    const emojiList = ["🎂", "💖", "🌸", "✨", "🎉", "🎀", "🧸"];
    const randomEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    triggerBirthdayEffect("emoji-rain", undefined, undefined, randomEmoji);
    playPopSFX();
  };

  // Image upload handler (Drag and Drop base64 helper)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      const newImage: MemoryImage = {
        id: `user-${Date.now()}`,
        src: base64Str,
        caption: `Happy Birthday Richu! Added with love on ${new Date().toLocaleDateString()} 💖`,
        date: "Special Story",
        isUserUploaded: true
      };
      
      const updatedList = [...images, newImage];
      saveImages(updatedList);
      playChimeSFX();
      triggerBirthdayEffect("confetti");
    };
    reader.readAsDataURL(file);
  };

  const deleteImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = images.filter((img) => img.id !== id);
    saveImages(updated);
    playPopSFX();
    // Adjust slide indices if index is out of bounds
    if (activeSlideIndex >= updated.length && updated.length > 0) {
      setActiveSlideIndex(updated.length - 1);
    }
  };

  const cycleImageCrop = (id: string) => {
    playPopSFX();
    const updated = images.map((img) => {
      if (img.id === id) {
        let nextPos = "center";
        const currentPos = img.objectPosition || "center";
        if (currentPos === "center") {
          nextPos = "top";
        } else if (currentPos === "top") {
          nextPos = "center 15%";
        } else if (currentPos === "center 15%") {
          nextPos = "center 25%";
        } else if (currentPos === "center 25%") {
          nextPos = "bottom";
        } else {
          nextPos = "center";
        }
        return { ...img, objectPosition: nextPos };
      }
      return img;
    });
    saveImages(updated);
  };

  const resetToDefault = () => {
    saveImages(DEFAULT_MEMORIES);
    setActiveSlideIndex(0);
    playChimeSFX();
  };

  // Double tap handler
  const handlePhotoTap = (id: string) => {
    const now = Date.now();
    const lastTap = lastTapRef.current[id] || 0;
    const delay = now - lastTap;

    if (delay < 300) {
      // Double tap detected!
      playChimeSFX();
      triggerBirthdayEffect("hearts");
      
      const messages = [
        "Double Tap Magic: Richu, you make ordinary moments feel special! ✨",
        "Double Tap Magic: Wishing you the happiest vibes today! Stay awesome 💖",
        "Double Tap Magic: Friendship is a masterpiece, and you are its brightest star! 🌸",
        "Double Tap Magic: Keep shining and let your brilliant energy light up the sky! 🧸"
      ];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setDoubleTapMsg({ id, text: randomMsg });

      // Clear note bubble after 4 seconds
      setTimeout(() => {
        setDoubleTapMsg(null);
      }, 4500);
    }
    lastTapRef.current[id] = now;
  };

  return (
    <div className="w-full">
      {/* Slideshow Player Frame */}
      {images.length > 0 && (
        <div id="polaroid-slideshow-bracket" className="relative max-w-xl mx-auto mb-10 overflow-hidden rounded-3xl bg-[#251033]/65 border border-white/10 p-4 md:p-6 shadow-2xl backdrop-blur-xl animate-in fade-in">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-slate-950 flex items-center justify-center">
            {/* Slide Image */}
            <img
              src={images[activeSlideIndex].src}
              alt={images[activeSlideIndex].caption}
              className="max-h-full max-w-full object-contain transition-all duration-500 ease-in-out"
              referrerPolicy="no-referrer"
            />
            
            {/* Shadow overlay gradient */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent p-5 pt-20 flex flex-col justify-end text-left">
              <span className="text-[10px] text-pink-300 font-mono tracking-widest uppercase font-bold text-glow">
                SCRAPBOOK SLIDESHOW • {images[activeSlideIndex].date || "Memory"}
              </span>
              <p className="text-white text-xs md:text-sm mt-1 font-serif italic">
                "{images[activeSlideIndex].caption}"
              </p>
            </div>

            {/* Bubble click warning */}
            <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/15 text-[9px] text-white py-1 px-2.5 rounded-full uppercase tracking-widest">
              Slide {activeSlideIndex + 1} of {images.length}
            </div>
          </div>

          {/* Slider controls toolbar */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex gap-1.5">
              <button
                onClick={handlePrevSlide}
                className="w-10 h-10 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition"
                title="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSlide}
                className="w-10 h-10 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition"
                title="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                playChimeSFX();
                setIsPlayingSlideshow(!isPlayingSlideshow);
                triggerBirthdayEffect("confetti");
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition shadow-md outline-none ${
                isPlayingSlideshow
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-white/10 hover:bg-white/15 text-purple-200 border border-white/10"
              }`}
            >
              {isPlayingSlideshow ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" /> Pause Slideshow
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current animate-pulse" /> Play Slideshow
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Gallery (Polaroid Frames) */}
      <h3 className="text-center font-mono text-glow text-[11px] mb-8 leading-relaxed font-bold tracking-[0.1em] uppercase flex items-center justify-center gap-1.5 text-pink-300">
        ✨ Tap anywhere on cards to show love, or tap the photo directly to zoom! 💖
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
        {images.map((img, idx) => {
          // Add random rotations for messy vintage scrapbook look
          const rotationClass =
            idx % 4 === 0
              ? "-rotate-2"
              : idx % 4 === 1
              ? "rotate-3"
              : idx % 4 === 2
              ? "-rotate-1"
              : "rotate-2";

          return (
            <div
              key={img.id}
              onClick={() => {
                playPopSFX();
                triggerBirthdayEffect("hearts");
                
                const messages = [
                  "Richu, you make ordinary moments feel special! ✨",
                  "Wishing you the happiest vibes today! Stay awesome 💖",
                  "Friendship is a masterpiece, and you are its brightest star! 🌸",
                  "Keep shining and let your brilliant energy light up the sky! 🧸"
                ];
                const randomMsg = messages[idx % messages.length];
                setDoubleTapMsg({ id: img.id, text: randomMsg });

                // Clear note bubble after 4.5 seconds
                setTimeout(() => {
                  setDoubleTapMsg(null);
                }, 4500);
              }}
              className={`relative bg-[#fbf9f4] p-4.5 pb-6 shadow-xl rounded-sm border border-[#e8e3d5] hover:scale-[1.04] hover:-rotate-1 hover:shadow-[0_0_30px_rgba(244,143,177,0.3)] hover:border-pink-300/40 transition-all duration-300 ease-out cursor-pointer group select-none flex flex-col justify-between ${rotationClass}`}
            >
              {/* Pin Accent */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-pink-400/40 border border-white flex items-center justify-center shadow-md z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-600"></div>
              </div>

              {/* Polaroid Image Wrapper with click-to-zoom for easy access on mobile */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(idx);
                  playChimeSFX();
                  triggerBirthdayEffect("emoji-rain", undefined, undefined, "✨");
                }}
                className="relative aspect-square w-full rounded-sm overflow-hidden bg-[#fafafa] border border-[#e8e4d3] group-hover:border-pink-300/40"
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover transition duration-300 group-hover:brightness-105 pointer-events-none"
                  style={{ objectPosition: img.objectPosition || "center" }}
                  referrerPolicy="no-referrer"
                />

                {/* Floating controls specifically built to be responsive and easy to tap on phones */}
                <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                  {img.isUserUploaded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(img.id, e);
                      }}
                      className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-500 text-red-600 hover:text-white flex items-center justify-center shadow-lg transition active:scale-90"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="absolute top-2 left-2 flex gap-1.5 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cycleImageCrop(img.id);
                      triggerBirthdayEffect("emoji-rain", undefined, undefined, "✂️");
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-pink-650 text-pink-600 flex items-center justify-center shadow-lg transition active:scale-90"
                    title="Adjust Crop"
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                </div>

                {/* Always-visible Tap-to-Zoom layout indicator in lower corner */}
                <div className="absolute bottom-2 right-2 z-10">
                  <div className="w-8 h-8 rounded-full bg-white/90 text-slate-800 flex items-center justify-center shadow-lg transition group-hover:scale-110">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Tape Look on User Uploads */}
              {img.isUserUploaded && (
                <div className="absolute -top-2 left-3 w-12 h-5 bg-yellow-100/60 border border-dashed border-yellow-200/50 backdrop-blur-xs -rotate-12"></div>
              )}

              {/* Photo Description Handwriting Vibe */}
              <div className="mt-4.5 px-1 min-h-[50px] flex flex-col justify-between">
                <p className="text-slate-800 text-xs text-center font-serif leading-relaxed line-clamp-3">
                  {img.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-3 self-end w-full">
                  <span>{img.date || "Scrapbook"}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-pink-400 font-mono font-bold animate-pulse">Tap Card 💌</span>
                    <Heart className="w-3.5 h-3.5 text-pink-400 hover:text-rose-500 transition group-hover:scale-120 fill-pink-50" />
                  </div>
                </div>
              </div>

              {/* Secret Message Bubble */}
              {doubleTapMsg && doubleTapMsg.id === img.id && (
                <div className="absolute inset-x-2 -bottom-2 translate-y-full bg-gradient-to-r from-pink-500 to-rose-500 text-white p-3 rounded-2xl shadow-xl z-30 font-medium text-[11px] leading-relaxed text-center animate-in zoom-in-95 duration-150">
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-pink-500"></div>
                  {doubleTapMsg.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal overlay layer */}
      {lightboxIndex !== null && (
        <div 
          onClick={() => setLightboxIndex(null)}
          className="fixed inset-0 bg-slate-950/98 backdrop-blur-2xl z-[999] flex flex-col items-center justify-between py-6 px-4 md:p-8 animate-fade-in animate-in duration-200 select-none"
        >
          {/* Top Quick-Exit Bar for iPhone / Mobile */}
          <div className="w-full max-w-lg flex justify-between items-center z-[1000] pb-2">
            <span className="text-[11px] text-pink-300 font-mono tracking-wider uppercase font-bold text-glow">
              Viewing Memory {lightboxIndex + 1} of {images.length}
            </span>
            <button
              onClick={() => {
                playPopSFX();
                setLightboxIndex(null);
              }}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 active:bg-pink-600 active:text-white border border-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 min-h-[44px]"
            >
              <span className="text-sm font-bold">✕</span> Go Back
            </button>
          </div>

          {/* Lightbox content container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex flex-col justify-center items-center w-full max-w-lg my-auto"
          >
            {/* Lightbox Image inside Polaroid styled thick frame */}
            <div 
              onClick={() => {
                triggerBirthdayEffect("hearts");
                playChimeSFX();
              }}
              className="bg-[#fbf9f4] p-4.5 pb-10 rounded-lg shadow-2xl w-full transform rotate-1 border border-[#e1dac8] cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950 rounded-md">
                <img
                  src={images[lightboxIndex].src}
                  alt={images[lightboxIndex].caption}
                  className="w-full h-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-4 text-center px-2">
                <p className="text-slate-800 font-serif italic text-xs md:text-sm leading-relaxed">
                  "{images[lightboxIndex].caption}"
                </p>
                <p className="text-[10px] text-pink-500 font-mono tracking-widest mt-2 uppercase font-bold text-glow">
                  🌿 {images[lightboxIndex].date || "Surprise Memory"} 🌿
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons at bottom containing a direct click/touch back option & celebration */}
          <div className="w-full max-w-lg flex flex-col gap-3 items-center z-[1000] pt-4">
            <div className="flex gap-3 w-full">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerBirthdayEffect("confetti", window.innerWidth / 2, window.innerHeight * 0.4);
                  triggerChimeRain();
                }}
                className="flex-1 min-h-[46px] py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-500/10 hover:scale-102 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                🎉 Celebrate!
              </button>

              <button
                onClick={() => {
                  playPopSFX();
                  setLightboxIndex(null);
                }}
                className="flex-1 min-h-[46px] py-2.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl border border-white/20 active:bg-red-500 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                ✕ Cut / Back 🚪
              </button>
            </div>
            <p className="text-[10px] text-slate-400 font-mono text-center mb-1">
              Tap anywhere outside or click either button to return
            </p>
          </div>
        </div>
      )}
    </div>
  );

  function triggerChimeRain() {
    playChimeSFX();
    triggerBirthdayEffect("emoji-rain", undefined, undefined, "💖");
  }
}
