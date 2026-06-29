interface Props {
  keyword: string
  onKeywordChange: (keyword: string) => void
}

export function TaskSearch({ keyword, onKeywordChange }: Props) {
  return (
    <div className="task-search">
      <input
        type="search"
        className="task-search__input"
        placeholder="タスクを検索..."
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        aria-label="タスク検索"
      />
      {keyword && (
        <button
          type="button"
          className="task-search__clear"
          onClick={() => onKeywordChange('')}
          aria-label="検索をクリア"
        >
          ×
        </button>
      )}
    </div>
  )
}
