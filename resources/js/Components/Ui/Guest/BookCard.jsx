"use client"

import { BookOpen, Calendar, Star, User } from "lucide-react"

export default function BookCard({ book, onRate }) {
  const renderStars = (rating, size = "w-4 h-4") => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className={`${size} text-yellow-400 fill-current`} />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className={`${size} text-yellow-400 fill-current opacity-50`} />)
      } else {
        stars.push(<Star key={i} className={`${size} text-gray-300`} />)
      }
    }
    return stars
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300">

      <div className="aspect-w-3 aspect-h-4 bg-gray-200">
        {book.thumbnail ? (
          <img src={book.thumbnail || "/placeholder.svg"} alt={book.title} className="w-full h-56 object-cover" />
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-blue-400" />
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-3">oleh {book.author}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">{renderStars(book.rata_rata_rating || 0)}</div>
            <span className="text-sm font-medium text-gray-700">{book.rata_rata_rating || 0}</span>
            <span className="text-xs text-gray-500">({book.jumlah_rating} rating)</span>
          </div>
        </div>

        {book.description && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{book.description}</p>}

        <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {book.user.foto ? (
              <img
                src={book.user.foto || "/placeholder.svg"}
                alt={book.user.nama}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
            <span className="text-xs text-gray-600">{book.user.nama}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{book.dibuat}</span>
          </div>
        </div>

        <button
          onClick={() => onRate(book)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <Star className="w-4 h-4" />
          <span>Beri Rating</span>
        </button>
      </div>
    </div>
  )
}
