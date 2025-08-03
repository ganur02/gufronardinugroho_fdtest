"use client"

import { Link } from "@inertiajs/react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { useEffect, useState } from "react"

const iconMap = {
  User,
  Settings,
  LogOut,
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

export default function ProfileDropdown({ options }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    function handleClickOutside(event) {
      if (!event.target.closest(".profile-dropdown")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative profile-dropdown">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-blue-400/30"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full flex items-center justify-center shadow-inner">
          <User size={16} className="text-blue-900" />
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-blue-200/50 py-2 z-50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
            {options.map((option, index) => {
              const IconComponent = iconMap[option.icon]

              return (
                <motion.div
                  key={option.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {option.label === "Logout" ? (
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left flex items-center space-x-3 px-4 py-3 text-blue-700 hover:text-blue-800 hover:bg-blue-50/80 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                        <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ) : (
                    <Link
                      href={option.href}
                      className="flex items-center space-x-3 px-4 py-3 text-blue-700 hover:text-blue-800 hover:bg-blue-50/80 transition-all duration-200 group"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                        <IconComponent size={16} className="group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
