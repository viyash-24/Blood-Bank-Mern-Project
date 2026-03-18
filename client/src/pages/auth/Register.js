import React from "react";
import Form from "../../components/shared/Form/Form";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";
import { motion } from "framer-motion";

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);
  return (
    <>
      {error && <span>{alert(error)}</span>}
      {loading ? (
        <Spinner />
      ) : (
        <div className="row g-0 align-items-center justify-content-center" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="col-md-7 form-banner d-none d-md-block"
          >
            <img 
              src="./assets/images/banner2.jpg" 
              alt="registerImage" 
              style={{ width: "100%", height: "100vh", objectFit: "cover", borderRadius: "0 20px 20px 0", boxShadow: "5px 0 15px rgba(0,0,0,0.1)" }}
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.5 }}
            className="col-md-5 form-container p-5"
          >
            <div className="card shadow-lg p-4 w-100" style={{ borderRadius: "15px", border: "none" }}>
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
