"use client";

import { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw, Coffee, Zap, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { logStudySession } from "@/app/dashboard/study/actions";

export default function PomodoroTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [rewardMsg, setRewardMsg] = useState(false);
  const [audioActive, setAudioActive] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5 note

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    playChime();
    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1);
      setRewardMsg(true);
      setTimeout(() => setRewardMsg(false), 5000);
      try {
        await logStudySession(25 * 60);
      } catch (e) {
        console.error("Failed to log pomodoro focus session:", e);
      }
      setMode("break");
      setTimeLeft(5 * 60);
    } else {
      setMode("focus");
      setTimeLeft(25 * 60);
    }
  };

  const toggleAmbient = () => {
    if (audioActive) {
      stopAmbient();
    } else {
      startAmbient();
    }
  };

  const startAmbient = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Generate brownian noise for soothing rain effect
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 650;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.12;

      noise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      noise.start(0);
      noiseNodeRef.current = noise;
      setAudioActive(true);
    } catch (e) {
      console.error("Failed to start focus audio backdrop:", e);
    }
  };

  const stopAmbient = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
      } catch (e) {}
      noiseNodeRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    setAudioActive(false);
  };

  // Sync tab title with timer countdown
  useEffect(() => {
    if (isRunning) {
      document.title = `(${formatTime(timeLeft)}) ${mode === "focus" ? "Focus" : "Break"} | Synapse`;
    } else {
      document.title = "Synapse";
    }
    return () => {
      document.title = "Synapse";
    };
  }, [timeLeft, isRunning, mode]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (noiseNodeRef.current || audioContextRef.current) {
        stopAmbient();
      }
    };
  }, []);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: "focus" | "break") => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
          isRunning
            ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 animate-pulse"
            : "border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        title="Pomodoro Focus Timer"
      >
        <Timer className="h-3.5 w-3.5 text-indigo-500" />
        <span>{formatTime(timeLeft)}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-72 rounded-2xl border border-border bg-card p-5 shadow-2xl space-y-4 backdrop-blur-xl animate-fade-in">
          {/* Mode Switcher */}
          <div className="flex rounded-xl bg-muted/50 p-1 text-xs font-semibold">
            <button
              onClick={() => switchMode("focus")}
              className={`flex-1 rounded-lg py-1.5 transition text-center cursor-pointer ${
                mode === "focus"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => switchMode("break")}
              className={`flex-1 rounded-lg py-1.5 transition text-center cursor-pointer ${
                mode === "break"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Break (5m)
            </button>
          </div>

          {/* Timer Display */}
          <div className="text-center py-2 space-y-1">
            <h3 className="text-4xl font-black font-mono tracking-tight text-foreground">
              {formatTime(timeLeft)}
            </h3>
            <p className="text-xs text-muted-foreground font-medium flex items-center justify-center gap-1">
              {mode === "focus" ? (
                <>
                  <Zap className="h-3.5 w-3.5 text-indigo-500" />
                  Deep Focus Study Session
                </>
              ) : (
                <>
                  <Coffee className="h-3.5 w-3.5 text-emerald-500" />
                  Short Rest & Recharge
                </>
              )}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimer}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white transition cursor-pointer ${
                isRunning ? "bg-amber-600 hover:bg-amber-500" : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start Focus
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="rounded-xl border border-border bg-muted/40 p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Focus Sound Backdrop */}
          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                <Coffee className="h-3.5 w-3.5 text-indigo-500" />
                Focus Sound Backdrop
              </span>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Synthesized Rain</span>
            </div>
            
            <button
              type="button"
              onClick={toggleAmbient}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-semibold border transition cursor-pointer ${
                audioActive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-border bg-card/60 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {audioActive ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" /> Stop Focus Sound
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" /> Start Focus Sound
                </>
              )}
            </button>
          </div>

          {/* Completed count Banner */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Completed Today: <strong>{completedSessions}</strong></span>
            {rewardMsg && (
              <span className="flex items-center gap-1 font-bold text-emerald-500 animate-bounce">
                <CheckCircle2 className="h-3.5 w-3.5" /> Session Logged!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
