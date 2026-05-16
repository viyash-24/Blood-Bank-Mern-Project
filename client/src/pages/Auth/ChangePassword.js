import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../services/API";
import { motion } from "framer-motion";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    try {
      setLoading(true);
      const { data } = await API.post("/auth/change-password", {
        userId: user?._id,
        newPassword,
      });
      if (data?.success) {
        toast.success("Password changed successfully! Welcome.");
        window.location.replace("/donor"); // Or wherever the user should go
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black p-4 sm:p-6">
      <div className="absolute inset-0 z-0">
         <motion.img 
            src={require("../../assets/auth-bg.png")}
            alt="Background"
            className="w-full h-full object-cover opacity-70"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
         />
         <div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px]" />
      </div>

      <motion.div
         initial={{ opacity: 0, scale: 0.95, y: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
         className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-glow-lg border border-white/50 relative z-10 my-8"
      >
         <div className="text-center mb-8">
           <h1 className="text-3xl font-extrabold text-dark-400 tracking-tight drop-shadow-sm">
             Change Password
           </h1>
           <p className="text-gray-600 mt-2 text-sm font-medium">Please change your temporary password to continue.</p>
         </div>
         
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
             <input
               type="password"
               value={newPassword}
               onChange={(e) => setNewPassword(e.target.value)}
               className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-500/20 outline-none transition-all"
               required
             />
           </div>
           <div>
             <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
             <input
               type="password"
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-blood-500 focus:ring-2 focus:ring-blood-500/20 outline-none transition-all"
               required
             />
           </div>
           <button
             type="submit"
             disabled={loading}
             className="w-full py-3.5 px-4 bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 text-white rounded-xl font-bold shadow-lg shadow-blood-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
           >
             {loading ? "Updating..." : "Change Password"}
           </button>
         </form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
