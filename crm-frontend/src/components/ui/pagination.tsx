"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Pagination({
  className,
  children,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <ul className="flex flex-row items-center gap-1">{children}</ul>
    </nav>
  );
}

export function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

export function PaginationItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return <li className={cn("", className)} {...props} />;
}

export function PaginationLink({
  className,
  isActive,
  ...props
}: React.ComponentProps<"button"> & { isActive?: boolean }) {
  return (
    <button
      className={cn(
        "border-border text-foreground hover:bg-accent hover:text-accent-foreground inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm",
        isActive && "bg-accent text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

export function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "border-border hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm",
        className
      )}
      {...props}
    >
      Previous
    </button>
  );
}

export function PaginationNext({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "border-border hover:bg-accent hover:text-accent-foreground inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm",
        className
      )}
      {...props}
    >
      Next
    </button>
  );
}

export function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex h-9 w-9 items-center justify-center",
        className
      )}
      {...props}
    >
      …
    </span>
  );
}
