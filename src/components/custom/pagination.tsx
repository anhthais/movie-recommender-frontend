import React from "react";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const CustomPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageLimitInCenter = 3;

  const getPageNumbers = () => {
    let pages: (number | string)[] = [];

    if (totalPages <= pageLimitInCenter + 2) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= pageLimitInCenter) {
      pages = Array.from({ length: pageLimitInCenter + 1 }, (_, i) => i + 1);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage > totalPages - pageLimitInCenter) {
      pages.push(1);
      pages.push("...");
      pages = pages.concat(
        Array.from(
          { length: pageLimitInCenter + 1 },
          (_, i) => totalPages - pageLimitInCenter + i
        )
      );
    } else {
      const startPage = Math.max(
        currentPage - Math.floor(pageLimitInCenter / 2),
        1
      );
      const endPage = Math.min(
        currentPage + Math.floor(pageLimitInCenter / 2),
        totalPages
      );

      if (startPage > 1) {
        pages.push(1);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      if (endPage < totalPages) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <Pagination className="scale-75 sm:scale-100">
      <PaginationContent>
        <PaginationItem onClick={() => onPageChange(Math.max(currentPage - 1, 1))} className={`${currentPage === 1  ? 'pointer-events-none hover:bg-inherit' : 'cursor-pointer'}`}>
          <PaginationPrevious/>
        </PaginationItem>
        {pages.map((page, index) =>
          typeof page === "number" ? (
            <PaginationItem key={index} onClick={() => onPageChange(page)} className="cursor-pointer">
              <PaginationLink isActive={ page === currentPage }>{page}</PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}
        <PaginationItem onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} className={`${currentPage === totalPages  ? 'pointer-events-none hover:bg-inherit' : 'cursor-pointer'}`}>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;