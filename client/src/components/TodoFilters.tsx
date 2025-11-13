import { Search, Filter } from 'lucide-react';

interface TodoFiltersProps {
  filter: 'all' | 'active' | 'completed';
  search: string;
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  onSearchChange: (search: string) => void;
}

const TodoFilters = ({ filter, search, onFilterChange, onSearchChange }: TodoFiltersProps) => {
  return (
    <div className="card space-y-4">
      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
        <Filter className="w-5 h-5" />
        <span className="font-medium">Filters</span>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search todos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'active'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'completed'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

export default TodoFilters;

