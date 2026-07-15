"use client";

import { motion } from "motion/react";

const nodes = [
  { top: "8%", left: "12%", delay: 0 },
  { top: "18%", left: "42%", delay: 0.8 },
  { top: "10%", left: "76%", delay: 1.2 },
  { top: "34%", left: "20%", delay: 0.4 },
  { top: "42%", left: "58%", delay: 1 },
  { top: "60%", left: "14%", delay: 0.6 },
  { top: "70%", left: "38%", delay: 1.4 },
  { top: "78%", left: "72%", delay: 0.2 },
  { top: "54%", left: "82%", delay: 1.8 },
];

const lines = [
  { top: "12%", left: "13%", width: "32%", rotate: "14deg" },
  { top: "23%", left: "42%", width: "28%", rotate: "-10deg" },
  { top: "40%", left: "18%", width: "36%", rotate: "12deg" },
  { top: "58%", left: "16%", width: "26%", rotate: "18deg" },
  { top: "68%", left: "38%", width: "34%", rotate: "-8deg" },
];

export default function NeuralNetwork() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/15 blur-3xl" />

      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Connection lines */}
      {lines.map((line, index) => (
        <motion.div
          key={index}
          animate={{
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            duration: 5,
            delay: index,
            repeat: Infinity,
          }}
          className="absolute h-px origin-left bg-gradient-to-r from-indigo-500/40 via-cyan-400/30 to-transparent"
          style={{
            top: line.top,
            left: line.left,
            width: line.width,
            transform: `rotate(${line.rotate})`,
          }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: node.top,
            left: node.left,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            delay: node.delay,
            repeat: Infinity,
          }}
        >
          <div className="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
        </motion.div>
      ))}

      {/* Noise */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.8))]" />
    </div>
  );
}