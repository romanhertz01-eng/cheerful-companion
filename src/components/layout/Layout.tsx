import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { CommandPaletteProvider } from "@/hooks/useCommandPalette";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const sidebarPages = ["/text", "/design", "/video", "/audio", "/agents", "/toolkit", "/history", "/pricing", "/create"];
const workspacePages = ["/text", "/design", "/video", "/audio", "/create"];

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAuthed } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  // Auth page has no layout at all
  if (location.pathname === "/auth") {
    return <>{children}</>;
  }

  const showSidebar = isAuthed && sidebarPages.some((p) => location.pathname.startsWith(p));
  const isFullWidth = !showSidebar;
  const isWorkspace = workspacePages.includes(location.pathname);

  return (
    <CommandPaletteProvider>
      <div className="min-h-screen bg-background">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          showBurger={showSidebar || !isAuthed}
        />

        {showSidebar && (
          <Sidebar
            open={sidebarOpen}
            collapsed={sidebarCollapsed}
            onClose={() => setSidebarOpen(false)}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}

        <main
          className={cn(
            "transition-all duration-300",
            !isFullWidth && (sidebarCollapsed ? "lg:pl-14" : "lg:pl-[200px]"),
          )}
        >
          {isFullWidth ? (
            children
          ) : isWorkspace ? (
            <div className="max-w-full">{children}</div>
          ) : (
            <div className="p-4 md:p-6 max-w-full">{children}</div>
          )}
        </main>

        <CommandPalette />

        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9999]"
          style={{
            opacity: theme === "dark" ? 0.035 : 0.12,
            mixBlendMode: theme === "dark" ? "overlay" : "multiply",
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="era-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="1.2" intercept="0.05" />
                <feFuncG type="linear" slope="0.9" />
                <feFuncB type="linear" slope="0.7" />
              </feComponentTransfer>
            </filter>
            <rect width="100%" height="100%" filter="url(#era-grain)" />
          </svg>
        </div>
      </div>
    </CommandPaletteProvider>
  );
}
