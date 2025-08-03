"use client"

import BookCard from "@/Components/Ui/Guest/BookCard"
import BookFilter from "@/Components/Ui/Guest/BookFilter"
import BookPagination from "@/Components/Ui/Guest/BookPagination"
import RatingModal from "@/Components/Ui/Guest/RatingModal"
import { Head } from "@inertiajs/react"
import { BookOpen, Star, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function GuestBook() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    author: "",
    date: "",
    min_rating: "",
    page: 1,
  })

  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [filters])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filters.author) params.append("author", filters.author)
      if (filters.date) params.append("date", filters.date)
      if (filters.min_rating) params.append("min_rating", filters.min_rating)
      params.append("page", filters.page.toString())

      const response = await fetch(`/api/buku/publik?${params.toString()}`, {
        headers: {
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        setBooks(result.data)
        setPagination({
          current_page: result.current_page,
          last_page: result.last_page,
          per_page: result.per_page,
          total: result.total,
          from: result.from,
          to: result.to,
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

  const handleRateBook = (book) => {
    setSelectedBook(book)
    setShowRatingModal(true)
  }

  const handleSubmitRating = async (rating) => {
    try {
      const response = await fetch(`/api/buku/${selectedBook.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ rating }),
      })

      if (response.ok) {
        setShowRatingModal(false)
        fetchBooks()
        toast.success("Rating berhasil disimpan!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Gagal menyimpan rating")
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
      toast.error("Terjadi kesalahan saat menyimpan rating")
    }
  }

  return (
    <>
      <Head title="BookApps - Koleksi Buku Digital" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">BookApps</h1>
                  <p className="text-blue-100">Koleksi Buku Digital</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-300"
                >
                  Masuk
                </a>
                <a
                  href="/register"
                  className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Daftar
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Temukan Buku
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {" "}
                  Favorit Anda
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Jelajahi koleksi buku digital terlengkap dan berikan rating untuk buku yang Anda sukai
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pagination.total || 0}</h3>
                  <p className="text-gray-600">Total Buku</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">4.8</h3>
                  <p className="text-gray-600">Rating Rata-rata</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
                  <p className="text-gray-600">Rating Diberikan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <BookFilter filters={filters} onFilterChange={handleFilterChange} loading={loading} />

            <div className="mb-8">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Memuat koleksi buku...</p>
                </div>
              ) : books.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada buku ditemukan</h3>
                  <p className="text-gray-600">Coba ubah filter pencarian Anda</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} onRate={handleRateBook} />
                  ))}
                </div>
              )}
            </div>

            {pagination.last_page > 1 && <BookPagination pagination={pagination} onPageChange={handlePageChange} />}
          </div>
        </section>

        <RatingModal
          show={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleSubmitRating}
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
    </>
  )
}
