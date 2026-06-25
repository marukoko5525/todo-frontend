import type { FilterType, Task } from '../types/task'

interface Props {
  filter: FilterType
  tasks: Task[]
  onFilterChange: (f: FilterType) => void
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了済み' },
]

export function TaskFilter({ filter, tasks, onFilterChange }: Props) {
  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  const countFor = (value: FilterType) => {
    if (value === 'all') return tasks.length
    if (value === 'active') return activeCount
    return completedCount
  }

  return (
    <div className="task-filter" role="tablist" aria-label="表示フィルター">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          role="tab"
          aria-selected={filter === value}
          className={`task-filter__tab ${filter === value ? 'task-filter__tab--active' : ''}`}
          onClick={() => onFilterChange(value)}
        >
          {label}
          <span className="task-filter__count">{countFor(value)}</span>
        </button>
      ))}
    </div>
  )
}
