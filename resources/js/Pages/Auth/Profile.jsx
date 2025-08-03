"use client"
import AuthLayout from "@/Layouts/AuthLayout"
import { Head, useForm } from "@inertiajs/react"
import { Camera, Edit3, Eye, EyeOff, Lock, Mail, Save, Settings, Upload, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Profile({ flash }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [photoPreview, setPhotoPreview] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("api_token")
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        profileForm.setData({
          nama: data.user.nama || "",
          email: data.user.email || "",
          foto: null,
        })
      }
    } catch (error) {
      console.error("Gagal mengambil data profil:", error)
      toast.error("Gagal mengambil data profil")
    } finally {
      setLoading(false)
    }
  }

  const profileForm = useForm({
    nama: "",
    email: "",
    foto: null,
  })

  const passwordForm = useForm({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  })

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar. Maksimal 2MB")
        return
      }

      profileForm.setData("foto", file)
      const reader = new FileReader()
      reader.onload = (e) => setPhotoPreview(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    profileForm.setData("processing", true)

    const formData = new FormData()
    formData.append("nama", profileForm.data.nama)
    formData.append("email", profileForm.data.email)
    if (profileForm.data.foto) {
      formData.append("foto", profileForm.data.foto)
    }

    try {
      const token = localStorage.getItem("api_token")
      const response = await fetch("/api/auth/profile/update", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setIsEditingProfile(false)
        setPhotoPreview(null)
        profileForm.clearErrors()
        toast.success("Profil berhasil diperbarui!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        if (data.errors) {
          profileForm.setError(data.errors)
          Object.keys(data.errors).forEach((key) => {
            toast.error(data.errors[key][0] || data.errors[key])
          })
        } else {
          toast.error(data.message || "Gagal memperbarui profil")
        }
        console.error("Update failed:", data)
      }
    } catch (error) {
      console.error("Gagal memperbarui profil:", error)
      toast.error("Terjadi kesalahan saat memperbarui profil", {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      profileForm.setData("processing", false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    passwordForm.setData("processing", true)

    try {
      const token = localStorage.getItem("api_token")
      const response = await fetch("/api/auth/profile/password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: passwordForm.data.current_password,
          new_password: passwordForm.data.new_password,
          new_password_confirmation: passwordForm.data.new_password_confirmation,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsEditingPassword(false)
        passwordForm.reset()
        passwordForm.clearErrors()
        toast.success("Password berhasil diubah!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
      } else {
        if (data.errors) {
          passwordForm.setError(data.errors)
          Object.keys(data.errors).forEach((key) => {
            toast.error(data.errors[key][0] || data.errors[key])
          })
        } else {
          toast.error(data.message || "Gagal memperbarui password")
        }
        console.error("Password update failed:", data)
      }
    } catch (error) {
      console.error("Gagal memperbarui kata sandi:", error)
      toast.error("Terjadi kesalahan saat memperbarui password", {
        position: "top-right",
        autoClose: 5000,
      })
    } finally {
      passwordForm.setData("processing", false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Memuat profil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Tidak dapat memuat data profil</p>
        </div>
      </div>
    )
  }

  return (
    <AuthLayout>
      <Head title="Profil" />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {flash?.message && (
            <div className="mb-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-md">
              <p className="font-medium text-center">{flash.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white">Informasi Profil</h2>
                    </div>
                    <button
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      {isEditingProfile ? (
                        <>
                          <X className="w-4 h-4" />
                          <span>Batal</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          <span>Ubah</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {!isEditingProfile ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="bg-blue-500 p-3 rounded-lg">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nama Lengkap</p>
                          <p className="text-lg font-semibold text-gray-900">{user.nama}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="bg-gray-600 p-3 rounded-lg">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Alamat Email</p>
                          <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-6">

                      <div className="text-center">
                        <div className="relative inline-block">
                          <div className="w-28 h-28 bg-gray-100 rounded-xl mx-auto flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                            {photoPreview ? (
                              <img
                                src={photoPreview || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : user.foto ? (
                              <img
                                src={`/${user.foto}`}
                                alt="Foto Profil"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <User className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                          <label className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-2 shadow-lg transition-colors cursor-pointer border-2 border-white">
                            <Camera className="w-4 h-4 text-white" />
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                          </label>
                        </div>
                        <div className="mt-3">
                          <label className="inline-flex items-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium cursor-pointer transition-colors border border-blue-200">
                            <Upload className="w-4 h-4 mr-2" />
                            Pilih Foto Profil
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                          </label>
                          <p className="text-sm text-gray-500 mt-2">
                            {photoPreview ? "Foto baru dipilih" : "JPG, PNG maksimal 2MB"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={profileForm.data.nama}
                            onChange={(e) => profileForm.setData("nama", e.target.value)}
                            placeholder="Masukkan nama lengkap Anda"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                          />
                        </div>
                        {profileForm.errors.nama && (
                          <p className="text-sm text-red-600 mt-1">{profileForm.errors.nama}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            value={profileForm.data.email}
                            onChange={(e) => profileForm.setData("email", e.target.value)}
                            placeholder="Masukkan alamat email Anda"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                          />
                        </div>
                        {profileForm.errors.email && (
                          <p className="text-sm text-red-600 mt-1">{profileForm.errors.email}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={profileForm.processing}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>{profileForm.processing ? "Menyimpan..." : "Simpan Perubahan"}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-800 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-orange-500 p-2 rounded-lg">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Keamanan</h3>
                    </div>
                    <button
                      onClick={() => setIsEditingPassword(!isEditingPassword)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      {isEditingPassword ? (
                        <>
                          <X className="w-4 h-4" />
                          <span>Batal</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4" />
                          <span>Ubah</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {!isEditingPassword ? (
                    <div className="text-center py-6">
                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <Lock className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                        <p className="text-gray-600">Klik "Ubah" untuk mengganti kata sandi Anda</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.data.current_password}
                            onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 bg-white"
                            placeholder="Masukkan kata sandi saat ini"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {passwordForm.errors.current_password && (
                          <p className="text-sm text-red-600 mt-1">{passwordForm.errors.current_password}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Baru</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.data.new_password}
                            onChange={(e) => passwordForm.setData("new_password", e.target.value)}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 bg-white"
                            placeholder="Masukkan kata sandi baru"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {passwordForm.errors.new_password && (
                          <p className="text-sm text-red-600 mt-1">{passwordForm.errors.new_password}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Konfirmasi Kata Sandi Baru
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.data.new_password_confirmation}
                            onChange={(e) => passwordForm.setData("new_password_confirmation", e.target.value)}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 bg-white"
                            placeholder="Ulangi kata sandi baru"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {passwordForm.errors.new_password_confirmation && (
                          <p className="text-sm text-red-600 mt-1">{passwordForm.errors.new_password_confirmation}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={passwordForm.processing}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>{passwordForm.processing ? "Memperbarui..." : "Perbarui Kata Sandi"}</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </AuthLayout>
  )
}
