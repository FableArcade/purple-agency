"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Sparkles,
  Shield,
  Rocket,
  Brain,
  Repeat,
  ArrowRight,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Brief & Strategy",
    description:
      "You share the brief. We lock positioning, audience, and channels. The engine builds the campaign plan.",
    position: "left",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Engine Produces",
    description:
      "AI generates ad creative, email sequences, landing pages, and social content — all grounded in your brand.",
    position: "left",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Humans Curate",
    description:
      "Creative director reviews every output. Critic agent checks compliance. Nothing ships without human judgment.",
    position: "left",
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Deploy Everywhere",
    description:
      "Growth marketer launches across Google, Meta, LinkedIn, and email. Campaigns live in days, not weeks.",
    position: "right",
  },
  {
    icon: <Repeat className="w-6 h-6" />,
    title: "Learn & Improve",
    description:
      "Performance feeds back into the engine. Creative scoring. Cross-client patterns. Every cycle is smarter.",
    position: "right",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Scale On Proof",
    description:
      "Results at 90 days unlock the next tier. More channels, more creative, more intelligence. Outcome-priced.",
    position: "right",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

function StepItem({
  icon,
  title,
  description,
  index,
  direction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  direction: "left" | "right";
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="flex flex-col group cursor-pointer sm:cursor-default"
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <motion.div
        className="flex items-center gap-3 mb-2 sm:mb-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
      >
        <motion.div
          className="text-black/60 bg-black/[0.05] p-3 rounded-lg transition-colors duration-300 group-hover:bg-black/[0.1]"
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {icon}
        </motion.div>
        <h3 className="text-base sm:text-lg font-medium text-black/80 group-hover:text-black transition-colors duration-300">
          {title}
        </h3>
      </motion.div>
      {/* Desktop: always show */}
      <p className="hidden sm:block text-base text-black/50 leading-relaxed pl-[3.25rem]">
        {description}
      </p>
      {/* Mobile: glass bubble on tap */}
      {expanded && (
        <motion.div
          className="sm:hidden ml-[3.25rem] mt-1 mb-2 px-4 py-3 rounded-2xl text-xs text-black/50 leading-relaxed"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 24px rgba(0,0,0,0.06)",
          }}
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          {description}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <div ref={sectionRef} className="w-full max-w-5xl mx-auto px-4">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div className="text-center mb-6 sm:mb-16" variants={itemVariants}>
          <h2
            className="text-2xl sm:text-5xl md:text-6xl font-bold text-center mb-6 sm:whitespace-nowrap"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-black to-black/70">
              The Engine
            </span>
          </h2>
          <p className="text-black/50 max-w-lg mx-auto text-sm sm:text-base leading-relaxed px-4">
            Brief in. Campaign out. Every output grounded in your brand, directed by senior humans, and improved by every cycle.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-5 sm:gap-y-10 md:gap-y-14 px-2">
          {/* Left Column */}
          <div className="space-y-5 sm:space-y-14">
            {steps
              .filter((s) => s.position === "left")
              .map((step, i) => (
                <StepItem
                  key={step.title}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  index={i}
                  direction="left"
                />
              ))}
          </div>

          {/* Right Column */}
          <div className="space-y-5 sm:space-y-14">
            {steps
              .filter((s) => s.position === "right")
              .map((step, i) => (
                <StepItem
                  key={step.title}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  index={i + 3}
                  direction="right"
                />
              ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <p className="text-black/25 text-xs uppercase tracking-widest">
            From brief to live — days, not weeks
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
