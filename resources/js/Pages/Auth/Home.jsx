"use client"

import AuthLayout from "@/Layouts/AuthLayout"
import { Head } from "@inertiajs/react"
import { AlertCircle, CheckCircle, Clock, HomeIcon, LogOut, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"

export default function Home({ flash }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchHomeData()
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchHomeData = async () => {
    try {
      const token = localStorage.getItem("api_token")
      const response = await fetch("/api/auth/home", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error("Error mengambil data beranda:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("api_token")
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      localStorage.removeItem("api_token")
      window.location.href = "/login"
    } catch (error) {
      console.error("Error saat logout:", error)
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getGreeting = () => {
    const hour = new Date()
      .toLocaleString("en-US", { timeZone: "Asia/Jakarta", hour12: false })
      .split(",")[1]
      .trim()
      .split(":")[0]
    const currentHour = Number.parseInt(hour)

    if (currentHour < 11) return "Selamat Pagi"
    if (currentHour < 15) return "Selamat Siang"
    if (currentHour < 18) return "Selamat Sore"
    return "Selamat Malam"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat dasbor...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Tidak dapat memuat data dasbor</p>
        </div>
      </div>
    )
  }

  return (
    <AuthLayout>
      <Head title="Home" />
      <div className="min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Home</h1>
                  <p className="text-blue-100">Selamat datang kembali, {user.nama || "Pengguna"}!</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="hidden md:block text-right">
                  <p className="text-white font-medium">{formatTime(currentTime)}</p>
                  <p className="text-blue-100 text-sm">{formatDate(currentTime)}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-all duration-300"
                  title="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {flash?.message && (
            <div className="mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 hover:scale-[1.02]">
              <p className="font-medium">{flash.message}</p>
            </div>
          )}

          <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {getGreeting()}, {user.nama || "Pengguna"}!
                  </h2>
                  <p className="text-blue-100 text-lg">Di halaman home Book App</p>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status Akun</p>
                  <p className="text-2xl font-bold text-gray-900">Aktif</p>
                </div>
                <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-green-600">
                  <span className="text-sm font-medium">Akun Anda aktif</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Status Email</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user.email_verified ? "Terverifikasi" : "Menunggu"}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    user.email_verified
                      ? "bg-gradient-to-br from-blue-400 to-blue-600"
                      : "bg-gradient-to-br from-yellow-400 to-orange-600"
                  }`}
                >
                  {user.email_verified ? (
                    <Mail className="w-6 h-6 text-white" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className={`flex items-center ${user.email_verified ? "text-blue-600" : "text-orange-600"}`}>
                  <span className="text-sm font-medium">
                    {user.email_verified ? "Email terkonfirmasi" : "Perlu verifikasi"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Waktu Sesi</p>
                  <p className="text-2xl font-bold text-gray-900">{formatTime(currentTime)}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-indigo-600">
                  <span className="text-sm font-medium">Waktu Indonesia (WIB)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pengguna</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Nama</p>
                <p className="text-lg text-gray-900">{user.nama || "Tidak tersedia"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-lg text-gray-900">{user.email || "Tidak tersedia"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
