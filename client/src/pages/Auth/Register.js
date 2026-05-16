import React, { useEffect } from "react";
import Form from "../../components/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";
import { motion } from "framer-motion";
import { BiDonateBlood } from "react-icons/bi";
import { toast } from "react-toastify";

const Register = () => {
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
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black p-4 sm:p-6 py-12">
          {/* Full Screen Animated Background image */}
          <div className="absolute inset-0 z-0">
             <motion.img 
                src={require("../../assets/auth-bg.png")}
                alt="Background"
                className="w-full h-full object-cover opacity-70 flex transform scale-x-[-1]"
                initial={{ scale: 1.15 }}
                animate={{ scale: 1 }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
             />
             {/* Gradient Overlay */}
             <div className="absolute inset-0 bg-black/40 pointer-events-none backdrop-blur-[2px]" />
          </div>

          {/* Centered Glassmorphic Form Card */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95, y: -20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
             className="w-full max-w-[500px] bg-white/85 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-glow-lg border border-white/50 relative z-10 my-8"
          >
             <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blood-600 to-blood-400 rounded-2xl shadow-lg mb-4">
                  <BiDonateBlood className="text-white drop-shadow-md" size={32} />
               </div>
               <h2 className="text-3xl font-extrabold text-dark-500 tracking-tight drop-shadow-sm">Join Us Today</h2>
               <p className="text-gray-600 mt-2 text-sm font-medium">Create an account and help us save lives.</p>
             </div>
             
             <Form
               formTitle=""
               submitBtn="Create Account"
               formType="register"
             />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Register;
