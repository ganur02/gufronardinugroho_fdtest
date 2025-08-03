"use client"

import { BookOpen, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

export default function BookModal({ show, onClose, onSave, book, mode }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    thumbnail: null,
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show) {
      if (mode === "edit" && book) {
        setFormData({
          title: book.title || "",
          author: book.author || "",
          description: book.description || "",
          thumbnail: null,
        })
        setPreviewImage(book.thumbnail ? `/${book.thumbnail}` : null)
      } else {
        setFormData({
          title: "",
          author: "",
          description: "",
          thumbnail: null,
        })
        setPreviewImage(null)
      }
    }
  }, [show, mode, book])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file tidak boleh lebih dari 2MB")
        return
      }

      if (!file.type.startsWith("image/")) {
        toast.error("File harus berupa gambar")
        return
      }

      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
      }))

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Judul buku harus diisi")
      return
    }

    if (!formData.author.trim()) {
      toast.error("Nama penulis harus diisi")
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("author", formData.author)
      submitData.append("description", formData.description)

      if (formData.thumbnail) {
        submitData.append("thumbnail", formData.thumbnail)
      }

      await onSave(submitData)
    } catch (error) {
      console.error("Error saving book:", error)
      toast.error("Terjadi kesalahan saat menyimpan buku")
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Tambah Buku Baru" : "Edit Buku"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Buku *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan judul buku"
                />
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Penulis *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama penulis"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan deskripsi buku (opsional)"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Buku</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null)
                        setFormData((prev) => ({ ...prev, thumbnail: null }))
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload cover buku</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="thumbnail" />
                    <label
                      htmlFor="thumbnail"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Pilih File
                    </label>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG. Maksimal 2MB.</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? "Menyimpan..." : mode === "create" ? "Tambah Buku" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
