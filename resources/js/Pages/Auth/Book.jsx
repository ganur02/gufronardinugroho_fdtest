"use client"

import BookDetailModal from "@/Components/Ui/Auth/BookDetailModal"
import BookFilter from "@/Components/Ui/Auth/BookFilter"
import BookModal from "@/Components/Ui/Auth/BookModal"
import BookPagination from "@/Components/Ui/Auth/BookPagination"
import BookTable from "@/Components/Ui/Auth/BookTable"
import DeleteConfirmModal from "@/Components/Ui/Auth/DeleteConfirmModal"
import AuthLayout from "@/Layouts/AuthLayout"
import { Head } from "@inertiajs/react"
import { BookOpen, Plus, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


export default function Book({ flash }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: "",
    page: 1,
  })

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [modalMode, setModalMode] = useState("create") 

  useEffect(() => {
    fetchBooks()
  }, [filters])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("api_token")

      const response = await fetch("/api/auth/buku", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        let filteredBooks = result.buku || []

        if (filters.search) {
          filteredBooks = filteredBooks.filter(
            (book) =>
              book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
              book.author.toLowerCase().includes(filters.search.toLowerCase()),
          )
        }

        const perPage = 6
        const total = filteredBooks.length
        const totalPages = Math.ceil(total / perPage)
        const startIndex = (filters.page - 1) * perPage
        const endIndex = startIndex + perPage
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex)

        setBooks(paginatedBooks)
        setPagination({
          current_page: filters.page,
          last_page: totalPages,
          per_page: perPage,
          total: total,
          from: startIndex + 1,
          to: Math.min(endIndex, total),
        })
      } else {
        toast.error("Gagal memuat data buku")
      }
    } catch (error) {
      console.error("Error mengambil data buku:", error)
      toast.error("Terjadi kesalahan saat memuat data buku")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }))
  }

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }))
  }

  const handleRefresh = () => {
    fetchBooks()
  }

  const handleCreate = () => {
    setSelectedBook(null)
    setModalMode("create")
    setShowModal(true)
  }

  const handleEdit = (book) => {
    setSelectedBook(book)
    setModalMode("edit")
    setShowModal(true)
  }

  const handleDetail = async (book) => {
    try {
      const token = localStorage.getItem("api_token")
      const response = await fetch(`/api/auth/buku/${book.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        setSelectedBook(result.buku)
        setShowDetailModal(true)
      } else {
        toast.error("Gagal memuat detail buku")
      }
    } catch (error) {
      console.error("Error mengambil detail buku:", error)
      toast.error("Terjadi kesalahan saat memuat detail buku")
    }
  }

  const handleDelete = (book) => {
    setSelectedBook(book)
    setShowDeleteModal(true)
  }

  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem("api_token")
      const url = modalMode === "create" ? "/api/auth/buku" : `/api/auth/buku/${selectedBook.id}`
      const method = modalMode === "create" ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setShowModal(false)
        fetchBooks()
        toast.success(modalMode === "create" ? "Buku berhasil ditambahkan!" : "Buku berhasil diperbarui!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Terjadi kesalahan saat menyimpan buku")
      }
    } catch (error) {
      console.error("Error menyimpan buku:", error)
      toast.error("Terjadi kesalahan saat menyimpan buku")
    }
  }

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("api_token")
      const response = await fetch(`/api/auth/buku/${selectedBook.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        setShowDeleteModal(false)
        fetchBooks()
        toast.success("Buku berhasil dihapus!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Terjadi kesalahan saat menghapus buku")
      }
    } catch (error) {
      console.error("Error menghapus buku:", error)
      toast.error("Terjadi kesalahan saat menghapus buku")
    }
  }

  return (
    <AuthLayout>
      <Head title="Manajemen Buku" />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Manajemen Buku</h1>
                  <p className="text-blue-100">Kelola koleksi buku Anda</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCreate}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Buku</span>
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {flash?.message && (
            <div className="mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-4 rounded-lg shadow-lg">
              <p className="font-medium">{flash.message}</p>
            </div>
          )}

          <BookFilter filters={filters} onFilterChange={handleFilterChange} loading={loading} />

          <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Buku</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
              </div>
              <div className="text-sm text-gray-500">
                {pagination.from && pagination.to
                  ? `Menampilkan ${pagination.from}-${pagination.to} dari ${pagination.total} buku`
                  : "Memuat data..."}
              </div>
            </div>
          </div>

          <BookTable
            books={books}
            loading={loading}
            onEdit={handleEdit}
            onDetail={handleDetail}
            onDelete={handleDelete}
          />

          {pagination.last_page > 1 && <BookPagination pagination={pagination} onPageChange={handlePageChange} />}
        </div>

        <BookModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          book={selectedBook}
          mode={modalMode}
        />

        <BookDetailModal show={showDetailModal} onClose={() => setShowDetailModal(false)} book={selectedBook} />

        <DeleteConfirmModal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          book={selectedBook}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </div>
    </AuthLayout>
  )
}
