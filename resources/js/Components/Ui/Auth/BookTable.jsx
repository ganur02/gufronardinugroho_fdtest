"use client"

import { BookOpen, Edit, Eye, Star, Trash2 } from "lucide-react"

export default function BookTable({ books, loading, onEdit, onDetail, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400 fill-current opacity-50" />)
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />)
      }
    }
    return stars
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data buku...</p>
        </div>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-8 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada buku</h3>
          <p className="text-gray-600">Belum ada buku yang ditambahkan atau tidak ada yang sesuai dengan pencarian.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book) => (
        <div
          key={book.id}
          className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="aspect-w-3 aspect-h-4 bg-gray-200">
            {book.thumbnail ? (
              <img src={`/${book.thumbnail}`} alt={book.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-blue-400" />
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600 mb-2">oleh {book.author}</p>

            <div className="flex items-center mb-2">
              <div className="flex items-center space-x-1">{renderStars(book.average_rating)}</div>
              <span className="ml-2 text-sm text-gray-600">({book.average_rating})</span>
            </div>

            {book.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{book.description}</p>}

            <p className="text-xs text-gray-500 mb-4">Ditambahkan: {formatDate(book.tanggal)}</p>

            <div className="flex items-center justify-between">
              <button
                onClick={() => onDetail(book)}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Detail</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(book)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  title="Edit Buku"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(book)}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  title="Hapus Buku"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
