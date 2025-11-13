import { useState } from 'react';
import { useTodos, useCreateTodo, useUpdateTodo, useDeleteTodo, useToggleTodo, Todo } from '../lib/queries';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import TodoFilters from '../components/TodoFilters';
import { Plus, CheckCircle2, ListTodo } from 'lucide-react';

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const completedFilter = filter === 'all' ? undefined : filter === 'completed';

  const { data: todosData, isLoading } = useTodos(completedFilter, search || undefined);
  const todos = todosData?.data || [];

  const createMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();
  const deleteMutation = useDeleteTodo();
  const toggleMutation = useToggleTodo();

  const handleSubmit = (data: { title: string; description?: string }) => {
    if (editingTodo) {
      updateMutation.mutate({ id: editingTodo._id, ...data });
      setEditingTodo(null);
    } else {
      createMutation.mutate(data);
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggle = (id: string) => {
    toggleMutation.mutate(id);
  };

  const completedCount = todos.filter(t => t.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">My Todos</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your tasks and stay organized
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingTodo(null);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Todo</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ListTodo className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{todos.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <ListTodo className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TodoFilters
        filter={filter}
        search={search}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
      />

      {/* Todo Form Modal */}
      {showForm && (
        <TodoForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTodo(null);
          }}
          editingTodo={editingTodo}
        />
      )}

      {/* Todos List */}
      {isLoading ? (
        <div className="card text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading todos...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="card text-center py-12">
          <ListTodo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No todos found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {search ? 'Try adjusting your search.' : 'Get started by creating your first todo!'}
          </p>
          {!search && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Create Todo
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo._id}
              todo={todo}
              onToggle={() => handleToggle(todo._id)}
              onDelete={() => handleDelete(todo._id)}
              onEdit={() => {
                setEditingTodo(todo);
                setShowForm(true);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

