import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { todoSchema, TodoInput } from '../lib/schemas';
import { Todo } from '../lib/queries';
import { X } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (data: TodoInput) => void;
  onCancel: () => void;
  editingTodo?: Todo | null;
}

const TodoForm = ({ onSubmit, onCancel, editingTodo }: TodoFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TodoInput>({
    resolver: zodResolver(todoSchema),
    defaultValues: editingTodo
      ? {
          title: editingTodo.title,
          description: editingTodo.description || '',
        }
      : undefined,
  });

  useEffect(() => {
    if (editingTodo) {
      reset({
        title: editingTodo.title,
        description: editingTodo.description || '',
      });
    }
  }, [editingTodo, reset]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {editingTodo ? 'Edit Todo' : 'Create New Todo'}
          </h3>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="input-field"
              placeholder="Enter todo title"
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={4}
              className="input-field resize-none"
              placeholder="Enter todo description (optional)"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-2">
            <button type="submit" className="flex-1 btn-primary">
              {editingTodo ? 'Update Todo' : 'Create Todo'}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;

