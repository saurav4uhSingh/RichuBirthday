/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, MessageSquare, GraduationCap, Heart, Award, ArrowUpRight } from "lucide-react";
import { TimelineItem } from "../types";
import { triggerBirthdayEffect } from "./SpecialEffects";
import { playChimeSFX, playPopSFX } from "./MusicPlayer";

const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "time-1",
    title: "First Day Vali Pehchan 🎓",
    period: "First Meeting",
    description: "Pehle din ka wo random meeting jab humne ek dusre ko nervous smiles ke saath formal high-hello kiya tha! Kisne socha tha ki wo formal handshakes aur awkward introductions ek din roz ke non-stop chit-chats aur kabhi na khatam hone wali dosti mein badal jayenge.",
    emoji: "💖",
    bgColor: "bg-pink-50/70",
    borderColor: "border-pink-200/60",
    shadowColor: "shadow-pink-100/50"
  },
  {
    id: "time-2",
    title: "Constant Bakbak aur Inside Jokes 😂",
    period: "Backbenchers Vibe",
    description: "Roz ke dher saare stupid memes share karna, aisi baatein jinka matlab sirf hum dono ko hi samajh aaye, aur lectures ke beech achanak bina kisi wajah ke has padna! Apni poori chat history crazy jokes aur chaotic pagalpanti se bhari padi hai.",
    emoji: "🧸",
    bgColor: "bg-amber-50/70",
    borderColor: "border-amber-200/60",
    shadowColor: "shadow-amber-100/50"
  },
  {
    id: "time-3",
    title: "Lectures Bunk & Canteen Chai ☕",
    period: "College Diaries",
    description: "Sabse boring lectures ko bunk karke canteen mein ghanton baithna, exams se ek raat pehle crash syllabus padhna, aur assignment copy karne ki bhaagam-bhaag! Notebook ke peeche random scribble karna aur chai ke sath gappe marna hi sabse best part tha.",
    emoji: "🌸",
    bgColor: "bg-purple-50/70",
    borderColor: "border-purple-200/60",
    shadowColor: "shadow-purple-100/50"
  },
  {
    id: "time-4",
    title: "Har Baar Ka Sath & Supporting Hand 🤗",
    period: "Pakki Dosti",
    description: "Zindagi ke har high aur low moment mein tera hamesha ek supportive pillars ki tarah khade rehna sabse bada blessing hai. Apni dosti mein sabse achhi baat yahi hai ki bina bole hi hum ek dusre ki baat samajh jaate hain. Promise hai, ye sath hamesha aise hi rahega!",
    emoji: "🎂",
    bgColor: "bg-teal-50/70",
    borderColor: "border-teal-200/60",
    shadowColor: "shadow-teal-100/50"
  },
  {
    id: "time-5",
    title: "Nayi Udaan aur Dramebaaz Future 🚀",
    period: "Future Aspirations",
    description: "Ab collage ke baad aage ke bade-bade milestones ko conquer karna hai! Richu, tu jis bhi raah pe chalegi, apni mehnat aur positive energy se dhoom macha degi. Apne saare dreams ekdum shiddat se sach kar aur hamesha dosti ke sath aage badhti reh!",
    emoji: "✨",
    bgColor: "bg-blue-50/70",
    borderColor: "border-blue-200/60",
    shadowColor: "shadow-blue-100/50"
  }
];

export default function Timeline() {
  const getIcon = (id: string) => {
    switch (id) {
      case "time-1":
        return <Sparkles className="w-5 h-5 text-pink-300 text-glow animate-pulse" />;
      case "time-2":
        return <MessageSquare className="w-5 h-5 text-amber-300 text-glow" />;
      case "time-3":
        return <GraduationCap className="w-5 h-5 text-purple-300 text-glow" />;
      case "time-4":
        return <Heart className="w-5 h-5 text-rose-300 text-glow animate-pulse" />;
      case "time-5":
        return <Award className="w-5 h-5 text-blue-300 text-glow" />;
      default:
        return <Sparkles className="w-5 h-5 text-pink-300 text-glow" />;
    }
  };

  const handleCardClick = (item: TimelineItem, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    playPopSFX();
    playChimeSFX();

    // Trigger customized effects based on card vibe
    if (item.id === "time-1" || item.id === "time-4") {
      triggerBirthdayEffect("hearts", clickX, clickY);
    } else if (item.id === "time-2") {
      triggerBirthdayEffect("emoji-rain", clickX, clickY, "🧸");
    } else if (item.id === "time-3") {
      triggerBirthdayEffect("confetti", clickX, clickY);
    } else {
      triggerBirthdayEffect("fireworks", clickX, clickY);
    }
  };

  return (
    <div className="w-full relative px-4">
      {/* Central decorative dashed line */}
      <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-pink-500/20 -translate-x-1/2 hidden md:block"></div>
      <div className="absolute left-8 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-pink-500/20 -translate-x-1/2 block md:hidden"></div>

      {/* Timeline items map */}
      <div className="space-y-12 md:space-y-16 max-w-5xl mx-auto relative">
        {TIMELINE_DATA.map((item, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row items-start md:items-center w-full relative ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Central Circle Marker Node (Lucide Icons) */}
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-[#120520] bg-purple-950/85 flex items-center justify-center shadow-lg shadow-pink-500/10 z-10 hover:scale-115 transition hover:bg-purple-900 duration-200">
                {getIcon(item.id)}
              </div>

              {/* Offset card positioning buffer (Only triggers on desktop screen widths) */}
              <div className="w-full md:w-1/2 hidden md:block"></div>

              {/* Memory Milestone Card */}
              <div className="w-full md:w-1/2 pl-16 md:pl-0 md:px-8">
                <div
                  onClick={(e) => handleCardClick(item, e)}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 hover:border-pink-500/25 shadow-2xl rounded-3xl p-6 hover:scale-[1.03] active:scale-98 transition duration-300 cursor-pointer relative group"
                >
                  {/* Floating Top Floating Emoji Accent */}
                  <span className="absolute top-4 right-4 text-xl select-none group-hover:scale-125 transition">
                    {item.emoji}
                  </span>

                  <span className="text-[10px] text-pink-300 font-mono tracking-wider font-bold block uppercase mb-1 text-glow">
                    {item.period}
                  </span>
                  
                  <h4 className="text-base font-extrabold text-pink-100 tracking-tight flex items-center gap-1.5 mb-2.5">
                    {item.title}
                  </h4>

                  <p className="text-xs md:text-sm text-purple-100/75 leading-relaxed font-sans">
                    {item.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-[10px] text-purple-300/40 font-mono border-t border-white/10 pt-3">
                    <span className="flex items-center gap-1 text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
                      Interactive Chapter
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition text-pink-300 font-semibold flex items-center gap-0.5">
                      Tap To Celebrate <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
