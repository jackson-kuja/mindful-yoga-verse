
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Session } from "@/data/sessions";
import { sessions } from "@/data/sessions";

// Get unique values from sessions data
const categories = ['All', ...Array.from(new Set(sessions.map(s => s.category)))];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All-Levels'];
const durations = [
    { label: "All", value: "all" },
    { label: "Under 15 min", value: "0-15" },
    { label: "16-30 min", value: "16-30" },
    { label: "Over 30 min", value: "31-999" },
];

interface FilterState {
  category: string;
  level: string;
  duration: string;
}

interface FilterBarProps {
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  
  const handleValueChange = (type: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [type]: value === 'All' ? 'all' : value });
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
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.duration} onValueChange={(value) => handleValueChange('duration', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by duration">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.level} onValueChange={(value) => handleValueChange('level', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by level">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" onClick={handleReset} className="sm:ml-auto" aria-label="Reset all filters">Reset</Button>
      </div>
    </div>
  );
};

export default FilterBar;
