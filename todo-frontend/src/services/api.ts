import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
});

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export const getTodos = () => API.get<Todo[]>('/todos');
export const createTodo = (title: string) => API.post<Todo>('/todos', { title });
export const updateTodo = (id: number, completed: boolean) => API.put<Todo>(`/todos/${id}`, { completed });
export const deleteTodo = (id: number) => API.delete(`/todos/${id}`);