"use client"

import { Link, router, usePage } from "@inertiajs/react"
import { AnimatePresence, motion } from "framer-motion"
import { Book, BookOpen, Home, LogOut, Menu, Settings, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import ProfileDropdown from "../Profile/ProfileDropdown"

const menuItems = [
  { label: "Home", href: "/home", icon: Home },
  { label: "User", href: "/user", icon: User },
  { label: "Buku", href: "/buku", icon: Book },
]

const profileOptions = [
  { label: "Settings", href: "/profile", icon: "Settings" },
  { label: "Logout", action: "logout", icon: "LogOut" },
]

export default function Navbar({ title = "BooksApp" }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { url, props } = usePage()
  const user = props.auth?.user

  const isActiveLink = (href) => {
    return url === href || url.startsWith(href + "/")
  }

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isDrawerOpen])

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

  const handleProfileAction = (option) => {
    setIsDrawerOpen(false)

    if (option.action === "logout") {
      handleLogout()
    } else if (option.href) {
      router.visit(option.href)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/home">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <BookOpen size={24} className="text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-blue-600 transition-all duration-300">
                  {title}
                </h1>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center space-x-2">
              {menuItems.map((item, index) => {
                const isActive = isActiveLink(item.href)
                return (
                  <Link key={item.label} href={item.href} className="relative group">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 text-blue-600 shadow-md border border-blue-200/50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                      }`}
                    >
                      <item.icon
                        size={18}
                        className={`group-hover:scale-110 transition-transform duration-300 ${
                          isActive ? "text-blue-600" : ""
                        }`}
                      />
                      <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
                    </motion.div>
                    <motion.div
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500`}
                      initial={{ scaleX: isActive ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                )
              })}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <ProfileDropdown options={profileOptions} onAction={handleProfileAction} isLoading={isLoggingOut} />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-xl hover:bg-gray-100/80"
              >
                <Menu size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
                opacity: { duration: 0.3 },
              }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden border-l border-gray-200 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <BookOpen size={22} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-xl hover:bg-gray-100"
                >
                  <X size={24} />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto py-6 px-6">
                <div className="mb-10">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center">
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3" />
                    Navigation
                  </h3>
                  <div className="space-y-3">
                    {menuItems.map((item, index) => {
                      const isActive = isActiveLink(item.href)
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <Link
                            href={item.href}
                            className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group relative ${
                              isActive
                                ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 text-blue-600 shadow-md border border-blue-200/50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                            )}
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                                isActive
                                  ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
                                  : "bg-gray-100 group-hover:bg-blue-100"
                              }`}
                            >
                              <item.icon
                                size={20}
                                className={`group-hover:scale-110 transition-all duration-300 ${
                                  isActive ? "text-blue-600" : "group-hover:text-blue-600"
                                }`}
                              />
                            </div>
                            <span className={`text-lg ${isActive ? "font-semibold" : "font-medium"}`}>
                              {item.label}
                            </span>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6 flex items-center">
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full mr-3" />
                    Account
                  </h3>
                  <div className="space-y-3">
                    {profileOptions.map((option, index) => {
                      const isActive = option.href && isActiveLink(option.href)
                      const getIcon = (iconName) => {
                        switch (iconName) {
                          case "Settings":
                            return <Settings size={20} />
                          case "LogOut":
                            return isLoggingOut ? (
                              <div className="w-5 h-5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <LogOut size={20} />
                            )
                          default:
                            return <div className="w-5 h-5 bg-gray-400 rounded" />
                        }
                      }

                      return (
                        <motion.div
                          key={option.label}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (menuItems.length + index) * 0.1, duration: 0.5 }}
                        >
                          <div
                            role="button"
                            onClick={() => !isLoggingOut && handleProfileAction(option)}
                            className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-300 group relative cursor-pointer ${
                              isActive
                                ? "bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 text-blue-600 shadow-md border border-blue-200/50"
                                : option.action === "logout"
                                  ? `text-red-600 hover:text-red-700 hover:bg-red-50 ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""}`
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                            )}
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                                isActive
                                  ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
                                  : option.action === "logout"
                                    ? "bg-red-100 group-hover:bg-red-200"
                                    : "bg-gray-100 group-hover:bg-blue-100"
                              }`}
                            >
                              {getIcon(option.icon)}
                            </div>
                            <span className={`text-lg ${isActive ? "font-semibold" : "font-medium"}`}>
                              {option.label}
                              {isLoggingOut && option.action === "logout" && <span className="ml-2 text-sm">...</span>}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-auto p-6 border-t border-gray-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-gray-100">
                    {user?.foto ? (
                      <img
                        src={user.foto || "/placeholder.svg"}
                        alt={user.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 font-semibold text-lg">{user?.nama?.[0] ?? "?"}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-lg">{user?.nama ?? "Guest"}</p>
                    <p className="text-gray-500 text-sm">{user?.email ?? "-"}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
