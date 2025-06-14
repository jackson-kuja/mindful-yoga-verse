
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterState {
  category: string;
  level: string;
  duration: string;
}

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
    availableCategories: string[];
    availableLevels: string[];
    availableDurations: { label: string; value: string }[];
}

const FilterBar = ({ 
  filters, 
  onFilterChange, 
  availableCategories, 
  availableLevels, 
  availableDurations 
}: FilterBarProps) => {
  
  const handleValueChange = (type: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [type]: value });
  };

  const handleReset = () => {
    onFilterChange({ category: 'all', level: 'all', duration: 'all' });
  }

  return (
    <div className="p-4 bg-background border-b sticky top-16 z-40">
      <div className="container flex flex-col sm:flex-row sm:items-center gap-4">
        <h3 className="text-md font-semibold mr-4 hidden sm:block">Filter By:</h3>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 flex-wrap">
          <Select value={filters.category} onValueChange={(value) => handleValueChange('category', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map(c => <SelectItem key={c} value={c === 'All' ? 'all' : c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.duration} onValueChange={(value) => handleValueChange('duration', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by duration">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {availableDurations.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.level} onValueChange={(value) => handleValueChange('level', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by level">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {availableLevels.map(l => <SelectItem key={l} value={l === 'All' ? 'all' : l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" onClick={handleReset} className="sm:ml-auto" aria-label="Reset all filters">Reset</Button>
      </div>
    </div>
  );
};

export default FilterBar;
