import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

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
    <div className="flex items-center justify-center space-x-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Önceki
      </Button>
      <span className="text-sm font-medium">
        Sayfa {currentPage} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Sonraki
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}
