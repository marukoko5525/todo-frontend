import { useState } from 'react'
import { useTasks } from './hooks/useTasks'
import { TaskForm } from './components/TaskForm'
import { TaskFilter } from './components/TaskFilter'
import { TaskSearch } from './components/TaskSearch'
import { TaskList } from './components/TaskList'
import type { Task } from './types/task'
import './styles/global.css'

export default function App() {
  const {
    tasks,
    filteredTasks,
    filter,
    searchKeyword,
    loading,
    error,
    setFilter,
    setSearchKeyword,
    addTask,
    toggleComplete,
    updateTask,
    deleteTask,
    clearError,
  } = useTasks()

  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleEdit = (task: Task) => setEditingTask(task)
  const handleCancelEdit = () => setEditingTask(null)

  const handleSubmit = async (req: { title: string; description?: string }) => {
    if (editingTask) {
      await updateTask(editingTask.id, req)
      setEditingTask(null)
    } else {
      await addTask(req)
    }
  }

  const activeCount = tasks.filter((t) => !t.completed).length

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="app-header__title">ToDo</h1>
        <p className="app-header__sub">
          <strong>{activeCount}</strong> 件の未完了タスク
        </p>
      </header>

      <TaskForm
        onSubmit={handleSubmit}
        editingTask={editingTask}
        onCancelEdit={handleCancelEdit}
      />

      <TaskSearch
        keyword={searchKeyword}
        onKeywordChange={setSearchKeyword}
      />

      <TaskFilter
        filter={filter}
        tasks={tasks}
        onFilterChange={setFilter}
      />

      <TaskList
        tasks={filteredTasks}
        loading={loading}
        onToggle={toggleComplete}
        onEdit={handleEdit}
        onDelete={deleteTask}
      />

      {error && (
        <div className="error-toast" role="alert">
          {error}
          <button
            className="error-toast__close"
            onClick={clearError}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
      )}
    </main>
  )
}
