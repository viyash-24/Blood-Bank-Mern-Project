import React, { useEffect } from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";
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
        <div className="flex min-h-screen">
          {/* Left — Hero Panel */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-dark-500 via-dark-400 to-dark-600"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0">
              <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-blood-600/10 blur-3xl" />
              <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-blood-500/5 blur-3xl" />
              <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-blood-600/8 blur-2xl" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-center items-start px-16 xl:px-24 z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blood-600 to-blood-400 flex items-center justify-center mb-8 shadow-glow-lg">
                <BiDonateBlood className="text-white" size={36} />
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                Join Our<br />
                <span className="bg-gradient-to-r from-blood-400 to-blood-300 bg-clip-text text-transparent">
                  Blood Bank Network
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-md leading-relaxed">
                Register as a donor, hospital, or organization to be part of the life-saving blood management ecosystem.
              </p>

              {/* Features */}
              <div className="mt-12 space-y-4">
                {[
                  "Real-time blood inventory tracking",
                  "Seamless donor-hospital coordination",
                  "Secure and role-based access control",
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blood-600/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-blood-500" />
                    </div>
                    <p className="text-sm text-gray-400">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — Form Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white overflow-y-auto"
          >
            <div className="w-full max-w-md py-8">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 mb-8 lg:hidden">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blood-600 to-blood-400 flex items-center justify-center shadow-glow">
                  <BiDonateBlood className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-dark-500">Blood Bank</h2>
                  <p className="text-xs text-gray-400">Management System</p>
                </div>
              </div>

              <Form
                formTitle={"Register"}
                submitBtn={"Register"}
                formType={"register"}
              />
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Register;
