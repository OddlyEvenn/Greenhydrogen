import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  SortAsc,
  SortDesc,
  RefreshCw,
  Download,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SearchFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'range' | 'checkbox';
  options?: { value: string; label: string }[];
  value?: any;
}

interface SmartSearchProps {
  onSearch: (query: string, filters: Record<string, any>) => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  filters?: SearchFilter[];
  quickFilters?: { label: string; filters: Record<string, any> }[];
  suggestions?: string[];
  showExport?: boolean;
}

export function SmartSearch({
  onSearch,
  onExport,
  searchPlaceholder = "Search transactions, producers, credits...",
  filters = [],
  quickFilters = [],
  suggestions = [],
  showExport = true
}: SmartSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string, filters: Record<string, any>) => {
      onSearch(query, { ...filters, sortBy, sortOrder });
    }, 300),
    [onSearch, sortBy, sortOrder]
  );

  useEffect(() => {
    debouncedSearch(searchQuery, activeFilters);
  }, [searchQuery, activeFilters, debouncedSearch]);

  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const clearFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      delete updated[filterId];
      return updated;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setSortBy("");
    setSortOrder("desc");
  };

  const applyQuickFilter = (quickFilter: { label: string; filters: Record<string, any> }) => {
    setActiveFilters(quickFilter.filters);
    setSearchQuery("");
  };

  const activeFilterCount = Object.keys(activeFilters).length;
  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 pr-4 h-12 text-base"
          />
        </div>

        {/* Search Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && searchQuery && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
            <CardContent className="p-2">
              {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 hover:bg-hover-bg rounded cursor-pointer"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <span>{suggestion}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={cn(
              "gap-2",
              activeFilterCount > 0 && "border-primary text-primary"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Quick Filters */}
          {quickFilters.map((quickFilter, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter(quickFilter)}
              className="text-xs"
            >
              {quickFilter.label}
            </Button>
          ))}

          {/* Sort Controls */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 h-8">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="producer">Producer</SelectItem>
            </SelectContent>
          </Select>

          {sortBy && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="p-2"
            >
              {sortOrder === "asc" ? (
                <SortAsc className="w-4 h-4" />
              ) : (
                <SortDesc className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Clear Filters */}
          {(activeFilterCount > 0 || searchQuery || sortBy) && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="gap-2 text-xs"
            >
              <RefreshCw className="w-4 h-4" />
              Clear All
            </Button>
          )}

          {/* Export Button */}
          {showExport && onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(f => f.id === key);
            if (!value || (Array.isArray(value) && value.length === 0)) return null;
            
            return (
              <Badge key={key} variant="secondary" className="gap-1">
                {filter?.label}: {Array.isArray(value) ? value.join(", ") : value.toString()}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => clearFilter(key)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Advanced Filters</CardTitle>
            <CardDescription>Refine your search with detailed criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>
                  {filter.type === 'text' && (
                    <Input
                      placeholder={`Enter ${filter.label.toLowerCase()}...`}
                      value={activeFilters[filter.id] || ""}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                    />
                  )}
                  {filter.type === 'select' && (
                    <Select
                      value={activeFilters[filter.id] || ""}
                      onValueChange={(value) => handleFilterChange(filter.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${filter.label.toLowerCase()}...`} />
                      </SelectTrigger>
                      <SelectContent>
                        {filter.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {filter.type === 'date' && (
                    <DateRangePicker
                      onDateChange={(range) => handleFilterChange(filter.id, range)}
                      value={activeFilters[filter.id]}
                    />
                  )}
                  {filter.type === 'checkbox' && filter.options && (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${filter.id}-${option.value}`}
                            checked={(activeFilters[filter.id] || []).includes(option.value)}
                            onCheckedChange={(checked) => {
                              const currentValues = activeFilters[filter.id] || [];
                              if (checked) {
                                handleFilterChange(filter.id, [...currentValues, option.value]);
                              } else {
                                handleFilterChange(filter.id, currentValues.filter((v: string) => v !== option.value));
                              }
                            }}
                          />
                          <label
                            htmlFor={`${filter.id}-${option.value}`}
                            className="text-sm cursor-pointer"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Date Range Picker Component
function DateRangePicker({ onDateChange, value }: {
  onDateChange: (range: { from: Date | null; to: Date | null }) => void;
  value?: { from: Date | null; to: Date | null };
}) {
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>(
    value || { from: null, to: null }
  );

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "From date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateRange.from || undefined}
            onSelect={(date) => {
              const newRange = { ...dateRange, from: date || null };
              setDateRange(newRange);
              onDateChange(newRange);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange.to && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "To date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateRange.to || undefined}
            onSelect={(date) => {
              const newRange = { ...dateRange, to: date || null };
              setDateRange(newRange);
              onDateChange(newRange);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}
