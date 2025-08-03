"use client"

import { Filter, Search, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function UserFilter({ filters, onFilterChange, loading }) {
  const [localSearch, setLocalSearch] = useState(filters.search)
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ search: localSearch })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [localSearch])

  const handleVerifiedChange = (value) => {
    onFilterChange({ verified: value })
  }

  const clearFilters = () => {
    setLocalSearch("")
    onFilterChange({ search: "", verified: "" })
  }

  const hasActiveFilters = filters.search || filters.verified !== ""

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
              hasActiveFilters
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filters.search ? 1 : 0) + (filters.verified !== "" ? 1 : 0)}
              </span>
            )}
          </button>

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

      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status Verifikasi Email</label>
              <select
                value={filters.verified}
                onChange={(e) => handleVerifiedChange(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Semua Status</option>
                <option value="1">Terverifikasi</option>
                <option value="0">Belum Terverifikasi</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
