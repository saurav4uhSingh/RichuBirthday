/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Music, Play, Pause, SkipForward, Volume2, Sparkles, VolumeX } from "lucide-react";
import { PlaylistItem } from "../types";

export const PLAYLIST: PlaylistItem[] = [
  { id: "lofi", name: "Starry Night Waltz", description: "Soft, gentle electric piano chords", emoji: "✨" },
  { id: "birthday", name: "Birthday Glockenspiel", description: "Cute custom instrumental melody", emoji: "🎂" },
  { id: "chimes", name: "Cosmic Wind Chimes", description: "Dreamy ambient random sparkles", emoji: "🌸" }
];

// Frequencies for Happy Birthday in key of G
const BIRTHDAY_MELODY = [
  { note: "D4", freq: 293.66, dur: 0.35, delay: 0.1 },
  { note: "D4", freq: 293.66, dur: 0.15, delay: 0.1 },
  { note: "E4", freq: 329.63, dur: 0.5, delay: 0.1 },
  { note: "D4", freq: 293.66, dur: 0.5, delay: 0.1 },
  { note: "G4", freq: 392.00, dur: 0.5, delay: 0.1 },
  { note: "F#4", freq: 369.99, dur: 1.0, delay: 0.2 },

  { note: "D4", freq: 293.66, dur: 0.35, delay: 0.1 },
  { note: "D4", freq: 293.66, dur: 0.15, delay: 0.1 },
  { note: "E4", freq: 329.63, dur: 0.5, delay: 0.1 },
  { note: "D4", freq: 293.66, dur: 0.5, delay: 0.1 },
  { note: "A4", freq: 440.00, dur: 0.5, delay: 0.1 },
  { note: "G4", freq: 392.00, dur: 1.0, delay: 0.2 },

  { note: "D4", freq: 293.66, dur: 0.35, delay: 0.1 },
  { note: "D4", freq: 293.66, dur: 0.15, delay: 0.1 },
  { note: "D5", freq: 587.33, dur: 0.5, delay: 0.1 },
  { note: "B4", freq: 493.88, dur: 0.5, delay: 0.1 },
  { note: "G4", freq: 392.00, dur: 0.5, delay: 0.1 },
  { note: "F#4", freq: 369.99, dur: 0.5, delay: 0.1 },
  { note: "E4", freq: 329.63, dur: 1.0, delay: 0.2 },

  { note: "C5", freq: 523.25, dur: 0.35, delay: 0.1 },
  { note: "C5", freq: 523.25, dur: 0.15, delay: 0.1 },
  { note: "B4", freq: 493.88, dur: 0.5, delay: 0.1 },
  { note: "G4", freq: 392.00, dur: 0.5, delay: 0.1 },
  { note: "A4", freq: 440.00, dur: 0.5, delay: 0.1 },
  { note: "G4", freq: 392.00, dur: 1.2, delay: 0.5 }
];

// Lofi Chord Progression (Gmaj7 - B7 - Em7 - Cmaj7)
const LOFI_CHORDS = [
  [196.00, 246.94, 293.66, 369.99], // Gmaj7 (G3, B3, D4, F#4)
  [246.94, 311.13, 369.99, 440.00], // B7 (B3, D#4, F#4, A4)
  [164.81, 196.00, 246.94, 293.66], // Em7 (E3, G3, B3, D4)
  [261.63, 329.63, 392.00, 493.88]  // Cmaj7 (C3, E3, G3, B3)
];

// Wind chime frequencies (Pentatonic Scale in G major)
const CHIME_PITCHES = [392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 880.00, 987.77];

let globalAudioCtx: AudioContext | null = null;

export function getOrCreateAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    globalAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (globalAudioCtx.state === "suspended") {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

// Global Sound Effect triggers so other components can summon chime / pop sounds easily!
export function playChimeSFX() {
  try {
    const ctx = getOrCreateAudioContext();
    const now = ctx.currentTime;
    
    // Play a shiny cascading high chime
    const notes = [659.25, 783.99, 880.00, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.08;
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.8);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.9);
    });
  } catch (err) {
    console.warn("Audio Context not ready yet:", err);
  }
}

export function playPopSFX() {
  try {
    const ctx = getOrCreateAudioContext();
    const now = ctx.currentTime;
    
    // Quick synthesizer pop bubble sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.16);
  } catch (err) {
    // Silent fail if Audio Context blocked
  }
}

export function playMagicSpellSFX() {
  try {
    const ctx = getOrCreateAudioContext();
    const now = ctx.currentTime;
    
    for (let i = 0; i < 15; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = i * 0.04;
      const freq = 400 + Math.random() * 1200;
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq + 300, now + delay + 0.1);
      
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.06, now + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.3);
    }
  } catch (err) {
    // Ignore
  }
}

export interface MusicPlayerProps {
  isPlaying: boolean;
  onPlayingChange: (playing: boolean) => void;
}

