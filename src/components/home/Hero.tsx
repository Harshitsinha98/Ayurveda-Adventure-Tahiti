"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { introDelay } from "@/components/motion/intro";
import { EASE, Magnetic } from "@/components/motion/primitives";
import { useT } from "@/i18n/client";
import type { Img } from "@/lib/payload";

/**
 * Opening scene. The headline and call to action sit beside a framed photo; scrolling pins the scene
 * and the photo opens out to full screen, where the site's motto appears.
 */
export function Hero({
  eyebrow,
  lines,
  intro,
  image,
  accent,
}: {
  eyebrow?: string | null;
  lines: string[];
  intro?: string | null;
  image?: Img | null;
  accent?: Img | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const T = useT();
  const t = T.hero;
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(false);
  const [d] = useState(introDelay);
  useEffect(() => {
    const mq = matchMedia("(max-width: 1023px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const { scrollYProgress: raw } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.3 });
  // Frame insets (top, right, bottom, left in %) before expansion.
  // Mobile: the stage starts just under the text, so the frame sits at the top of it.
  const from = mobile ? [4, 5, 26, 5] : [13, 5, 11, 50];
  const k = reduce ? [0, 0] : [0, 0.62];
  const top = useTransform(p, k, [from[0], 0]);
  const right = useTransform(p, k, [from[1], 0]);
  const bottom = useTransform(p, k, [from[2], 0]);
  const left = useTransform(p, k, [from[3], 0]);
  const round = useTransform(p, k, [3, 0]);
  const clip = useMotionTemplate`inset(${top}% ${right}% ${bottom}% ${left}% round ${round}px)`;
  const imgScale = useTransform(p, [0, 1], reduce ? [1, 1] : [1.18, 1]);
  // Keep the subject centred in the small frame: shift the photo to the frame's centre, then back.
  const shiftX = useTransform(p, k, [`${(from[3] - from[1]) / 2}%`, "0%"]);
  const shiftY = useTransform(p, k, [`${(from[0] - from[2]) / 2}%`, "0%"]);
  const textY = useTransform(p, [0, 0.5], reduce ? [0, 0] : [0, -120]);
  const textOpacity = useTransform(p, [0, 0.35], reduce ? [1, 1] : [1, 0]);
  const veil = useTransform(p, [0.35, 0.7], [0, 0.55]);
  const mottoOpacity = useTransform(p, [0.55, 0.78], [0, 1]);
  const mottoY = useTransform(p, [0.55, 0.85], [50, 0]);
  const accentY = useTransform(p, [0, 0.5], [0, -260]);
  const accentOpacity = useTransform(p, [0.1, 0.3], [1, 0]);
  const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);

  return (
    <section className="relative bg-sand-100" aria-label={lines.join(" ")}>
      {/* Headline column */}
      <motion.div
        style={mobile ? undefined : { y: textY, opacity: textOpacity }}
        className={`container-x relative z-10 pb-8 pt-[104px] lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pb-0 lg:pt-[40px] ${reduce ? "" : "lg:sticky lg:top-0 lg:-mb-[100vh]"}`}
      >
        <div className="max-w-[46rem] lg:max-w-[44%]">
          <motion.p
            className="eyebrow text-saffron-600"
            initial={{ opacity: 0, letterSpacing: "0.7em" }}
            animate={{ opacity: 1, letterSpacing: "0.28em" }}
            transition={{ duration: 1.4, delay: d, ease: EASE }}
          >
            {eyebrow}
          </motion.p>
          <h1 className="mt-5 text-[clamp(2.5rem,9.5vw,4rem)] leading-[1] text-plum-800 lg:text-[clamp(3.2rem,5vw,5.4rem)]">
            <span className="sr-only">{lines.join(" ")}</span>
            {lines.map((l, i) => (
              <span
                key={i}
                className={`block overflow-hidden pb-[0.08em] ${i === 1 ? "italic text-saffron-600" : ""}`}
              >
                {l.split("").map((c, j) => (
                  <motion.span
                    key={j}
                    aria-hidden
                    className="inline-block whitespace-pre"
                    initial={{ y: "115%", rotate: 8 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{
                      duration: 1,
                      delay: d + 0.15 + i * 0.14 + j * 0.018,
                      ease: EASE,
                    }}
                  >
                    {c}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-[32rem] text-[1.05rem] leading-relaxed text-ink-soft lg:mt-8 lg:text-lg"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: d + 0.8, ease: EASE }}
          >
            {intro}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: d + 1, ease: EASE }}
          >
            <Magnetic>
              <Link
                href="/offres/consultation-decouverte"
                className="btn-fill group inline-flex items-center gap-3 rounded-[2px] bg-plum-800 px-7 py-4 text-[0.95rem] font-semibold text-sand-50 shadow-[0_24px_44px_-20px_rgba(74,24,56,0.8)]"
              >
                <span className="relative z-10">{t.cta}</span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="relative z-10 transition-transform duration-500 group-hover:translate-x-1"
                />
              </Link>
            </Magnetic>
            <Link
              href="/voyage-en-inde"
              className="link-line text-[0.95rem] font-semibold text-plum-800"
            >
              {t.trips}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <div
        ref={ref}
        className={`relative ${reduce ? "h-[70svh] lg:h-screen" : "h-[170svh] lg:h-[230vh]"}`}
      >
        <div
          className={`${reduce ? "relative h-full" : "sticky top-0 h-[100svh]"} overflow-hidden`}
        >
          {/* Photo that opens to full screen */}
          {image && (
            <motion.div
              className="absolute inset-0 z-0"
              style={{ clipPath: reduce ? undefined : clip }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.4, delay: d + 0.2 }}
              data-cursor-dark
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  scale: imgScale,
                  x: reduce ? 0 : shiftX,
                  y: reduce ? 0 : shiftY,
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 38%" }}
                />
              </motion.div>
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-plum-950"
                style={{ opacity: veil }}
              />
            </motion.div>
          )}

          {/* Small floating photo that drifts away first */}
          {accent && !mobile && (
            <motion.div
              style={{ y: accentY, opacity: accentOpacity }}
              className="absolute bottom-[5%] left-[45%] z-20 hidden w-36 lg:block"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, delay: d + 1.2, ease: EASE }}
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2px] shadow-[0_30px_60px_-28px_rgba(42,11,28,0.6)] outline outline-1 outline-offset-[8px] outline-plum-800/15">
                <Image
                  src={accent.url}
                  alt={accent.alt}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </motion.div>
          )}

          {/* Motto revealed once the photo fills the screen */}
          {!reduce && (
            <motion.div
              style={{ opacity: mottoOpacity, y: mottoY }}
              className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-sand-50"
            >
              <p className="eyebrow text-saffron-300">{t.badgeTop}</p>
              <p className="font-display mt-5 text-[clamp(3.2rem,11vw,10rem)] leading-[0.9]">
                {t.badge}
              </p>
              <p className="font-display mt-6 text-[clamp(1.4rem,3vw,2.4rem)] italic text-saffron-300">
                {T.home.manifestoQ}
              </p>
            </motion.div>
          )}

          {!reduce && (
            <motion.div
              aria-hidden
              style={{ opacity: hintOpacity }}
              className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.62rem] uppercase tracking-[0.3em] text-ink-soft lg:left-[30%] lg:flex"
            >
              {t.scroll}
              <span className="relative block h-12 w-px overflow-hidden bg-plum-800/15">
                <motion.span
                  className="absolute inset-x-0 top-0 h-1/2 bg-plum-800"
                  animate={{ y: ["-100%", "200%"] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
