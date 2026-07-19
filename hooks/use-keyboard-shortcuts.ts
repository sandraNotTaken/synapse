"use client";

import { useEffect } from "react";

type ShortcutMap = Record<string, () => void>;

export function useKeyboardShortcuts(shortcuts: ShortcutMap, dependencies: any[] = []) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts if the user is typing in an input, textarea, or contenteditable element
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("[contenteditable='true']");

      if (isInput) return;

      // Handle simple single key shortcuts or combined modifiers
      const keysPressed: string[] = [];
      if (event.ctrlKey || event.metaKey) keysPressed.push("ctrl");
      if (event.shiftKey) keysPressed.push("shift");
      if (event.altKey) keysPressed.push("alt");
      
      const mainKey = event.key.toLowerCase();
      
      // Map modifier + key (e.g. "ctrl+s")
      if (keysPressed.length > 0) {
        const fullCombo = `${keysPressed.join("+")}+${mainKey}`;
        if (shortcuts[fullCombo]) {
          event.preventDefault();
          shortcuts[fullCombo]();
          return;
        }
      }

      // Map single key (e.g. "?", "space", "1", "2")
      let keyName = mainKey;
      if (keyName === " ") keyName = "space";

      if (shortcuts[keyName]) {
        // Space might scroll the page, prevent it
        if (keyName === "space") {
          event.preventDefault();
        }
        shortcuts[keyName]();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, ...dependencies]);
}
