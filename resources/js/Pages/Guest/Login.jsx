"use client"
import { Head, Link, router } from "@inertiajs/react"
import axios from "axios"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useState } from "react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setErrors({})
    setMessage("")

    try {
      const response = await axios.post("/api/login", {
        email: formData.email,
        password: formData.password,
      })

      const { token, user, message } = response.data

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user", JSON.stringify(user))

 if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
      setMessage(message)

      setTimeout(() => {
        router.visit("/home")
      }, 1000)
    } catch (error) {
      setProcessing(false)

      if (error.response) {
        const { status, data } = error.response

        if (status === 422) {
          setErrors(data.errors || {})
        } else if (status === 401) {
          setMessage(data.message || "Email atau kata sandi salah.")
        } else if (status === 403) {
          setMessage(data.message || "Akun belum diverifikasi. Email verifikasi baru telah dikirim.")
        } else {
          setMessage("Terjadi kesalahan. Silakan coba lagi.")
        }
      } else if (error.request) {
        setMessage("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.")
      } else {
        setMessage("Terjadi kesalahan yang tidak terduga.")
      }
    }
  }

  return (
    <>
      <Head title="Login" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 rounded-2xl shadow-xl mb-4"
              >
                <BookOpen size={32} className="text-white" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent"
              >
                Selamat Datang Kembali
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-blue-600 mt-2"
              >
                Masuk ke akun BooksApp Anda
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200/50 p-8"
            >
              {message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm ${
                    message.includes("berhasil") || message.includes("successful")
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-800 mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={20} className="text-blue-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                        errors.email ? "border-red-300" : "border-blue-200"
                      }`}
                      placeholder="Masukkan email Anda"
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-blue-800 mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-blue-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                        errors.password ? "border-red-300" : "border-blue-200"
                      }`}
                      placeholder="Masukkan kata sandi"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) => handleInputChange("remember", e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-blue-700">Ingat saya</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Lupa kata sandi?
                  </Link>
                </div>

                <motion.button
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>{processing ? "Masuk..." : "Masuk"}</span>
                  {!processing && <ArrowRight size={20} />}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-blue-600">
                  Belum punya akun?{" "}
                  <Link href="/register" className="font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                    Daftar di sini
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
