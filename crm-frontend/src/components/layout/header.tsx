"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export function AppHeader() {
  const { toggleSidebar, isMobile, open } = useSidebar();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <div className="flex items-center gap-2">
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="-ml-1"
          >
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        ) : (
          <SidebarTrigger className="-ml-1" />
        )}
        <div className="h-6 w-px bg-border mx-2" />
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">CRM Dashboard</h1>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          Sidebar: {open ? "Open" : "Closed"}
        </div>
      </div>
    </header>
  );
}
