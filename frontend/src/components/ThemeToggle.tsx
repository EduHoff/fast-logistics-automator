"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground px-1">
        Aparência
      </span>
      <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mounted && theme === "light"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sun className="h-3.5 w-3.5" />
          Claro
        </button>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mounted && theme === "dark"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Moon className="h-3.5 w-3.5" />
          Escuro
        </button>
        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            mounted && theme === "system"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Monitor className="h-3.5 w-3.5" />
          Sistema
        </button>
      </div>
    </div>
  );
}
