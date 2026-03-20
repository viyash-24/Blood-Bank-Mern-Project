import React, { useCallback, useEffect, useState } from "react";
import Layout from "./../../components/shared/Layout/Layout";
import moment from "moment";
import { useSelector } from "react-redux";
import API from "../../services/API";
import { FiGrid, FiClock, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const OrganisationPage = () => {
  // get current user
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  //find org records
  const getOrg = useCallback(async () => {
    try {
      if (user?.role === "donar") {
        const { data } = await API.get("/inventory/get-orgnaisation");
        if (data?.success) {
          setData(data?.organisations);
        }
      }
      if (user?.role === "hospital") {
        const { data } = await API.get(
          "/inventory/get-orgnaisation-for-hospital"
        );
        if (data?.success) {
          setData(data?.organisations);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  useEffect(() => {
    getOrg();
  }, [getOrg]);

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-200 tracking-tight flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <FiGrid className="text-purple-600" size={20} />
          </div>
          Organisations
        </h1>
        <p className="text-sm text-gray-500 mt-1 ml-[52px]">
          View all registered organisations
        </p>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><FiMail size={14} /> Email</div>
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><FiPhone size={14} /> Phone</div>
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2"><FiMapPin size={14} /> Address</div>
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
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {(record.organisationName || "O").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-dark-200">{record.organisationName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">{record.address}</td>
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
              <FiGrid size={40} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No organisations found</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrganisationPage;
