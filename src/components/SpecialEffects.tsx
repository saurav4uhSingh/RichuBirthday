/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { playPopSFX, playChimeSFX, playMagicSpellSFX } from "./MusicPlayer";
import { Heart, Stars } from "lucide-react";

interface EffectEventDetail {
  type: "confetti" | "fireworks" | "hearts" | "emoji-rain" | "balloon-rise" | "particle-pop";
  x?: number;
  y?: number;
  emoji?: string;
}

// Global helper to trigger birthday custom effects from anywhere in the app!
export function triggerBirthdayEffect(
  type: EffectEventDetail["type"],
  x?: number,
  y?: number,
  emoji?: string
) {
  const event = new CustomEvent<EffectEventDetail>("birthday-effect", {
    detail: { type, x, y, emoji }
  });
  window.dispatchEvent(event);
}

class BaseParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
    this.color = color;
    this.size = Math.random() * 4 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class MouseSparkle extends BaseParticle {
  angle: number;
  spinSpeed: number;

  constructor(x: number, y: number, color: string) {
    super(x, y, color);
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - 0.2; // slight upward drift
    this.decay = Math.random() * 0.03 + 0.02;
    this.size = Math.random() * 5 + 3;
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = (Math.random() - 0.5) * 0.1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    // Draw 4-point star for magical sparkle look
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(this.size, 0);
      ctx.lineTo(0, this.size / 3);
    }
    ctx.closePath();
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

class ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 8;
    this.vy = -Math.random() * 10 - 5; // Launch upward
    this.alpha = 1;
    this.decay = Math.random() * 0.01 + 0.005;
    this.color = color;
    this.width = Math.random() * 8 + 6;
    this.height = Math.random() * 15 + 10;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
    this.gravity = 0.25;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}

class FallingEmoji {
  x: number;
  y: number;
  vy: number;
  vx: number;
  emoji: string;
  size: number;
  spin: number;
  spinSpeed: number;
  alpha: number;
  decay: number;

