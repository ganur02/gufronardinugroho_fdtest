"use client"

import { Head } from "@inertiajs/react"
import axios from "axios"
import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Eye, EyeOff, ImageIcon, Lock, Mail, User } from "lucide-react"
import { useState } from "react"

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    password_confirmation: "",
    foto: null,
  })

  const handleInputChange = (field, value) => {
    if (field === "foto" && formData.foto) {
      URL.revokeObjectURL(URL.createObjectURL(formData.foto))
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
      const maxSize = 2048 * 1024
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          foto: "File harus berupa JPG, JPEG, atau PNG",
        }))
        return
      }
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          foto: "Ukuran file maksimal 2MB",
        }))
        return
      }
      setFormData((prev) => ({
        ...prev,
        foto: file,
      }))
      if (errors.foto) {
        setErrors((prev) => ({
          ...prev,
          foto: "",
        }))
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setErrors({})
    setSuccessMessage("")

    const newErrors = {}

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi"
    }

    if (!formData.password) {
      newErrors.password = "Kata sandi wajib diisi"
    } else if (formData.password.length < 6) {
      newErrors.password = "Kata sandi minimal 6 karakter"
    }

    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Konfirmasi kata sandi tidak cocok"
    }

    if (!formData.foto) {
      newErrors.foto = "Foto profil wajib diunggah"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setProcessing(false)
      return
    }

    try {
      const apiFormData = new FormData()
      apiFormData.append("nama", formData.nama)
      apiFormData.append("email", formData.email)
      apiFormData.append("password", formData.password)
      apiFormData.append("foto", formData.foto)

      const response = await axios.post("/api/register", apiFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      })

      setSuccessMessage(response.data.message)

      setFormData({
        nama: "",
        email: "",
        password: "",
        password_confirmation: "",
        foto: null,
      })

      if (formData.foto) {
        URL.revokeObjectURL(URL.createObjectURL(formData.foto))
      }

      const fileInput = document.getElementById("foto")
      if (fileInput) fileInput.value = ""

      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response
        if (status === 422 && data.errors) {
          setErrors(data.errors)
        } else if (data.message) {
          setErrors({ general: data.message })
        } else {
          setErrors({ general: "Pendaftaran gagal. Silakan coba lagi." })
        }
      } else if (error.request) {
        setErrors({ general: "Terjadi kesalahan jaringan. Cek koneksi internet Anda." })
      } else {
        setErrors({ general: "Terjadi kesalahan yang tidak terduga." })
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <Head title="Register" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4 py-12">
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
                Daftar ke BooksApp
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-blue-600 mt-2"
              >
                Buat akun untuk mulai menggunakan aplikasi
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-blue-200/50 p-8"
            >
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-green-800 text-sm font-medium">{successMessage}</p>
                      <p className="text-green-600 text-xs mt-1">Mengalihkan ke halaman login...</p>
                      <p className="text-green-600 text-xs mt-1">Silakan cek email Anda untuk verifikasi.</p>
                    </div>
                  </div>
                </div>
              )}


              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-semibold text-blue-800 mb-2">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={20} className="text-blue-400" />
                    </div>
                    <input
                      id="nama"
                      type="text"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="Masukkan nama lengkap Anda"
                      required
                    />
                  </div>
                  {errors.nama && <p className="mt-1 text-sm text-red-600">{errors.nama}</p>}
                </div>

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
                      className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="Masukkan email Anda"
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="foto" className="block text-sm font-semibold text-blue-800 mb-2">
                    Foto Profil <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="foto"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    <div
                      onClick={() => document.getElementById("foto").click()}
                      className="w-full h-40 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50/50 hover:bg-blue-100/50 transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    >
                      {!formData.foto ? (
                        <div className="flex flex-col items-center justify-center h-full text-blue-500 group-hover:text-blue-600 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center mb-3 transition-colors">
                            <ImageIcon size={24} />
                          </div>
                          <p className="text-sm font-medium mb-1">Klik untuk unggah foto</p>
                          <p className="text-xs text-blue-400">JPG, JPEG, PNG (maks. 2MB)</p>
                        </div>
                      ) : (
                        <div className="relative h-full group">
                          <img
                            src={URL.createObjectURL(formData.foto)}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-xl"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                            <div className="text-white text-center">
                              <ImageIcon size={24} className="mx-auto mb-2" />
                              <p className="text-sm font-medium">Klik untuk ganti</p>
                            </div>
                          </div>
                          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <p className="text-xs text-gray-700 font-medium truncate max-w-32">{formData.foto.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors.foto && <p className="mt-2 text-sm text-red-600">{errors.foto}</p>}
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
                      className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="Buat kata sandi (min. 6 karakter)"
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
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-semibold text-blue-800 mb-2">
                    Konfirmasi Kata Sandi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={20} className="text-blue-400" />
                    </div>
                    <input
                      id="password_confirmation"
                      type={showPasswordConfirmation ? "text" : "password"}
                      value={formData.password_confirmation}
                      onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      placeholder="Konfirmasi kata sandi Anda"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <span>{processing ? "Membuat Akun..." : "Buat Akun"}</span>
                  {!processing && <ArrowRight size={20} />}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-blue-600">
                  Sudah punya akun?{" "}
                  <a href="/login" className="font-semibold text-blue-700 hover:text-blue-900 transition-colors">
                    Masuk di sini
                  </a>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
