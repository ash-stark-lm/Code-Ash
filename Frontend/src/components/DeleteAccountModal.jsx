import React from 'react'
import { motion } from 'framer-motion'

const DeleteAccountModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1a1a1a] rounded-2xl border border-[#333] max-w-md w-full p-6 text-white shadow-lg"
      >
        <h2 className="text-2xl font-bold text-red-500 mb-2">
          Confirm Deletion
        </h2>
        <p className="text-[#ccc] mb-6">
          Are you sure you want to delete your account? This action is
          irreversible and all your data will be lost.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[#333] hover:bg-[#2a2a2a] transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 shadow-md text-white transition cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default DeleteAccountModal
