"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ReusablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showEllipsis?: boolean;
  className?: string;
}

export function ReusablePagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
  showEllipsis = true,
  className,
}: ReusablePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = showEllipsis && visiblePages[0] > 1;
  const showEndEllipsis =
    showEllipsis && visiblePages[visiblePages.length - 1] < totalPages;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={
              currentPage <= 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                className="cursor-pointer"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              isActive={currentPage === pageNum}
              onClick={() => onPageChange(pageNum)}
              className="cursor-pointer"
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showEndEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(totalPages)}
                className="cursor-pointer"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              currentPage >= totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