export default function MusicPlayer({ isPlaying, onPlayingChange }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([15, 30, 20, 45, 10, 35, 25, 40]);

  const intervalRef = useRef<number | null>(null);
  const playStateRef = useRef({ noteIdx: 0, chordIdx: 0, stepIdx: 0 });
  const currentOscillators = useRef<{ osc: OscillatorNode; gain: GainNode }[]>([]);

  const track = PLAYLIST[currentTrackIndex];

  // Randomize audio visualizer bars when music is playing
  useEffect(() => {
    let timer: number;
    if (isPlaying && !isMuted) {
      timer = window.setInterval(() => {
        setVisualizerBars(Array.from({ length: 8 }, () => Math.floor(Math.random() * 35) + 12));
      }, 120);
    } else {
      setVisualizerBars([10, 12, 10, 12, 10, 12, 10, 12]);
    }
    return () => clearInterval(timer);
  }, [isPlaying, isMuted]);

  // Handle Play / Synth Schedule loops
  useEffect(() => {
    if (!isPlaying) {
      clearAllSynthTracks();
      return;
    }

    try {
      const ctx = getOrCreateAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
    } catch {
      // Audio context might be restricted
    }

    // Reset loop state when switching tracks
    playStateRef.current = { noteIdx: 0, chordIdx: 0, stepIdx: 0 };

    if (track.id === "lofi") {
      // LOFI CHORD LOOP (Slow arpeggiated piano)
      const chordDelay = 3500; // ms per chord
      scheduleNextLofiChord();
      intervalRef.current = window.setInterval(scheduleNextLofiChord, chordDelay);
    } else if (track.id === "birthday") {
      // BIRTHDAY INSTRUMENTAL MELODY LOOP
      const tick = 450; // timing tick in ms
      scheduleNextBirthdayNote();
      intervalRef.current = window.setInterval(scheduleNextBirthdayNote, tick);
    } else if (track.id === "chimes") {
      // RANDOM CHIMES
      scheduleRandomWindChime();
      intervalRef.current = window.setInterval(scheduleRandomWindChime, 800);
    }

    return () => {
      clearAllSynthTracks();
    };
  }, [isPlaying, currentTrackIndex]);

  // Synth sound cleanup
  const clearAllSynthTracks = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    currentOscillators.current.forEach(({ osc, gain }) => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Already stopped
      }
    });
    currentOscillators.current = [];
  };

  // 1. Synthesize Lofi Ambient Chord Progression
  const scheduleNextLofiChord = () => {
    try {
      const ctx = getOrCreateAudioContext();
      const now = ctx.currentTime;
      const { chordIdx } = playStateRef.current;
      const chordFrequencies = LOFI_CHORDS[chordIdx];
      const curVolume = isMuted ? 0 : volume;

      // Arpeggiate the chord notes slightly for electric piano vibe
      chordFrequencies.forEach((freq, noteOffset) => {
        const noteDelay = noteOffset * 0.15;
        const noteTime = now + noteDelay;

        // Sub oscillator
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const subGainNode = ctx.createGain();
        const lowpass = ctx.createBiquadFilter();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, noteTime);

        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(freq / 2, noteTime); // lower octave sub-bass

        // Low pass filter for warmth
        lowpass.type = "lowpass";
        lowpass.frequency.setValueAtTime(700, noteTime);

        // Envelope setup
        gainNode.gain.setValueAtTime(0, noteTime);
        gainNode.gain.linearRampToValueAtTime(curVolume * 0.08, noteTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.8);

        subGainNode.gain.setValueAtTime(0, noteTime);
        subGainNode.gain.linearRampToValueAtTime(curVolume * 0.04, noteTime + 0.1);
        subGainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.5);

        osc.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(ctx.destination);

        subOsc.connect(subGainNode);
        subGainNode.connect(ctx.destination);

        osc.start(noteTime);
        subOsc.start(noteTime);
        
        osc.stop(noteTime + 3.2);
        subOsc.stop(noteTime + 3.0);

        currentOscillators.current.push({ osc, gain: gainNode });
        currentOscillators.current.push({ osc: subOsc, gain: subGainNode });
      });

      // Keep tracking chords
      playStateRef.current.chordIdx = (chordIdx + 1) % LOFI_CHORDS.length;
    } catch {
      // Ignored
    }
  };

  // 2. Synthesize Glockenspiel Happy Birthday Notes
  const scheduleNextBirthdayNote = () => {
    try {
      const ctx = getOrCreateAudioContext();
      const { noteIdx } = playStateRef.current;
      const noteItem = BIRTHDAY_MELODY[noteIdx];
      const now = ctx.currentTime;
      const curVolume = isMuted ? 0 : volume;

      if (!noteItem) return;

      const osc = ctx.createOscillator();
      const ringOsc = ctx.createOscillator(); // Ringing metallic overtones
      const gainNode = ctx.createGain();

      // Soft triangle wave + bell ring
      osc.type = "triangle";
      osc.frequency.setValueAtTime(noteItem.freq, now);

      ringOsc.type = "sine";
      ringOsc.frequency.setValueAtTime(noteItem.freq * 2.003, now); // slightly detuned octave

      gainNode.gain.setValueAtTime(0, now);
      // Nice chime pluck shape
      gainNode.gain.linearRampToValueAtTime(curVolume * 0.12, now + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + noteItem.dur * 1.8);

      osc.connect(gainNode);
      ringOsc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      ringOsc.start(now);
      
      osc.stop(now + noteItem.dur * 2);
      ringOsc.stop(now + noteItem.dur * 2);

      currentOscillators.current.push({ osc, gain: gainNode });

      // Calculate next note and duration spacing
      const nextDelay = noteItem.dur * 1000 + noteItem.delay * 1000;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      playStateRef.current.noteIdx = (noteIdx + 1) % BIRTHDAY_MELODY.length;
      intervalRef.current = window.setInterval(scheduleNextBirthdayNote, nextDelay);
    } catch {
      // Ignored
    }
  };

  // 3. Synthesize Starry Cosmic Wind Chimes
  const scheduleRandomWindChime = () => {
    try {
      if (Math.random() > 0.6) return; // random airy spacing

      const ctx = getOrCreateAudioContext();
      const now = ctx.currentTime;
      const curVolume = isMuted ? 0 : volume;

      const randPitchIdx = Math.floor(Math.random() * CHIME_PITCHES.length);
      const pitch = CHIME_PITCHES[randPitchIdx];

      const osc = ctx.createOscillator();
      const bandpass = ctx.createBiquadFilter();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, now);
      
      // Detune a little bit over time like wind breezes
      osc.frequency.linearRampToValueAtTime(pitch + (Math.random() * 4 - 2), now + 1.2);

      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(pitch, now);
      bandpass.Q.setValueAtTime(10, now);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(curVolume * 0.07, now + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(bandpass);
      bandpass.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.0);

      currentOscillators.current.push({ osc, gain: gainNode });
    } catch {
      // Ignored
    }
  };

  const handleNextTrack = () => {
    playPopSFX();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const toggleMute = () => {
    playPopSFX();
    setIsMuted(!isMuted);
  };

  return (
    <div 
      id="birthday-music-player" 
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl max-w-sm w-full mx-auto animate-in fade-in"
    >
      <div className="flex items-center gap-4">
        {/* Animated Vinyl/Record */}
        <div className="relative flex-shrink-0">
          <div 
            className={`w-14 h-14 rounded-full bg-slate-950 border-2 border-pink-500/35 flex items-center justify-center shadow-lg relative ${
              isPlaying && !isMuted ? "animate-spin style-animation-duration-[8s]" : ""
            }`}
          >
            {/* Grooves */}
            <div className="absolute inset-2 border border-dashed border-white/15 rounded-full"></div>
            <div className="absolute inset-4 border border-white/25 rounded-full"></div>
            {/* Center label */}
            <div className="w-5 h-5 rounded-full bg-pink-400 border border-white/30 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
            </div>
          </div>
          <span className="absolute -top-1 -right-1 text-md select-none animate-bounce">
            {track.emoji}
          </span>
        </div>

        {/* Track Details */}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[10px] text-pink-300 font-mono tracking-widest uppercase font-semibold text-glow">
            Synthesizer Radio
          </p>
          <h4 className="text-sm font-bold text-pink-150 truncate">
            {track.name}
          </h4>
          <p className="text-xs text-purple-200/60 truncate mt-0.5">
            {track.description}
          </p>
        </div>
      </div>

      {/* Visualizer and Control Toolbar */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            id="music-play-toggle"
            onClick={() => {
              getOrCreateAudioContext();
              onPlayingChange(!isPlaying);
              playChimeSFX();
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all outline-none"
            title={isPlaying ? "Pause music" : "Play music"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Next Track Button */}
          <button
            id="music-next-track"
            onClick={handleNextTrack}
            className="w-8 h-8 rounded-full bg-white/10 text-purple-200 hover:bg-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition"
            title="Next Track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Mute Button */}
          <button
            id="music-mute-toggle"
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-white/10 text-purple-200 hover:bg-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-pink-400" /> : <Volume2 className="w-3.5 h-3.5 text-purple-200" />}
          </button>
        </div>

        {/* Visualizer Waves */}
        <div className="flex items-end gap-1.5 h-8 px-1">
          {visualizerBars.map((height, idx) => (
            <div
              key={idx}
              className="w-1 rounded-t bg-gradient-to-t from-pink-400 to-purple-500 transition-all duration-100 ease-out shadow-[0_0_8px_rgba(244,143,177,0.3)]"
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>
      </div>

      {isPlaying && (
        <div className="mt-3 text-[10px] text-center text-purple-300/40 flex items-center justify-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-pink-400 animate-pulse" />
          <span>Tap sections below to trigger sound waves!</span>
        </div>
      )}
    </div>
  );
}
