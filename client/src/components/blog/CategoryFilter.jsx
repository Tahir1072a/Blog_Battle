import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Hash } from "lucide-react";
import api from "@/utils/api";

export function CategoryFilter({
  onFilterChange,
  selectedCategory = "",
  selectedRound = "",
  searchTerm = "",
  showRoundFilter = false,
}) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // Popüler kategorileri fetch et
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/blogs/categories");
        setCategories(response.data);
      } catch (error) {
        // Hata durumunda varsayılan kategoriler
        setCategories([
          { name: "Teknoloji", count: 0 },
          { name: "Gezi", count: 0 },
          { name: "Gastronomi", count: 0 },
          { name: "Sanat", count: 0 },
          { name: "Spor", count: 0 },
          { name: "Bilim", count: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Arama debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        category: selectedCategory,
        round: selectedRound,
        search: localSearch,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, selectedCategory, selectedRound, onFilterChange]);

  const handleCategorySelect = (categoryName) => {
    const newCategory = selectedCategory === categoryName ? "" : categoryName;
    onFilterChange({
      category: newCategory,
      round: selectedRound,
      search: localSearch,
    });
  };

  const handleRoundSelect = (round) => {
    const newRound = selectedRound === round ? "" : round;
    onFilterChange({
      category: selectedCategory,
      round: newRound,
      search: localSearch,
    });
  };

  const clearAllFilters = () => {
    setLocalSearch("");
    onFilterChange({
      category: "",
      round: "",
      search: "",
    });
  };

  const hasActiveFilters = selectedCategory || selectedRound || searchTerm;

  return (
    <div className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        {/* Ana Filtreler */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:items-center">
          {/* Arama */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Blog ara..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtre Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtreler
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {
                  [selectedCategory, selectedRound, searchTerm].filter(Boolean)
                    .length
                }
              </Badge>
            )}
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-4 w-4 mr-1" />
              Temizle
            </Button>
          )}
        </div>

        {/* Genişletilmiş Filtreler */}
        <div
          className={`mt-4 space-y-4 transition-all duration-200 ${
            showFilters || window.innerWidth >= 768 ? "block" : "hidden"
          }`}
        >
          {/* Kategoriler */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Hash className="h-4 w-4 mr-1" />
              Kategoriler
            </h4>
            <div className="flex flex-wrap gap-2">
              {isLoading
                ? // Skeleton loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-8 bg-gray-200 rounded-full animate-pulse"
                      style={{ width: `${60 + Math.random() * 40}px` }}
                    />
                  ))
                : categories.map((category) => (
                    <Button
                      key={category.name}
                      variant={
                        selectedCategory === category.name
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => handleCategorySelect(category.name)}
                      className="text-xs"
                    >
                      {category.name}
                      {category.count > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {category.count}
                        </Badge>
                      )}
                    </Button>
                  ))}
            </div>
          </div>

          {/* Round/Level Filtresi */}
          {showRoundFilter && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Seviye</h4>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((round) => (
                  <Button
                    key={round}
                    variant={
                      selectedRound === round.toString() ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleRoundSelect(round.toString())}
                    className="text-xs"
                  >
                    Lv. {round}
                  </Button>
                ))}
                <Button
                  variant={selectedRound === "5+" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRoundSelect("5+")}
                  className="text-xs"
                >
                  Lv. 5+
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Aktif Filtre Göstergesi */}
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2 items-center text-sm">
            <span className="text-gray-600">Aktif filtreler:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center">
                {selectedCategory}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleCategorySelect(selectedCategory)}
                />
              </Badge>
            )}
            {selectedRound && (
              <Badge variant="secondary" className="flex items-center">
                Lv. {selectedRound}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => handleRoundSelect(selectedRound)}
                />
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center">
                "{searchTerm}"
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => setLocalSearch("")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Badge component (eğer yoksa)
export function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// Kullanım örneği
export function CategoryFilterExample() {
  const [filters, setFilters] = useState({
    category: "",
    round: "",
    search: "",
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // API call veya state update buraya
    console.log("Filters changed:", newFilters);
  };

  return (
    <CategoryFilter
      onFilterChange={handleFilterChange}
      selectedCategory={filters.category}
      selectedRound={filters.round}
      searchTerm={filters.search}
      showRoundFilter={true}
    />
  );
}
