import { CATEGORIES } from '@/lib/constants'
import { useFeedStore } from '@/stores/feedStore'

export function CategoryFilter() {
  const { filter, setFilter } = useFeedStore()

  return (
    <div className="flex flex-wrap gap-2 py-3 px-4">
      <button
        onClick={() => setFilter({ category: null })}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          filter.category === null
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Todas
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setFilter({ category: cat.id })}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            filter.category === cat.id
              ? 'text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          style={filter.category === cat.id ? { backgroundColor: cat.color } : undefined}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}
