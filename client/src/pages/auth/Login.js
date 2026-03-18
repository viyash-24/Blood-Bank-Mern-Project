import React, { useEffect } from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "./../../components/shared/Spinner";
import { toast } from "react-toastify";
import { BiDonateBlood } from "react-icons/bi";

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
        <div className="flex min-h-screen">
          {/* Left — Hero Panel */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-blood-600 via-blood-500 to-blood-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/15 blur-2xl" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col justify-center items-start px-16 xl:px-24 z-10">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 shadow-xl">
                <BiDonateBlood className="text-white" size={36} />
              </div>
              <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                Save Lives,<br />
                <span className="text-white/80">Donate Blood</span>
              </h1>
              <p className="text-lg text-white/60 max-w-md leading-relaxed">
                Join our network of donors, hospitals, and organizations working together to ensure blood availability for those in need.
              </p>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-sm text-white/50 mt-1">Active Donors</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-3xl font-bold text-white">50+</p>
                  <p className="text-sm text-white/50 mt-1">Hospitals</p>
                </div>
                <div className="w-px bg-white/20" />
                <div>
                  <p className="text-3xl font-bold text-white">10k+</p>
                  <p className="text-sm text-white/50 mt-1">Units Delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
            <div className="w-full max-w-md animate-fade-in-up">
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
                formTitle={"Login Page"}
                submitBtn={"Login"}
                formType={"login"}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
