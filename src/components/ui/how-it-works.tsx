"use client";

import { useRef } from "react";
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
  return (
    <motion.div
      className="flex flex-col group"
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="flex items-center gap-3 mb-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
      >
        <motion.div
          className="text-white/80 bg-white/[0.06] p-3 rounded-lg transition-colors duration-300 group-hover:bg-white/[0.12]"
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {icon}
        </motion.div>
        <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors duration-300">
          {title}
        </h3>
      </motion.div>
      <motion.p className="text-base text-white/65 leading-relaxed pl-[3.25rem]">
        {description}
      </motion.p>
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
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-center mb-6 whitespace-nowrap"
            style={{ letterSpacing: "-0.02em" }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
              How The Engine Works
            </span>
          </h2>
          <p className="text-white/70 max-w-lg mx-auto text-base leading-relaxed">
            Brief in. Campaign out. Every output grounded in your brand, directed by senior humans, and improved by every cycle.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-14">
          {/* Left Column */}
          <div className="space-y-14">
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
          <div className="space-y-14">
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
          <p className="text-white/25 text-xs uppercase tracking-widest">
            From brief to live — days, not weeks
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
