import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";
import { FiHeart, FiClock, FiMail, FiPhone, FiUser } from "react-icons/fi";

const Donar = () => {
  const [data, setData] = useState([]);
  //find donar records
  const getDonars = async () => {
    try {
      const { data } = await API.get("/inventory/get-donars");
      if (data?.success) {
        setData(data?.donars);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDonars();
  }, []);

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blood-50 flex items-center justify-center">
            <FiHeart className="text-blood-600" size={20} />
          </div>
          Donor Management
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-[52px]">
          All registered donors in the system
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><FiUser size={14} /> Name</div>
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><FiMail size={14} /> Email</div>
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><FiPhone size={14} /> Phone</div>
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><FiClock size={14} /> Date</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50/80 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blood-500 to-blood-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(record.name || record.organisationName || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-dark-200">
                        {record.name || record.organisationName + " (ORG)"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.phone}</td>
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
              <FiHeart size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No donors found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Donar;
