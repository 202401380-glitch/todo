import { useEffect, useState } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './services/api';
import type { Todo } from './services/api';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Sparkles } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTodos = async () => {
    try {
      const res = await getTodos();
      setTodos(res.data);
    } catch (err) {
      console.error('Error fetching todos', err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    try {
      await createTodo(input.trim());
      setInput('');
      await fetchTodos();
    } catch (err) {
      console.error('Error adding todo', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: newStatus } : todo
      )
    );

    try {
      await updateTodo(id, newStatus);
    } catch (err) {
      console.error('Error updating todo', err);
      await fetchTodos();
    }
  };

  const handleDelete = async (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

    try {
      await deleteTodo(id);
    } catch (err) {
      console.error('Error deleting todo', err);
      await fetchTodos();
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-slate-800/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400 border border-indigo-500/20">
                <ListTodo size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  Zee's list
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">NestJS & React Powered</p>
              </div>
            </div>

            {todos.length > 0 && (
              <div className="text-right">
                <span className="text-xs font-medium text-slate-400 block">Progress</span>
                <span className="text-sm font-semibold text-indigo-300">
                  {completedCount} / {todos.length} Done
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {todos.length > 0 && (
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2 border border-slate-700/50">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${(completedCount / todos.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Input Form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleAdd} className="flex gap-3 mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-100 placeholder-slate-500 transition duration-200"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-5 py-3 rounded-xl transition duration-200 flex items-center gap-2 font-medium text-sm shadow-lg shadow-indigo-600/25 active:scale-95 cursor-pointer"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </form>

          {/* Tasks List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {todos.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl bg-slate-950/30">
                <Sparkles className="mx-auto text-slate-600 mb-3" size={32} />
                <p className="text-sm font-medium text-slate-400">All caught up!</p>
                <p className="text-xs text-slate-500 mt-1">Add a new task above to get started.</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    todo.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                      : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className="flex items-center gap-3.5 cursor-pointer flex-1 mr-3 select-none"
                    onClick={() => handleToggle(todo.id, todo.completed)}
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="text-emerald-400 shrink-0 transition-transform active:scale-75" size={22} />
                    ) : (
                      <Circle className="text-slate-500 group-hover:text-indigo-400 shrink-0 transition-colors" size={22} />
                    )}
                    <span
                      className={`text-sm font-medium transition-all ${
                        todo.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {todo.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="text-slate-500 hover:text-rose-400 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}