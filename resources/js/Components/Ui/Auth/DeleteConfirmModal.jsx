"use client"

import { AlertTriangle, X } from "lucide-react"

export default function DeleteConfirmModal({ show, onClose, onConfirm, book }) {
  if (!show || !book) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Konfirmasi Hapus</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Hapus Buku</h3>
              <p className="text-gray-600">Tindakan ini tidak dapat dibatalkan</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">Anda akan menghapus buku:</p>
            <p className="font-semibold text-gray-900 mt-1">"{book.title}"</p>
            <p className="text-sm text-gray-600">oleh {book.author}</p>
          </div>

          <p className="text-sm text-gray-600">
            Apakah Anda yakin ingin menghapus buku ini? Semua data terkait akan hilang secara permanen.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Hapus Buku
          </button>
        </div>
      </div>
    </div>
  )
}
