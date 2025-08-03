"use client"

import { Star, X } from "lucide-react"
import { useState } from "react"

export default function RatingModal({ show, onClose, onSubmit, book }) {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (selectedRating === 0) return

    setLoading(true)
    try {
      await onSubmit(selectedRating)
      setSelectedRating(0)
      setHoverRating(0)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedRating(0)
    setHoverRating(0)
    onClose()
  }

  if (!show || !book) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">

        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Beri Rating</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">

          <div className="text-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{book.title}</h3>
            <p className="text-sm text-gray-600">oleh {book.author}</p>
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-4">Berikan rating untuk buku ini:</p>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-all duration-200 hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoverRating || selectedRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {selectedRating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedRating === 1 && "Sangat Buruk"}
                {selectedRating === 2 && "Buruk"}
                {selectedRating === 3 && "Cukup"}
                {selectedRating === 4 && "Bagus"}
                {selectedRating === 5 && "Sangat Bagus"}
              </p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={selectedRating === 0 || loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {loading ? "Menyimpan..." : "Kirim Rating"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
