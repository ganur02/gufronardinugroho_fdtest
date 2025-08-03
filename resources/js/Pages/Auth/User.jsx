"use client"

import UserFilter from "@/Components/Ui/Auth/UserFilter"
import UserPagination from "@/Components/Ui/Auth/UserPagination"
import UserTable from "@/Components/Ui/Auth/UserTable"
import AuthLayout from "@/Layouts/AuthLayout"
import { Head } from "@inertiajs/react"
import { RefreshCw, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function User({ flash }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters] = useState({
    search: "",
    verified: "",
    page: 1,
  })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("api_token")

      const params = new URLSearchParams()
      if (filters.search) params.append("search", filters.search)
      if (filters.verified !== "") params.append("verified", filters.verified)
      params.append("page", filters.page.toString())

      const response = await fetch(`/api/auth/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUsers(result.data.data)
          setPagination({
            current_page: result.data.current_page,
            last_page: result.data.last_page,
            per_page: result.data.per_page,
            total: result.data.total,
            from: result.data.from,
            to: result.data.to,
          })
        }
      }
    } catch (error) {
      console.error("Error mengambil data pengguna:", error)
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
    fetchUsers()
  }

  return (
    <AuthLayout>
      <Head title="Manajemen Pengguna" />
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Manajemen Pengguna</h1>
                  <p className="text-blue-100">Kelola data pengguna sistem</p>
                </div>
              </div>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {flash?.message && (
            <div className="mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-4 rounded-lg shadow-lg">
              <p className="font-medium">{flash.message}</p>
            </div>
          )}
   
          <UserFilter filters={filters} onFilterChange={handleFilterChange} loading={loading} />

          <div className="mb-6 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total || 0}</p>
              </div>
              <div className="text-sm text-gray-500">
                {pagination.from && pagination.to
                  ? `Menampilkan ${pagination.from}-${pagination.to} dari ${pagination.total} pengguna`
                  : "Memuat data..."}
              </div>
            </div>
          </div>

          <UserTable users={users} loading={loading} />

          {pagination.last_page > 1 && <UserPagination pagination={pagination} onPageChange={handlePageChange} />}
        </div>
      </div>
    </AuthLayout>
  )
}
