import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './api';
import { todoSchema, TodoInput } from './schemas';
import toast from 'react-hot-toast';

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface TodosResponse {
  success: boolean;
  data: Todo[];
  count: number;
}

interface TodoResponse {
  success: boolean;
  data: Todo;
  message?: string;
}

// Get all todos
export const useTodos = (completed?: boolean, search?: string) => {
  return useQuery<TodosResponse>({
    queryKey: ['todos', completed, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (completed !== undefined) params.append('completed', String(completed));
      if (search) params.append('search', search);
      
      const { data } = await api.get(`/todos?${params.toString()}`);
      return data;
    },
  });
};

// Get single todo
export const useTodo = (id: string) => {
  return useQuery<TodoResponse>({
    queryKey: ['todo', id],
    queryFn: async () => {
      const { data } = await api.get(`/todos/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

// Create todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoData: TodoInput) => {
      todoSchema.parse(todoData);
      const { data } = await api.post('/todos', todoData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create todo');
    },
  });
};

// Update todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...todoData }: { id: string } & Partial<TodoInput> & { completed?: boolean }) => {
      const { data } = await api.put(`/todos/${id}`, todoData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update todo');
    },
  });
};

// Delete todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/todos/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete todo');
    },
  });
};

// Toggle todo completion
export const useToggleTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.patch(`/todos/${id}/toggle`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update todo');
    },
  });
};

