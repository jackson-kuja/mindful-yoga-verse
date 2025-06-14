
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// TODO: These should probably come from the data source or a config file
const durations = ["15 min", "30 min", "45 min"];
const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
const focuses = ["Flexibility", "Strength", "Relaxation"];

const FilterBar = () => {
  // TODO: Implement state management and filtering logic
  const handleFilterChange = (type: string, value: string) => {
    console.log(`Filter changed: ${type} = ${value}`);
  };

  const handleReset = () => {
    console.log('Filters reset');
  }

  return (
    <div className="p-4 bg-background border-b sticky top-16 z-40">
      <div className="container flex flex-col sm:flex-row sm:items-center gap-4">
        <h3 className="text-md font-semibold mr-4 hidden sm:block">Filter By:</h3>
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 flex-wrap">
          <Select onValueChange={(value) => handleFilterChange('duration', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by duration">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              {durations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('level', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by level">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('focus', value)}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by focus area">
              <SelectValue placeholder="Focus Area" />
            </SelectTrigger>
            <SelectContent>
              {focuses.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" onClick={handleReset} className="sm:ml-auto" aria-label="Reset all filters">Reset</Button>
      </div>
    </div>
  );
};

export default FilterBar;

