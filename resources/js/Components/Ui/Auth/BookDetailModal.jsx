"use client"

import { BookOpen, Calendar, Star, User, X } from "lucide-react"

export default function BookDetailModal({ show, onClose, book }) {
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
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400 fill-current opacity-50" />)
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />)
      }
    }
    return stars
  }

  if (!show || !book) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Detail Buku</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg overflow-hidden">
                {book.thumbnail ? (
                  <img src={`/${book.thumbnail}`} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-blue-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  <span>oleh {book.author}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center">{renderStars(book.average_rating)}</div>
                <span className="text-lg font-semibold text-gray-900">{book.average_rating}</span>
                <span className="text-gray-600">/ 5.0</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Ditambahkan pada {formatDate(book.tanggal)}</span>
              </div>

              {book.description && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h4>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500">ID Buku: {book.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
