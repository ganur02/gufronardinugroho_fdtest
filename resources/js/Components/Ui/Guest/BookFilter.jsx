"use client"

import { Calendar, Filter, Search, Star, X } from "lucide-react"
import { useState } from "react"

export default function BookFilter({ filters, onFilterChange, loading }) {
  const [showFilters, setShowFilters] = useState(false)

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value })
  }

  const clearFilters = () => {
    onFilterChange({ author: "", date: "", min_rating: "" })
  }

  const hasActiveFilters = filters.author || filters.date || filters.min_rating

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan penulis..."
              value={filters.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
              hasActiveFilters
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {(filters.author ? 1 : 0) + (filters.date ? 1 : 0) + (filters.min_rating ? 1 : 0)}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
              <span>Hapus Filter</span>
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Tanggal Publikasi
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Star className="w-4 h-4 inline mr-2" />
                Rating Minimum
              </label>
              <select
                value={filters.min_rating}
                onChange={(e) => handleInputChange("min_rating", e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="">Semua Rating</option>
                <option value="1">1+ Bintang</option>
                <option value="2">2+ Bintang</option>
                <option value="3">3+ Bintang</option>
                <option value="4">4+ Bintang</option>
                <option value="5">5 Bintang</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
