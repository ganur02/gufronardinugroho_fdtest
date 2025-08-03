"use client"

import { Head, Link } from "@inertiajs/react"
import axios from "axios"
import { motion } from "framer-motion"
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, CheckCircle, Mail } from 'lucide-react'
import { useState } from "react"

export default function LupaPassword() {
  const [formData, setFormData] = useState({ email: "" })
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState("")
  const [statusType, setStatusType] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setErrors({})
    setStatus("")

    try {
      const response = await axios.post("/api/forgot-password", {
        email: formData.email,
      })

      setStatus(response.data.message)
      setStatusType("success")
      setFormData({ email: "" })
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {})
      } else if (error.response?.status === 404) {
        setErrors({ email: [error.response.data.message] })
      } else {
        setStatus("Terjadi kesalahan. Silakan coba lagi.")
        setStatusType("error")
      }
    } finally {
      setProcessing(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  return (
    <>
      <Head title="Lupa Password" />
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Kembali ke Login</span>
              </Link>
            </motion.div>

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
                Lupa Kata Sandi?
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-blue-600 mt-2 leading-relaxed"
              >
                Jangan khawatir! Masukkan email Anda dan kami akan kirimkan link untuk atur ulang kata sandi.
              </motion.p>
            </div>

            {status && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`mb-6 rounded-xl p-4 ${
                  statusType === "success"
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {statusType === "success" ? (
                    <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${statusType === "success" ? "text-green-800" : "text-red-800"}`}>
                      {statusType === "success" ? "Email berhasil dikirim!" : "Terjadi Kesalahan"}
                    </h3>
                    <p className={`text-sm mt-1 ${statusType === "success" ? "text-green-700" : "text-red-700"}`}>
                      {status}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200/50 p-8"
            >
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
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                        errors.email ? "border-red-300" : "border-blue-200"
                      }`}
                      placeholder="Masukkan alamat email"
                      required
                      autoFocus
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: processing ? 1 : 1.02 }}
                  whileTap={{ scale: processing ? 1 : 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Mengirim Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Link Reset</span>
                      <ArrowRight size={20} />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <h4 className="text-blue-800 font-semibold text-sm mb-2">Apa yang terjadi selanjutnya?</h4>
                <ul className="text-blue-600 text-sm space-y-1">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Kami akan mengirimkan tautan reset ke email Anda</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Klik tautan untuk membuat kata sandi baru</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Tautan berlaku selama 60 menit demi keamanan</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 text-center">
                <p className="text-blue-600">
                  Sudah ingat kata sandi?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                  >
                    Masuk di sini
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
