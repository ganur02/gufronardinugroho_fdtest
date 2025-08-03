"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white py-8 border-t border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-2"
          >
            <p className="text-slate-300 font-medium">© 2025 BooksApp. All rights reserved.</p>
            <p className="text-slate-400 text-sm">Made with ❤️ for book lovers everywhere</p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  )
}