  constructor(x: number, y: number, emoji: string) {
    this.x = x;
    this.y = y;
    this.vy = Math.random() * 2 + 2; // steady falling speed
    this.vx = (Math.random() - 0.5) * 2;
    this.emoji = emoji;
    this.size = Math.floor(Math.random() * 15) + 20;
    this.spin = Math.random() * Math.PI * 2;
    this.spinSpeed = (Math.random() - 0.5) * 0.06;
    this.alpha = 1.0;
    this.decay = Math.random() * 0.012 + 0.008; // optimized moderate lifetime for fast decay
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.spin += this.spinSpeed;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.font = `${this.size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(this.x, this.y);
    ctx.rotate(this.spin);
    ctx.fillText(this.emoji, 0, 0);
    ctx.restore();
  }
}

class FloatingBalloon {
  x: number;
  y: number;
  vy: number;
  vx: number;
  color: string;
  radius: number;
  wiggleIdx: number;
  wiggleSpeed: number;
  stringLength: number;
  alpha: number;
  isPopped: boolean;
  isCustom: boolean;
  customText: string;

  constructor(x: number, y: number, color: string, customText = "") {
    this.x = x;
    this.y = y;
    this.vy = -(Math.random() * 1.5 + 1); // Float upwards
    this.vx = 0;
    this.color = color;
    this.radius = Math.random() * 12 + 22; // cute balloon size
    this.wiggleIdx = Math.random() * 100;
    this.wiggleSpeed = Math.random() * 0.02 + 0.01;
    this.stringLength = 45;
    this.alpha = 1.0;
    this.isPopped = false;
    this.isCustom = !!customText;
    this.customText = customText;
  }

  update() {
    this.y += this.vy;
    this.wiggleIdx += this.wiggleSpeed;
    this.x += Math.sin(this.wiggleIdx) * 0.6; // gentle side swaying
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.isPopped) return;
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.strokeStyle = "rgba(180, 180, 180, 0.4)";
    ctx.lineWidth = 1.5;

    // Draw string
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.radius);
    ctx.quadraticCurveTo(
      this.x + Math.sin(this.wiggleIdx) * 10,
      this.y + this.radius + this.stringLength / 2,
      this.x,
      this.y + this.radius + this.stringLength
    );
    ctx.stroke();

    // Draw balloon body (slightly elongated oval shape)
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radius * 0.9, this.radius, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw the tiny knot triangle at bottom
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.radius);
    ctx.lineTo(this.x - 5, this.y + this.radius + 6);
    ctx.lineTo(this.x + 5, this.y + this.radius + 6);
    ctx.closePath();
    ctx.fill();

    // Balloon reflection shine (creates 3D aesthetic)
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.ellipse(
      this.x - this.radius * 0.35,
      this.y - this.radius * 0.4,
      this.radius * 0.22,
      this.radius * 0.3,
      -Math.PI / 12,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Custom birthday text/emojis on balloon
    if (this.isCustom && this.customText) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.customText, this.x, this.y + 2);
    } else {
      // Small sparkle print on balloon
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = '10px sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("✨", this.x, this.y + 4);
    }

    ctx.restore();
  }

  isHit(mx: number, my: number): boolean {
    const dx = mx - this.x;
    const dy = my - this.y;
    // Stretch hit box oval
    return (dx * dx) / (this.radius * 0.9 * this.radius * 0.9) + (dy * dy) / (this.radius * this.radius) <= 1;
  }
}

class FireworkSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  size: number;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 8 + 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.alpha = 1.0;
    this.decay = Math.random() * 0.015 + 0.012;
    this.gravity = 0.15;
    this.size = Math.random() * 3 + 1.5;
  }

  update() {
    this.vy += this.gravity;
    this.vx *= 0.98; // air resistance
    this.vy *= 0.98;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

const CUTE_EMOJIS = ["🎂", "🎀", "💖", "🌸", "✨", "🧸", "😊", "🎉"];
const MAGIC_COLORS = [
  "#FFB7B2", // pastel peach pink
  "#FFDAC1", // pastel light orange
  "#E2F0CB", // pastel green
  "#BFFCC6", // pastel mint
  "#C7CEEA", // pastel lavender blue
  "#FF9AA2", // strawberry pink
  "#FFC6FF", // fluffy lilac
  "#BDB2FF"  // starry violet
];

export default function SpecialEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparklesRef = useRef<MouseSparkle[]>([]);
  const confettiRef = useRef<ConfettiParticle[]>([]);
  const emojiRainRef = useRef<FallingEmoji[]>([]);
  const balloonsRef = useRef<FloatingBalloon[]>([]);
  const fireworksRef = useRef<FireworkSpark[]>([]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clickNotice, setClickNotice] = useState<string | null>(null);

  // Floating secret corner button text states
  const [secretOpen, setSecretOpen] = useState(false);

  // Setup canvas size and loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Main animation frame loop
    let animationFrameId: number;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Defensive cap array sizes to maintain ultra-fast performance
      if (sparklesRef.current.length > 50) {
        sparklesRef.current = sparklesRef.current.slice(-50);
      }
      if (confettiRef.current.length > 60) {
        confettiRef.current = confettiRef.current.slice(-60);
      }
      if (emojiRainRef.current.length > 30) {
        emojiRainRef.current = emojiRainRef.current.slice(-30);
      }
      if (balloonsRef.current.length > 10) {
        // Only keep unpopped balloons
        balloonsRef.current = balloonsRef.current.filter(b => !b.isPopped).slice(-10);
      }
      if (fireworksRef.current.length > 80) {
        fireworksRef.current = fireworksRef.current.slice(-80);
      }

      // Update & Draw Sparkles safely
      sparklesRef.current = sparklesRef.current.filter((p) => {
        p.update();
        if (p.alpha <= 0) return false;
        p.draw(ctx);
        return true;
      });

      // Update & Draw Confetti safely
      confettiRef.current = confettiRef.current.filter((p) => {
        p.update();
        if (p.alpha <= 0 || p.y > canvas.height + 100) return false;
        p.draw(ctx);
        return true;
      });

      // Update & Draw Emojis safely
      emojiRainRef.current = emojiRainRef.current.filter((p) => {
        p.update();
        if (p.alpha <= 0 || p.y > canvas.height + 50 || p.y < -100) return false;
        p.draw(ctx);
        return true;
      });

      // Update & Draw Balloons safely (immediately filters out popped balloons)
      balloonsRef.current = balloonsRef.current.filter((b) => {
        if (b.isPopped) return false;
        b.update();
        if (b.y < -100) return false;
        b.draw(ctx);
        return true;
      });

      // Update & Draw Fireworks safely
      fireworksRef.current = fireworksRef.current.filter((f) => {
        f.update();
        if (f.alpha <= 0) return false;
        f.draw(ctx);
        return true;
      });

      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Event handler for custom events
  useEffect(() => {
    const handleBirthdayEffect = (e: Event) => {
      const customEvent = e as CustomEvent<EffectEventDetail>;
      const { type, x, y, emoji } = customEvent.detail;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const spawnX = x !== undefined ? x : Math.random() * canvas.width;
      const spawnY = y !== undefined ? y : Math.random() * canvas.height * 0.4 + 100;

      switch (type) {
        case "confetti":
          playPopSFX();
          for (let i = 0; i < 18; i++) {
            const color = MAGIC_COLORS[Math.floor(Math.random() * MAGIC_COLORS.length)];
            confettiRef.current.push(new ConfettiParticle(spawnX, spawnY - 10, color));
          }
          break;

        case "fireworks":
          playMagicSpellSFX();
          // Create a dual-ring fireworks explosion
          const coreColor = MAGIC_COLORS[Math.floor(Math.random() * MAGIC_COLORS.length)];
          const ringColor = MAGIC_COLORS[Math.floor(Math.random() * MAGIC_COLORS.length)];
          for (let i = 0; i < 30; i++) {
            const chosenCol = Math.random() > 0.5 ? coreColor : ringColor;
            fireworksRef.current.push(new FireworkSpark(spawnX, spawnY, chosenCol));
          }
          break;

        case "hearts":
          playChimeSFX();
          for (let i = 0; i < 8; i++) {
            const heartColors = ["#FFB7B2", "#FF9AA2", "#FFC6FF", "#FFB7B2"];
            const col = heartColors[Math.floor(Math.random() * heartColors.length)];
            const size = Math.random() * 10 + 12;
            const emojiRainItem = new FallingEmoji(spawnX, spawnY, "💖");
            emojiRainItem.size = size;
            emojiRainItem.vy = -Math.random() * 2 - 1.5; // move upward gently
            emojiRainItem.vx = (Math.random() - 0.5) * 3;
            emojiRainItem.decay = 0.024;
            emojiRainRef.current.push(emojiRainItem);
          }
          break;

        case "emoji-rain":
          playChimeSFX();
          const targetEmojis = emoji ? [emoji] : CUTE_EMOJIS;
          for (let i = 0; i < 10; i++) {
            const randomX = Math.random() * canvas.width;
            const singleEmoji = targetEmojis[Math.floor(Math.random() * targetEmojis.length)];
            emojiRainRef.current.push(new FallingEmoji(randomX, -50, singleEmoji));
          }
          break;

        case "balloon-rise":
          const count = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < count; i++) {
            const balloonX = Math.random() * (canvas.width - 100) + 50;
            const balloonY = canvas.height + 100 + i * 40;
            const color = MAGIC_COLORS[Math.floor(Math.random() * MAGIC_COLORS.length)];
            // Some balloons have special words!
            const specialWords = ["Happy Birthday", "Richu🎂", "Shine ✨", "Inspiration 🌟", "Joy💖", "🧸", "🎉"];
            const txt = Math.random() > 0.7 ? specialWords[Math.floor(Math.random() * specialWords.length)] : "";
            balloonsRef.current.push(new FloatingBalloon(balloonX, balloonY, color, txt));
          }
          break;

        case "particle-pop":
          // Spark particles where bubble was popped
          for (let i = 0; i < 6; i++) {
            const color = MAGIC_COLORS[Math.floor(Math.random() * MAGIC_COLORS.length)];
            const sparkle = new MouseSparkle(spawnX, spawnY, color);
            sparkle.vx = (Math.random() - 0.5) * 6;
            sparkle.vy = (Math.random() - 0.5) * 6;
            sparklesRef.current.push(sparkle);
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("birthday-effect", handleBirthdayEffect);
    return () => window.removeEventListener("birthday-effect", handleBirthdayEffect);
  }, []);

  // Mouse trail tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Spawn subtle sparkles on mouse movement (10% throttle chance for performance and low clutter)
      if (Math.random() < 0.10) {
        const color = MAGIC_COLORS[Math.floor(Math.random() * MAGIC_COLORS.length)];
        // offset sparkle a little to center index
        sparklesRef.current.push(new MouseSparkle(e.clientX, e.clientY, color));
      }

          // Check if mouse hits/pops floating balloons
          balloonsRef.current.forEach((b) => {
            if (!b.isPopped && b.isHit(e.clientX, e.clientY)) {
              b.isPopped = true;
              playPopSFX();
              // trigger explosion at popped coordinates
              triggerBirthdayEffect("particle-pop", b.x, b.y);
              // Show quick popup sign
              setClickNotice(`Happy Birthday Richu! 🎂💖`);
              setTimeout(() => setClickNotice(null), 1200);
            }
          });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Long press or click action anywhere detects emoji explosion
  useEffect(() => {
    let pressTimer: number;

    const handleMouseDown = (e: MouseEvent) => {
      // Long press detection
      pressTimer = window.setTimeout(() => {
        playMagicSpellSFX();
        // Trigger high volume emoji explosion at click point
        for (let i = 0; i < 20; i++) {
          const emojiItem = CUTE_EMOJIS[Math.floor(Math.random() * CUTE_EMOJIS.length)];
          const rain = new FallingEmoji(e.clientX, e.clientY, emojiItem);
          rain.vy = -Math.random() * 6 - 3; // shoot upwards
          rain.vx = (Math.random() - 0.5) * 10; // high spread
          rain.decay = 0.02;
          emojiRainRef.current.push(rain);
        }
        setClickNotice("✨ Magic long-press unlocked! 🎁");
        setTimeout(() => setClickNotice(null), 1800);
      }, 500); // 500ms constitutes a beautiful long press
    };

    const handleMouseUp = () => {
      clearTimeout(pressTimer);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Auto float some balloons occasionally
  useEffect(() => {
    const timer = setInterval(() => {
      if (Math.random() > 0.6) {
        triggerBirthdayEffect("balloon-rise");
      }
    }, 25000); // every 25 secs
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Pop notification overlay */}
      {clickNotice && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-white/70 backdrop-blur-md text-pink-600 px-4 py-2 rounded-full border border-pink-200 shadow-lg text-xs font-mono font-medium z-[100] animate-bounce">
          {clickNotice}
        </div>
      )}

      {/* Easter Egg: Secret Bottom Corner Button */}
      <div className="fixed bottom-4 right-4 z-[45] flex items-end justify-end flex-col">
        {secretOpen ? (
          <div className="bg-white/80 backdrop-blur-lg border border-pink-100 rounded-2xl p-4 shadow-xl mb-2 max-w-xs animate-in fade-in zoom-in-95 duration-200">
            <h5 className="font-bold text-pink-600 flex items-center gap-1.5 text-xs">
              <Stars className="w-3.5 h-3.5 animate-spin" /> Secret Note for Richu 🌸
            </h5>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              Hey Richu, you've unlocked a secret easter egg! 🌟 Thank you for being such an amazing and special friend. Your positivity lightens up every room, and this little corner represents the wishes of everyone who appreciates your friendship. May this year ahead be filled with miracles! ✨
            </p>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  playChimeSFX();
                  triggerBirthdayEffect("fireworks");
                }}
                className="text-[10px] text-pink-500 font-semibold hover:underline"
              >
                Spark Fireworks 🎆
              </button>
              <button
                onClick={() => setSecretOpen(false)}
                className="text-[10px] text-slate-400 font-semibold hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              playChimeSFX();
              setSecretOpen(true);
            }}
            className="w-9 h-9 rounded-full bg-pink-100/40 hover:bg-pink-100/70 border border-pink-200/50 backdrop-blur-md flex items-center justify-center text-md hover:scale-110 active:scale-95 transition shadow-lg text-pink-400"
            title="Unlock corner secret"
          >
            🌸
          </button>
        )}
      </div>
    </>
  );
}
