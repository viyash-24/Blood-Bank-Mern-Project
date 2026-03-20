import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/Layout/Layout";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from "moment";
import { FiPlus, FiDroplet, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";

const HomePage = () => {
  const { loading, error, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  //get blood record function
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-inventory");
      if (data?.success) {
        setData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodRecords();
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    }
  }, [user?.role, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Layout>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
                  <FiDroplet className="text-blood-600" size={20} />
                </div>
                Blood Inventory
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-[52px]">
                Manage and track all blood records
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blood-600 to-blood-500 hover:from-blood-700 hover:to-blood-600 rounded-xl shadow-lg shadow-blood-600/20 hover:shadow-blood-600/30 transition-all duration-300 active:scale-[0.98]"
            >
              <FiPlus size={18} />
              Add Inventory
            </button>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Blood Group</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Type</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Donor Email</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Time & Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data?.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-blood-600 bg-blood-50 rounded-lg">
                          <FiDroplet size={14} />
                          {record.bloodGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                          record.inventoryType === "in"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            record.inventoryType === "in" ? "bg-green-500" : "bg-red-500"
                          }`} />
                          {record.inventoryType === "in" ? "IN" : "OUT"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-dark-200">
                        {record.quantity} <span className="text-gray-400 font-normal">ML</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.email}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FiClock size={14} className="text-gray-400" />
                          {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {data?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <FiDroplet size={40} className="mb-3 opacity-30" />
                  <p className="text-sm font-medium">No inventory records found</p>
                  <p className="text-xs mt-1">Click "Add Inventory" to create a new record</p>
                </div>
              )}
            </div>
          </div>

          {/* Modal */}
          <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
      )}
    </Layout>
  );
};

export default HomePage;
