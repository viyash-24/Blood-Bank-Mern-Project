import React, { useEffect } from "react";
import Form from "../../components/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";
import { BiDonateBlood } from "react-icons/bi";
import { motion } from "framer-motion";

const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black p-4 sm:p-6">
          {/* Full Screen Animated Background image */}
          <div className="absolute inset-0 z-0">
             <motion.img 
                src={require("../../assets/auth-bg.png")}
                alt="Background"
                className="w-full h-full object-cover opacity-70"
                initial={{ scale: 1 }}
                animate={{ scale: 1.15 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
             />
             {/* Overlay to ensure the center focuses on the card deeply */}
             <div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px]" />
          </div>

          {/* Centered Glassmorphic Form Card */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
             className="w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-glow-lg border border-white/50 relative z-10 my-8"
          >
             <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blood-600 to-blood-400 rounded-2xl shadow-lg mb-4">
                  <BiDonateBlood className="text-white drop-shadow-md" size={32} />
               </div>
               <h1 className="text-3xl font-extrabold text-dark-400 tracking-tight drop-shadow-sm">
                 Blood Bank
               </h1>
               <p className="text-gray-600 mt-2 text-sm font-medium">Welcome back! Sign in to make an impact.</p>
             </div>
             
             <Form
               formTitle=""
               submitBtn="Login"
               formType="login"
             />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Login;
