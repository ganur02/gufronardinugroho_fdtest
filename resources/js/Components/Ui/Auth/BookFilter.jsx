"use client"

import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function BookFilter({ filters, onFilterChange, loading }) {
  const [localSearch, setLocalSearch] = useState(filters.search)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ search: localSearch })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localSearch])

  const clearFilters = () => {
    setLocalSearch("")
    onFilterChange({ search: "" })
  }

  const hasActiveFilters = filters.search

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan judul atau penulis..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Hapus Filter</span>
          </button>
        )}
      </div>
    </div>
  )
}
